import { NextResponse, type NextRequest } from "next/server";
import { affiliateUrl, hostOf } from "@/lib/affiliate";
import { allowedShopHosts } from "@/lib/suggestions";
import { inspirationHosts } from "@/lib/inspiration";
import { createClient } from "@/lib/supabase/server";

/**
 * Redirection sortante avec affiliation.
 *   /go?item=<id>   → lien d'un objet de la liste (l'utilisateur doit être membre)
 *   /go?u=<url>     → lien d'une boutique suggérée (liste blanche uniquement)
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const itemId = req.nextUrl.searchParams.get("item");
  const raw = req.nextUrl.searchParams.get("u");

  let target: string | null = null;

  if (itemId) {
    const { data } = await supabase.from("items").select("id, url").eq("id", itemId).maybeSingle();
    target = data?.url ?? null;
  } else if (raw) {
    const host = hostOf(raw);
    if ([...allowedShopHosts(), ...inspirationHosts()].some((h) => host === h || host.endsWith("." + h))) target = raw;
  }

  if (!target) return NextResponse.redirect(new URL("/", req.url));

  const { url, affiliated } = affiliateUrl(target);
  await supabase
    .from("clicks")
    .insert({ item_id: itemId, user_id: auth.user?.id ?? null, host: hostOf(target), affiliated })
    .then(() => null, () => null);

  return NextResponse.redirect(url, { status: 302 });
}
