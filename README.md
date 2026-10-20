# Ascend — School Achievement Platform

A responsive school achievement platform starter built with Next.js, TypeScript, Tailwind CSS v4, and Supabase. It includes a landing page, Supabase email authentication, a student dashboard, achievement submissions, and a database-backed leaderboard.

## 1. Create Supabase project
1. Create a project at https://supabase.com.
2. In Project Settings → API, copy the Project URL and publishable key (or legacy anon key).
3. Open SQL Editor and run the complete SQL in `supabase/migrations/001_initial_schema.sql`.
4. In Authentication → URL Configuration, add:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback`
5. Set the Site URL to your deployed Vercel domain after deployment.

## 2. Deploy through GitHub and Vercel
1. Extract this ZIP on your computer.
2. Create a new empty GitHub repository.
3. Upload the contents of this folder, keeping the structure intact. `package.json` must be at the repository root.
4. Import the repository at https://vercel.com.
5. In Vercel → Project Settings → Environment Variables, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Deploy, then add your Vercel domain to Supabase Auth URL Configuration and redeploy if necessary.

## 3. Local testing (optional)
Install Node.js LTS from https://nodejs.org. Copy `.env.example` to `.env.local`, enter your Supabase values, then run `npm install`, `npm run dev`, and open http://localhost:3000. Run `npm run build` to check the production build.

## Notes
- Never upload `.env.local`, passwords, service-role keys, or real student information to GitHub.
- New users are assigned the student role. Do not create a public admin registration form.
- Before using with real school data, test access policies with separate student and staff accounts and ask a school administrator to review privacy and permissions.
