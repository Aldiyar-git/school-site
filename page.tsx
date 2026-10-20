import Link from "next/link";
import { ArrowRight, Award, BarChart3, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, Trophy, Users } from "lucide-react";
import { Brand, SiteFooter } from "@/components/brand";
const features = [
  { icon: Award, title: "Every achievement matters", text: "Bring academic wins, creative projects, sport, and community contribution into one student profile." },
  { icon: BarChart3, title: "Progress you can see", text: "Turn verified achievements into XP, levels, and a clear picture of how you are growing." },
  { icon: ShieldCheck, title: "Recognition you can trust", text: "An authorized review workflow helps ensure points are awarded for real achievements." }
];
const examples = [
  { rank:"01", title:"Academic excellence", xp:"1,240 XP" },
  { rank:"02", title:"Science & projects", xp:"980 XP" },
  { rank:"03", title:"Sports & teamwork", xp:"760 XP" }
];
export default function Home() {
  return <main className="overflow-hidden">
    <header className="container-shell flex h-20 items-center justify-between"><Brand />
      <nav className="hidden items-center gap-8 text-sm font-semibold text-[#526158] md:flex"><a href="#how">How it works</a><a href="#features">Features</a><Link href="/login">Student portal</Link></nav>
      <div className="flex items-center gap-3"><Link href="/login" className="hidden text-sm font-bold text-[#123d32] sm:inline">Sign in</Link><Link href="/signup" className="btn-primary !px-4 !py-2.5 text-sm">Get started <ArrowRight size={15}/></Link></div>
    </header>
    <section className="container-shell grid items-center gap-12 pb-20 pt-12 md:grid-cols-[1.05fr_.95fr] md:pb-28 md:pt-20">
      <div><div className="inline-flex items-center gap-2 rounded-full border border-[#e4e7df] bg-white/70 px-3 py-2 text-xs font-bold text-[#526158]"><Sparkles size={14} className="text-[#b58b35]"/> A new way to celebrate student growth</div>
        <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.04] tracking-[-.055em] sm:text-6xl lg:text-7xl">Small steps.<br/><span className="text-[#27634f]">Remarkable</span> growth.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[#68766e]">A home for student achievements, meaningful progress, and the moments that make a school community stronger.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/signup" className="btn-primary">Start your journey <ArrowRight size={17}/></Link><a href="#how" className="btn-secondary">Explore the platform</a></div>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#68766e]"><span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#27634f]"/> Verified achievements</span><span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#27634f]"/> Fair XP system</span></div>
      </div>
      <div className="surface relative p-5 shadow-[0_28px_90px_-45px_rgba(18,61,50,.32)] sm:p-7">
        <div className="flex items-center justify-between"><div><p className="text-sm font-bold">Achievement overview</p><p className="mt-1 text-xs text-[#68766e]">A preview of the student experience</p></div><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#f4ecd9] text-[#a47e2e]"><Trophy size={20}/></div></div>
        <div className="mt-6 rounded-2xl bg-[#123d32] p-5 text-white"><div className="flex items-center justify-between"><span className="text-sm text-white/70">Your growth journey</span><Award size={19} className="text-[#e2c47e]"/></div><div className="mt-4 flex items-end justify-between"><div><p className="text-3xl font-semibold">Level 04</p><p className="mt-1 text-sm text-white/65">Curious achiever</p></div><p className="text-sm font-bold text-[#e2c47e]">680 XP</p></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[68%] rounded-full bg-[#d8b66a]"/></div><p className="mt-2 text-xs text-white/60">Illustrative preview · not real student data</p></div>
        <div className="mt-6 flex items-center justify-between"><p className="font-bold">Leaderboard preview</p><span className="rounded-full bg-[#edf2ed] px-2.5 py-1 text-xs font-bold text-[#27634f]">Example data</span></div>
        <div className="mt-3 space-y-2">{examples.map((item)=><div key={item.rank} className="flex items-center gap-3 rounded-xl border border-[#edf0e9] p-3"><span className="w-6 text-xs font-extrabold text-[#a47e2e]">{item.rank}</span><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#e7f0e9]"><GraduationCap size={17} className="text-[#27634f]"/></div><p className="min-w-0 flex-1 truncate text-sm font-bold">{item.title}</p><span className="text-xs font-extrabold">{item.xp}</span></div>)}</div>
      </div>
    </section>
    <section id="how" className="bg-white py-20 md:py-24"><div className="container-shell"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">How it works</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Turn effort into progress.</h2><p className="mt-4 leading-7 text-[#68766e]">A simple, transparent journey that recognizes the work behind each achievement.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[{n:"01",t:"Share your achievement",d:"Students submit what they accomplished and provide supporting evidence."},{n:"02",t:"Get it verified",d:"An authorized verifier reviews the submission before points are awarded."},{n:"03",t:"Grow your profile",d:"Approved achievements contribute to XP, levels, and school rankings."}].map(s=><article key={s.n} className="rounded-2xl border border-[#e4e7df] bg-[#fffefa] p-6"><span className="text-xs font-extrabold tracking-[.2em] text-[#b58b35]">{s.n}</span><h3 className="mt-5 text-xl font-bold">{s.t}</h3><p className="mt-3 leading-7 text-[#68766e]">{s.d}</p></article>)}</div></div></section>
    <section id="features" className="container-shell py-20 md:py-24"><div className="grid gap-12 md:grid-cols-[.8fr_1.2fr] md:items-end"><div><p className="eyebrow">Built for meaningful growth</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">More than points.<br/>A record of progress.</h2></div><p className="max-w-xl leading-7 text-[#68766e]">Achievements are about more than a number. Ascend helps create a culture where learning, initiative, teamwork, and persistence all have a place.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({icon:Icon,title,text})=><article key={title} className="surface p-6"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#edf2ed] text-[#27634f]"><Icon size={22}/></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 leading-7 text-[#68766e]">{text}</p></article>)}</div></section>
    <section className="container-shell pb-20"><div className="rounded-[28px] bg-[#123d32] px-7 py-12 text-center text-white sm:px-12 sm:py-16"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#d8b66a] text-[#123d32]"><Users size={23}/></div><h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Your next achievement starts here.</h2><p className="mt-4 leading-7 text-white/70">Build your profile one meaningful step at a time.</p><Link href="/signup" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f7f5ee] px-5 py-3 font-bold text-[#123d32]">Create an account <ArrowRight size={16}/></Link></div></section>
    <SiteFooter/>
  </main>;
}
