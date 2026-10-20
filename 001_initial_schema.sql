create extension if not exists pgcrypto;
create type public.app_role as enum ('student','verifier','admin');
create type public.achievement_status as enum ('pending','approved','rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Student' check (char_length(full_name) between 1 and 100),
  avatar_url text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 4 and 120),
  description text not null check (char_length(description) between 10 and 1500),
  category text not null check (category in ('academic_olympiad','competition','project','chess','sports','volunteering','school_event','certificate','other')),
  achievement_date date not null default current_date,
  status public.achievement_status not null default 'pending',
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  reviewed_by uuid references public.profiles(id),
  review_note text check (review_note is null or char_length(review_note) <= 1000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((status = 'approved' and reviewed_by is not null and reviewed_at is not null) or status <> 'approved')
);
create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid unique references public.achievements(id) on delete restrict,
  amount integer not null check (amount > 0),
  reason text not null check (char_length(reason) between 1 and 300),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  body text not null check (char_length(body) between 1 and 3000),
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target_type text not null,
  target_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index achievements_student_created_idx on public.achievements(student_id,created_at desc);
create index achievements_status_created_idx on public.achievements(status,created_at asc);
create index xp_transactions_student_idx on public.xp_transactions(student_id,created_at desc);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,full_name) values(new.id,coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'),''),'Student'));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create function public.current_role() returns public.app_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create function public.approve_achievement(p_achievement_id uuid,p_xp integer,p_review_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare v_achievement public.achievements%rowtype; v_actor uuid := auth.uid();
begin
  if v_actor is null or public.current_role() not in ('verifier','admin') then raise exception 'Not authorized'; end if;
  if p_xp < 1 or p_xp > 10000 then raise exception 'XP amount outside allowed limits'; end if;
  select * into v_achievement from public.achievements where id=p_achievement_id for update;
  if not found then raise exception 'Achievement not found'; end if;
  if v_achievement.status <> 'pending' then raise exception 'Only pending achievements can be approved'; end if;
  update public.achievements set status='approved',xp_awarded=p_xp,reviewed_by=v_actor,review_note=left(p_review_note,1000),reviewed_at=now(),updated_at=now() where id=p_achievement_id;
  insert into public.xp_transactions(student_id,achievement_id,amount,reason,created_by) values(v_achievement.student_id,v_achievement.id,p_xp,'Approved achievement: '||v_achievement.title,v_actor);
  insert into public.audit_logs(actor_id,action,target_type,target_id,details) values(v_actor,'achievement_approved','achievement',v_achievement.id,jsonb_build_object('xp',p_xp));
end; $$;

create function public.reject_achievement(p_achievement_id uuid,p_review_note text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_achievement public.achievements%rowtype; v_actor uuid := auth.uid();
begin
  if v_actor is null or public.current_role() not in ('verifier','admin') then raise exception 'Not authorized'; end if;
  if p_review_note is null or char_length(trim(p_review_note)) < 3 then raise exception 'A rejection reason is required'; end if;
  select * into v_achievement from public.achievements where id=p_achievement_id for update;
  if not found then raise exception 'Achievement not found'; end if;
  if v_achievement.status <> 'pending' then raise exception 'Only pending achievements can be rejected'; end if;
  update public.achievements set status='rejected',reviewed_by=v_actor,review_note=left(p_review_note,1000),reviewed_at=now(),updated_at=now() where id=p_achievement_id;
  insert into public.audit_logs(actor_id,action,target_type,target_id,details) values(v_actor,'achievement_rejected','achievement',v_achievement.id,jsonb_build_object('reason',left(p_review_note,1000)));
end; $$;
revoke all on function public.approve_achievement(uuid,integer,text) from public,anon;
revoke all on function public.reject_achievement(uuid,text) from public,anon;
grant execute on function public.approve_achievement(uuid,integer,text) to authenticated;
grant execute on function public.reject_achievement(uuid,text) to authenticated;

create view public.leaderboard with (security_invoker=true) as
select p.id as student_id,p.full_name,coalesce(sum(x.amount),0)::bigint as total_xp,count(distinct a.id)::bigint as achievement_count
from public.profiles p left join public.xp_transactions x on x.student_id=p.id
left join public.achievements a on a.student_id=p.id and a.status='approved'
group by p.id,p.full_name;

alter table public.profiles enable row level security;
alter table public.achievements enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.announcements enable row level security;
alter table public.audit_logs enable row level security;

create policy "Signed-in users can view profiles" on public.profiles for select to authenticated using (true);
create policy "Students update own profile" on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy "Own achievements or verifier access" on public.achievements for select to authenticated using (student_id=(select auth.uid()) or public.current_role() in ('verifier','admin'));
create policy "Submit own pending achievements" on public.achievements for insert to authenticated with check (student_id=(select auth.uid()) and status='pending' and xp_awarded=0 and reviewed_by is null and reviewed_at is null);
create policy "Read own XP or verifier access" on public.xp_transactions for select to authenticated using (student_id=(select auth.uid()) or public.current_role() in ('verifier','admin'));
create policy "Read published announcements" on public.announcements for select to authenticated using (published=true or public.current_role()='admin');
create policy "Admins manage announcements" on public.announcements for all to authenticated using (public.current_role()='admin') with check (public.current_role()='admin');
create policy "Staff read audit logs" on public.audit_logs for select to authenticated using (public.current_role() in ('verifier','admin'));
create policy "No direct audit log inserts" on public.audit_logs for insert to authenticated with check (false);

grant usage on schema public to anon,authenticated;
grant select on public.profiles to authenticated;
grant update(full_name,avatar_url) on public.profiles to authenticated;
grant select,insert on public.achievements to authenticated;
grant select on public.xp_transactions to authenticated;
grant select,insert,update,delete on public.announcements to authenticated;
grant select on public.audit_logs to authenticated;
grant select on public.leaderboard to authenticated;

-- After the intended staff member registers, assign their role from the Supabase SQL Editor:
-- update public.profiles set role='admin' where id=(select id from auth.users where email='trusted-admin@example.com');
