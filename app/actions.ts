"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSafeUrl } from "@/lib/extract";
import { guessRoom, ROOMS } from "@/lib/rooms";
import { STARTERS, parseExtra } from "@/lib/starters";
import { illustrationFor } from "@/lib/itemImage";
import type { Kind } from "@/lib/config";

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

  // Envies choisies sur l'accueil ou à la création
  const ids = formData.getAll("starter").map(String);
  const starters = STARTERS.filter((x) => x.kind === kind && ids.includes(x.id));
  const extras = formData
    .getAll("extra")
    .map((v) => parseExtra(String(v)))
    .filter((x): x is NonNullable<typeof x> => !!x)
    .slice(0, 12);
  if (starters.length || extras.length) {
    const { data: auth } = await supabase.auth.getUser();
    const by = auth.user?.id ?? null;
    await supabase.from("items").insert([
      ...starters.map((x) => ({
        project_id: data,
        added_by: by,
        title: x.title,
        price: x.price,
        quantity: x.quantity ?? 1,
        url: x.url ?? null,
        image_url: x.img,
        room: guessRoom(x.title, kind),
      })),
      ...extras.map((x) => ({
        project_id: data,
        added_by: by,
        title: x.title,
        price: x.price,
        quantity: 1,
        url: null,
        image_url: illustrationFor(x.title, kind),
        room: guessRoom(x.title, kind),
      })),
    ]);
  }
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
  room?: string | null;
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
    room: await roomFor(supabase, projectId, item.title, item.room),
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

/* ---------- Pièces ---------- */
type Sb = Awaited<ReturnType<typeof createClient>>;

async function roomFor(supabase: Sb, projectId: string, title: string, chosen?: string | null) {
  const { data } = await supabase.from("projects").select("kind").eq("id", projectId).maybeSingle();
  const kind: Kind = data?.kind === "travel" ? "travel" : "home";
  if (chosen && ROOMS[kind].some((r) => r.id === chosen)) return chosen;
  return guessRoom(title || "", kind);
}

export async function setItemRoom(projectId: string, itemId: string, room: string | null) {
  const { supabase } = await requireUser();
  await supabase.from("items").update({ room: room ? room.slice(0, 40) : null }).eq("id", itemId).eq("project_id", projectId);
  revalidatePath(`/p/${projectId}`);
}

/* ---------- Cœurs et commentaires ---------- */
export async function toggleLike(projectId: string, itemId: string, like: boolean) {
  const { supabase, user } = await requireUser();
  if (like) await supabase.from("item_likes").upsert({ item_id: itemId, user_id: user.id });
  else await supabase.from("item_likes").delete().eq("item_id", itemId).eq("user_id", user.id);
  revalidatePath(`/p/${projectId}`);
}

export async function addComment(projectId: string, itemId: string, body: string) {
  const { supabase, user } = await requireUser();
  const text = body.trim().slice(0, 500);
  if (!text) return;
  await supabase.from("item_comments").insert({ item_id: itemId, user_id: user.id, body: text });
  revalidatePath(`/p/${projectId}`);
}

export async function deleteComment(projectId: string, commentId: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("item_comments").delete().eq("id", commentId).eq("user_id", user.id);
  revalidatePath(`/p/${projectId}`);
}

/* ---------- Liste à partager avec les proches ---------- */
export async function setShare(projectId: string, enabled: boolean) {
  const { supabase } = await requireUser();
  await supabase.rpc("set_share", { pid: projectId, enabled });
  revalidatePath(`/p/${projectId}`);
}

export async function clearReservation(projectId: string, itemId: string) {
  const { supabase } = await requireUser();
  await supabase.from("items").update({ reserved_by: null, reserved_at: null }).eq("id", itemId).eq("project_id", projectId);
  revalidatePath(`/p/${projectId}`);
}

/* ---------- Catalogue ---------- */
export async function addProduct(projectId: string, productId: number) {
  const { supabase, user } = await requireUser();
  const { data: p } = await supabase
    .from("products")
    .select("id, title, price, url, image_url, room")
    .eq("id", productId)
    .maybeSingle();
  if (!p) throw new Error("product not found");
  const { error } = await supabase.from("items").insert({
    project_id: projectId,
    added_by: user.id,
    title: p.title,
    price: p.price,
    quantity: 1,
    url: p.url,
    image_url: p.image_url,
    room: p.room,
    product_id: p.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/p/${projectId}`);
  return { ok: true };
}
