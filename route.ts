import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${origin}/dashboard`);
    }
  }
  return NextResponse.redirect(`${origin}/login?message=Could%20not%20confirm%20sign-in`);
}
