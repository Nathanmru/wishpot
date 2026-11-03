import { NextResponse } from "next/server";
import { fetchProduct, isSafeUrl, type Attempt } from "@/lib/extract";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 45;

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

// Diagnostic temporaire (sera retiré)
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  if (sp.get("k") !== "wp-diag-7f3a91") return NextResponse.json({ error: "not found" }, { status: 404 });
  const url = sp.get("url") || "";
  const log: Attempt[] = [];
  const t0 = Date.now();
  try {
    const result = await fetchProduct(url, log);
    return NextResponse.json({ ms: Date.now() - t0, result, log });
  } catch (e) {
    return NextResponse.json({ ms: Date.now() - t0, error: String(e), log });
  }
}
