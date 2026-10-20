"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Brand } from "@/components/brand";
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email,setEmail] = useState(""); const [password,setPassword] = useState(""); const [fullName,setFullName] = useState("");
  const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false); const router = useRouter(); const signup = mode === "signup";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage("");
    const supabase = createClient();
    if (!supabase) { setMessage("Supabase is not configured. Follow README.md first."); return; }
    setBusy(true);
    const result = signup
      ? await supabase.auth.signUp({ email,password,options:{ data:{full_name:fullName},emailRedirectTo:`${window.location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({email,password});
    if (result.error) setMessage(result.error.message);
    else if (signup && !result.data.session) setMessage("Account created. Check your email to confirm your address, then sign in.");
    else router.push("/dashboard");
    setBusy(false); router.refresh();
  }
  return <main className="grid min-h-screen lg:grid-cols-2"><section className="hidden flex-col justify-between bg-[#123d32] p-12 text-white lg:flex"><Brand light/><div className="max-w-lg pb-10"><p className="eyebrow !text-[#e2c47e]">A place to grow</p><h1 className="mt-5 text-5xl font-semibold leading-tight">Your effort deserves to be seen.</h1><p className="mt-5 text-lg leading-8 text-white/70">Celebrate the work behind every milestone, from academic breakthroughs to the things you build together.</p></div><p className="text-sm text-white/50">ASCEND · SCHOOL ACHIEVEMENT PLATFORM</p></section><section className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-md"><div className="mb-10 lg:hidden"><Brand/></div><p className="eyebrow">Welcome to Ascend</p><h2 className="mt-3 text-3xl font-semibold">{signup ? "Create your account" : "Welcome back"}</h2><p className="mt-2 text-sm text-[#68766e]">{signup ? "Start building your achievement story." : "Sign in to continue your journey."}</p><form onSubmit={submit} className="mt-8 space-y-4">{signup && <label className="block text-sm font-semibold">Full name<input className="field mt-2" value={fullName} onChange={e=>setFullName(e.target.value)} required minLength={2}/></label>}<label className="block text-sm font-semibold">Email address<input className="field mt-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label className="block text-sm font-semibold">Password<input className="field mt-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}/></label>{message && <p role="status" className="rounded-xl bg-[#f5edda] p-3 text-sm text-[#654d1c]">{message}</p>}<button className="btn-primary w-full !py-3.5 disabled:opacity-60" disabled={busy}>{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}</button></form><p className="mt-6 text-center text-sm text-[#68766e]">{signup ? "Already have an account?" : "New to Ascend?"} <Link className="font-bold text-[#123d32] underline" href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link></p></div></section></main>;
}
