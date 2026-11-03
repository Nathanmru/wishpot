import { NextResponse } from "next/server";
import { fetchProduct, isSafeUrl } from "@/lib/extract";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Réservé aux utilisateurs connectés (évite que l'outil serve de proxy public)
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const url = typeof body.url === "string" ? body.url : "";
  if (!isSafeUrl(url)) return NextResponse.json({ error: "invalid url" }, { status: 400 });

  try {
    const result = await fetchProduct(url);
    return NextResponse.json(result);
  } catch {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return NextResponse.json(
      { url, title: null, image: null, price: null, currency: null, site: host, failed: true },
      { status: 200 }
    );
  }
}
