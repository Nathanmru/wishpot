import { NextResponse, type NextRequest } from "next/server";
import { affiliateUrl, hostOf } from "@/lib/affiliate";
import { allowedShopHosts } from "@/lib/suggestions";
import { inspirationHosts } from "@/lib/inspiration";
import { createClient } from "@/lib/supabase/server";
import { publicClient } from "@/lib/supabase/public";

/**
 * Redirection sortante avec affiliation et comptage des clics.
 *   /go?p=<id>      → une pièce du catalogue
 *   /go?item=<id>   → lien d'un objet de la liste (l'utilisateur doit être membre)
 *   /go?u=<url>     → lien d'une boutique suggérée (liste blanche uniquement)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const productId = req.nextUrl.searchParams.get("p");
  const itemId = req.nextUrl.searchParams.get("item");
  const raw = req.nextUrl.searchParams.get("u");

  let target: string | null = null;
  let shop: string | null = null;

  if (productId && /^\d+$/.test(productId)) {
    const { data } = await publicClient().from("products").select("url, shop").eq("id", Number(productId)).maybeSingle();
    target = data?.url ?? null;
    shop = data?.shop ?? null;
  } else if (itemId) {
    const { data } = await supabase.from("items").select("id, url").eq("id", itemId).maybeSingle();
    target = data?.url ?? null;
  } else if (raw) {
    const host = hostOf(raw);
    if ([...allowedShopHosts(), ...inspirationHosts()].some((h) => host === h || host.endsWith("." + h))) target = raw;
  }

  if (!target) return NextResponse.redirect(new URL("/", req.url));

  const { url, affiliated } = await affiliateUrl(target);

  // Page d'où vient le clic (chemin seulement)
  let source: string | null = null;
  try {
    const ref = req.headers.get("referer");
    if (ref && new URL(ref).host === req.nextUrl.host) source = new URL(ref).pathname.slice(0, 200);
  } catch {}

  // Les robots (moteurs, aperçus de liens, outils) ne comptent pas comme des clics
  const ua = req.headers.get("user-agent") || "";
  const bot = !ua || /bot|crawl|spider|slurp|preview|fetch|curl|wget|python|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|monitor/i.test(ua);

  if (!bot) await supabase
    .from("clicks")
    .insert({
      item_id: itemId,
      product_id: productId ? Number(productId) : null,
      shop,
      source,
      user_id: auth.user?.id ?? null,
      host: hostOf(target),
      affiliated,
    })
    .then(
      () => null,
      () => null,
    );

  const res = NextResponse.redirect(url, { status: 302 });
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
