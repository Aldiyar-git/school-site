"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function submitAchievement(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const date = String(formData.get("achievement_date") || "");
  const categories = ["academic_olympiad","competition","project","chess","sports","volunteering","school_event","certificate","other"];
  if (title.length < 4 || title.length > 120 || description.length < 10 || description.length > 1500 || !categories.includes(category)) redirect("/dashboard?error=Please%20check%20the%20form");
  const supabase = await createClient();
  if (!supabase) redirect("/dashboard?error=Supabase%20is%20not%20configured");
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const {error} = await supabase.from("achievements").insert({student_id:user.id,title,description,category,achievement_date:date || new Date().toISOString().slice(0,10),status:"pending"});
  if (error) redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/dashboard");
  redirect("/dashboard?success=Achievement%20submitted%20for%20review");
}
