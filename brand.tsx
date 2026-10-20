import { Sprout } from "lucide-react";
import Link from "next/link";
export function Brand({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`inline-flex items-center gap-2.5 font-bold tracking-tight ${light ? "text-white" : "text-[#123d32]"}`}>
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#d8b66a] text-[#123d32]"><Sprout size={22} /></span>
    <span className="text-xl">ascend<span className="text-[#b58b35]">.</span></span>
  </Link>;
}
export function SiteFooter() {
  return <footer className="mt-16 border-t border-[#e4e7df] py-8"><div className="container-shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><Brand /><p className="text-sm text-[#68766e]">Every effort matters. Every achievement counts.</p><Link className="text-sm font-semibold text-[#123d32]" href="/login">Student sign in →</Link></div></footer>;
}
