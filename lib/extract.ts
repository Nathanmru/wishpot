/**
 * Lit une page produit / hôtel / vol et en extrait nom, image et prix.
 * Ordre de confiance : JSON-LD (schema.org Product/Offer) > balises meta > microdata.
 */

export type Extracted = {
  url: string;
  title: string | null;
  image: string | null;
  price: number | null;
  currency: string | null;
  site: string;
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export function isSafeUrl(raw: string): URL | null {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const h = u.hostname.toLowerCase();
  if (
    h === "localhost" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    /^127\./.test(h) ||
    /^10\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    /^169\.254\./.test(h) ||
    /^0\./.test(h) ||
    h.startsWith("[") ||
    !h.includes(".")
  )
    return null;
  return u;
}

/** "1 299,99 €", "1,299.99", "1.299", "89,90", 1299 → nombre */
export function parsePrice(input: unknown): number | null {
  if (typeof input === "number") return isFinite(input) && input >= 0 ? Math.round(input * 100) / 100 : null;
  if (typeof input !== "string") return null;
  // valeur "machine" (schema.org / meta) : le point est toujours décimal
  if (/^\s*\d+\.\d+\s*$/.test(input)) return Math.round(parseFloat(input) * 100) / 100;
  let s = input.replace(/[^\d.,]/g, "");
  if (!/\d/.test(s)) return null;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > -1 && lastDot > -1) {
    // les deux présents : le dernier est le séparateur décimal
    const dec = lastComma > lastDot ? "," : ".";
    const thou = dec === "," ? "." : ",";
    s = s.split(thou).join("").replace(dec, ".");
  } else if (lastComma > -1 || lastDot > -1) {
    const sep = lastComma > -1 ? "," : ".";
    const parts = s.split(sep);
    const isThousands = parts.length > 2 || (parts.length === 2 && parts[1].length === 3);
    s = isThousands ? parts.join("") : parts.join(".");
  }
  const n = parseFloat(s);
  return isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
}

const ENTITIES: Record<string, string> = {
  eacute: "é", egrave: "è", ecirc: "ê", euml: "ë", agrave: "à", acirc: "â", ccedil: "ç",
  icirc: "î", iuml: "ï", ocirc: "ô", ucirc: "û", ugrave: "ù", Eacute: "É", oelig: "œ",
  euro: "€", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", hellip: "…", ndash: "–", mdash: "—",
  laquo: "«", raquo: "»", deg: "°", times: "×", reg: "®", trade: "™", copy: "©",
};

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name: string) => ENTITIES[name] ?? m)
    .trim();
}

function meta(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const k = key.replace(/[:.]/g, (c) => "\\" + c);
    const re1 = new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${k}["'][^>]*content=["']([^"']*)["']`, "i");
    const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${k}["']`, "i");
    const m = html.match(re1) || html.match(re2);
    if (m && m[1].trim()) return decode(m[1]);
  }
  return null;
}

type LD = Record<string, unknown>;

function flattenLd(node: unknown, out: LD[] = []): LD[] {
  if (Array.isArray(node)) node.forEach((n) => flattenLd(n, out));
  else if (node && typeof node === "object") {
    const o = node as LD;
    out.push(o);
    if (o["@graph"]) flattenLd(o["@graph"], out);
    if (o.mainEntity) flattenLd(o.mainEntity, out);
    if (o.itemListElement) flattenLd(o.itemListElement, out);
  }
  return out;
}

function hasType(o: LD, ...types: string[]) {
  const t = o["@type"];
  const list = Array.isArray(t) ? t : [t];
  return list.some((x) => typeof x === "string" && types.includes(x));
}

function firstImage(img: unknown): string | null {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return firstImage(img[0]);
  if (typeof img === "object") return firstImage((img as LD).url || (img as LD).contentUrl);
  return null;
}

function offerPrice(offers: unknown): { price: number | null; currency: string | null } {
  const list = flattenLd(offers);
  for (const o of list) {
    const p =
      parsePrice(o.price) ??
      parsePrice(o.lowPrice) ??
      parsePrice((o.priceSpecification as LD | undefined)?.price);
    if (p !== null && p > 0) {
      const cur = (o.priceCurrency || (o.priceSpecification as LD | undefined)?.priceCurrency) as string | undefined;
      return { price: p, currency: cur ? String(cur).toUpperCase() : null };
    }
  }
  return { price: null, currency: null };
}

export function parseHtml(html: string, pageUrl: string): Extracted {
  const site = new URL(pageUrl).hostname.replace(/^www\./, "");
  let title: string | null = null;
  let image: string | null = null;
  let price: number | null = null;
  let currency: string | null = null;

  // 1) JSON-LD
  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const m of scripts) {
    let data: unknown;
    try {
      data = JSON.parse(m[1].trim());
    } catch {
      continue;
    }
    for (const node of flattenLd(data)) {
      if (hasType(node, "Product", "Hotel", "LodgingBusiness", "Trip", "TouristTrip", "Event", "Offer", "AggregateOffer")) {
        title = title || (typeof node.name === "string" ? decode(node.name) : null);
        image = image || firstImage(node.image);
        if (price === null) {
          const r = hasType(node, "Offer", "AggregateOffer") ? offerPrice(node) : offerPrice(node.offers);
          if (r.price !== null) ({ price, currency } = r);
        }
      }
    }
    if (title && price !== null) break;
  }

  // 2) Meta (Open Graph, Facebook catalogue, Twitter)
  title = title || meta(html, ["og:title", "twitter:title"]);
  image = image || meta(html, ["og:image", "og:image:secure_url", "twitter:image"]);
  if (price === null) {
    price = parsePrice(meta(html, ["product:price:amount", "og:price:amount", "twitter:data1", "price"]));
    currency = currency || meta(html, ["product:price:currency", "og:price:currency", "priceCurrency"]);
  }

  // 3) Microdata itemprop="price" content="…"
  if (price === null) {
    const m = html.match(/itemprop=["']price["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["'][^>]*itemprop=["']price["']/i);
    if (m) price = parsePrice(m[1]);
  }

  // 4) <title> en dernier recours
  if (!title) {
    const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (t) title = decode(t[1]).split(/\s[|–-]\s/)[0];
  }

  if (image) {
    try {
      image = new URL(image, pageUrl).toString();
    } catch {
      image = null;
    }
  }
  if (title && title.length > 200) title = title.slice(0, 197) + "…";

  return { url: pageUrl, title, image, price, currency: currency ? currency.toUpperCase() : null, site };
}

export async function fetchProduct(raw: string): Promise<Extracted> {
  const u = isSafeUrl(raw);
  if (!u) throw new Error("invalid url");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(u.toString(), {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent": UA,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
    });
    const finalUrl = isSafeUrl(res.url) ? res.url : u.toString();
    const type = res.headers.get("content-type") || "";
    if (!type.includes("html")) return { ...emptyFor(finalUrl) };

    // Lire au plus ~2 Mo
    const reader = res.body?.getReader();
    let html = "";
    if (reader) {
      const dec = new TextDecoder();
      let total = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        html += dec.decode(value, { stream: true });
        if (total > 2_000_000) {
          await reader.cancel();
          break;
        }
      }
    }
    return parseHtml(html, finalUrl);
  } finally {
    clearTimeout(timer);
  }
}

function emptyFor(url: string): Extracted {
  return { url, title: null, image: null, price: null, currency: null, site: new URL(url).hostname.replace(/^www\./, "") };
}
