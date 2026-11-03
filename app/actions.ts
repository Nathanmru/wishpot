"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSafeUrl } from "@/lib/extract";

function num(v: FormDataEntryValue | null, fallback = 0) {
  const n = parseFloat(String(v ?? "").replace(",", "."));
  return isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : fallback;
}

async function requireUser() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/* ---------- Langue ---------- */
export async function setLang(lang: "fr" | "en") {
  const store = await cookies();
  store.set("lang", lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  revalidatePath("/", "layout");
}

/* ---------- Cagnottes ---------- */
export async function createProject(formData: FormData) {
  const { supabase } = await requireUser();
  const kind = formData.get("kind") === "travel" ? "travel" : "home";
  const name = String(formData.get("name") || "").trim().slice(0, 80) || (kind === "travel" ? "Voyage" : "Maison");
  const monthly = num(formData.get("monthly"));
  const { data, error } = await supabase.rpc("create_project", { p_name: name, p_kind: kind, p_monthly: monthly });
  if (error || !data) throw new Error(error?.message || "create failed");
  redirect(`/p/${data}`);
}

export async function deleteProject(projectId: string) {
  const { supabase } = await requireUser();
  await supabase.from("projects").delete().eq("id", projectId);
  redirect("/dashboard");
}

export async function leaveProject(projectId: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("project_members").delete().eq("project_id", projectId).eq("user_id", user.id);
  redirect("/dashboard");
}

export async function joinProject(token: string) {
  const { supabase } = await requireUser();
  const { data, error } = await supabase.rpc("join_project", { p_token: token });
  if (error || !data) redirect(`/invite/${token}?error=1`);
  redirect(`/p/${data}`);
}

export async function regenerateInvite(projectId: string) {
  const { supabase } = await requireUser();
  await supabase.rpc("regenerate_invite", { pid: projectId });
  revalidatePath(`/p/${projectId}`);
}

/* ---------- Budget ---------- */
export async function setMonthly(projectId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("project_members")
    .update({ monthly_amount: num(formData.get("monthly")) })
    .eq("project_id", projectId)
    .eq("user_id", user.id);
  revalidatePath(`/p/${projectId}`);
}

export async function addDeposit(projectId: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  const amount = num(formData.get("amount"));
  if (amount <= 0) return;
  await supabase.from("deposits").insert({
    project_id: projectId,
    user_id: user.id,
    amount,
    note: String(formData.get("note") || "").slice(0, 120) || null,
  });
  revalidatePath(`/p/${projectId}`);
}

export async function deleteDeposit(projectId: string, depositId: string) {
  const { supabase } = await requireUser();
  await supabase.from("deposits").delete().eq("id", depositId);
  revalidatePath(`/p/${projectId}`);
}

/* ---------- Objets ---------- */
export type NewItem = {
  title: string;
  price: number;
  quantity?: number;
  url?: string | null;
  image_url?: string | null;
  category?: string | null;
};

export async function addItem(projectId: string, item: NewItem) {
  const { supabase, user } = await requireUser();
  const url = item.url && isSafeUrl(item.url) ? item.url : null;
  const image = item.image_url && /^https?:\/\//.test(item.image_url) ? item.image_url : null;
  const { error } = await supabase.from("items").insert({
    project_id: projectId,
    added_by: user.id,
    title: (item.title || "").trim().slice(0, 200) || "—",
    price: Math.max(0, Math.round(Number(item.price || 0) * 100) / 100),
    quantity: Math.min(Math.max(1, Math.floor(Number(item.quantity || 1))), 999),
    url,
    image_url: image,
    category: item.category?.slice(0, 40) || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/p/${projectId}`);
}

export async function updateItem(
  projectId: string,
  itemId: string,
  patch: Partial<{ title: string; price: number; quantity: number; purchased: boolean }>
) {
  const { supabase } = await requireUser();
  const clean: Record<string, unknown> = {};
  if (patch.title !== undefined) clean.title = patch.title.trim().slice(0, 200) || "—";
  if (patch.price !== undefined) clean.price = Math.max(0, Math.round(Number(patch.price) * 100) / 100);
  if (patch.quantity !== undefined) clean.quantity = Math.min(Math.max(1, Math.floor(patch.quantity)), 999);
  if (patch.purchased !== undefined) clean.purchased = !!patch.purchased;
  await supabase.from("items").update(clean).eq("id", itemId).eq("project_id", projectId);
  revalidatePath(`/p/${projectId}`);
}

export async function deleteItem(projectId: string, itemId: string) {
  const supabase = await createClient();
  await supabase.from("items").delete().eq("id", itemId).eq("project_id", projectId);
  revalidatePath(`/p/${projectId}`);
}
