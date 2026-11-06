import { NextResponse, type NextRequest } from "next/server";
import { publicClient } from "@/lib/supabase/public";

/**
 * Vérifie chaque jour si les pièces du catalogue sont toujours en vente, et retire celles qui ont été vendues.
 * Appelée par le cron Vercel (en-tête Authorization: Bearer CRON_SECRET).
 *   ?dry=1  : test sans rien modifier (20 pièces max, sans authentification)
 *   ?shop=X : ne vérifier qu'une boutique
 * On ne retire une pièce que sur une preuve claire (page disparue, « épuisé », « vendu ») : en cas de doute, on ne touche à rien.
 */
export const maxDuration = 300;
export const dynamic = "force-dynamic";

type Status = "ok" | "gone" | "unknown";
type Row = { id: number; url: string; shop: string };

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

async function get(url: string, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { headers: { "user-agent": UA, "accept-language": "fr-FR,fr;q=0.9" }, redirect: "follow", signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(t);
  }
}

async function check(r: Row): Promise<{ status: Status; why: string }> {
  let u: URL;
  try {
    u = new URL(r.url);
  } catch {
    return { status: "unknown", why: "url" };
  }
  const slug = u.pathname.split("/").filter(Boolean).pop() ?? "";

  // 1. Boutiques Shopify : /products/<handle>.js donne la disponibilité exacte
  if (u.pathname.includes("/products/")) {
    try {
      const res = await get(`${u.origin}${u.pathname.replace(/\/$/, "")}.js`);
      if (res.status === 404) return { status: "gone", why: "shopify 404" };
      if (res.ok && (res.headers.get("content-type") || "").includes("json")) {
        const j = (await res.json()) as { available?: boolean };
        if (typeof j.available === "boolean") return { status: j.available ? "ok" : "gone", why: "shopify" };
      }
    } catch {}
  }

  // 2. La page produit elle-même
  let res: Response;
  try {
    res = await get(r.url);
  } catch {
    return { status: "unknown", why: "timeout" };
  }
  if (res.status === 404 || res.status === 410) return { status: "gone", why: `http ${res.status}` };
  if (!res.ok) return { status: "unknown", why: `http ${res.status}` };

  // Redirigée vers une autre page (catégorie, accueil) : la pièce n'existe plus
  try {
    const final = new URL(res.url);
    if (slug.length > 6 && final.host === u.host && !final.pathname.includes(slug) && final.pathname !== u.pathname) return { status: "gone", why: "redirect" };
  } catch {}

  const html = (await res.text()).slice(0, 600_000);
  const av = [...html.matchAll(/"availability"\s*:\s*"(?:https?:\/\/schema\.org\/)?([A-Za-z]+)"/g)].map((m) => m[1]);
  if (av.length) {
    if (av.some((a) => /^(InStock|LimitedAvailability|PreOrder|BackOrder|OnlineOnly|InStoreOnly)$/.test(a))) return { status: "ok", why: "jsonld" };
    if (av.every((a) => /^(OutOfStock|SoldOut|Discontinued)$/.test(a))) return { status: "gone", why: "jsonld" };
  }
  if (/(cet article a été vendu|cette pièce a été vendue|article vendu|produit indisponible|n'est plus disponible|plus en stock)/i.test(html)) return { status: "gone", why: "texte" };
  return { status: "unknown", why: "?" };
}

async function pool<T, R>(items: T[], n: number, fn: (x: T) => Promise<R>) {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    }),
  );
  return out;
}

export async function GET(req: NextRequest) {
  const dry = req.nextUrl.searchParams.get("dry") === "1";
  const shop = req.nextUrl.searchParams.get("shop");
  const secret = process.env.CRON_SECRET;
  if (!dry && (!secret || req.headers.get("authorization") !== `Bearer ${secret}`)) return NextResponse.json({ error: "forbidden" }, { status: 401 });

  const sb = publicClient();
  const pick = async (filter: (q: any) => any, limit: number, active = true) => {
    let q = sb.from("products").select("id, url, shop").eq("active", active);
    q = filter(q);
    const { data } = await q.order("checked_at", { ascending: true, nullsFirst: true }).limit(limit);
    return (data ?? []) as Row[];
  };

  let rows: Row[];
  if (shop) rows = await pick((q) => q.eq("shop", shop), dry ? 20 : 400);
  else if (dry) rows = [...(await pick((q) => q.eq("shop", "Selency"), 10)), ...(await pick((q) => q.neq("shop", "Selency"), 10))];
  else
    rows = [
      ...(await pick((q) => q.eq("shop", "Selency"), 250)),
      ...(await pick((q) => q.neq("shop", "Selency"), 150)),
      // pièces épuisées chez les marques : revenues en stock ?
      ...(await pick((q) => q.neq("shop", "Selency").not("gone_at", "is", null), 50, false)),
    ];

  const started = Date.now();
  const results = await pool(rows, 10, async (r) => ({ ...r, ...(await check(r)) }));

  let updated = 0;
  if (!dry && results.length) {
    const { data, error } = await sb.rpc("stock_update", { p_key: secret, p_rows: results.map((r) => ({ id: r.id, status: r.status })) });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    updated = Number(data) || 0;
  }

  const count = (s: Status) => results.filter((r) => r.status === s).length;
  return NextResponse.json({
    dry,
    checked: results.length,
    ok: count("ok"),
    gone: count("gone"),
    unknown: count("unknown"),
    updated,
    seconds: Math.round((Date.now() - started) / 1000),
    sample: dry ? results : results.filter((r) => r.status === "gone").slice(0, 30),
  });
}
