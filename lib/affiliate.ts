/**
 * Transforme un lien marchand en lien affilié, selon les programmes
 * auxquels tu es inscrit (voir .env). Si rien ne correspond, le lien est rendu tel quel.
 *
 *  - Amazon Partenaires  → ajoute ?tag=AMAZON_TAG
 *  - Booking.com         → ajoute ?aid=BOOKING_AID
 *  - GetYourGuide        → ajoute ?partner_id=GETYOURGUIDE_PARTNER_ID
 *  - Awin (Maisons du Monde, La Redoute, Made in Design, etc.)
 *      → lien Awin "cread.php", pour chaque marchand déclaré dans AWIN_MERCHANTS
 *        format : "maisonsdumonde.com:12345,laredoute.fr:6789"
 *        (l'identifiant marchand est visible dans ton espace Awin après acceptation)
 */

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function matches(host: string, domain: string) {
  return host === domain || host.endsWith("." + domain);
}

function awinMerchants(): Record<string, string> {
  const raw = process.env.AWIN_MERCHANTS || "";
  const out: Record<string, string> = {};
  for (const pair of raw.split(",")) {
    const [domain, mid] = pair.split(":").map((s) => s?.trim());
    if (domain && mid) out[domain.replace(/^www\./, "")] = mid;
  }
  return out;
}

export function affiliateUrl(original: string): { url: string; affiliated: boolean } {
  let u: URL;
  try {
    u = new URL(original);
  } catch {
    return { url: original, affiliated: false };
  }
  const host = u.hostname.toLowerCase().replace(/^www\./, "");

  const amazonTag = process.env.AMAZON_TAG;
  if (amazonTag && /^amazon\.(fr|com|de|es|it|co\.uk|nl|be|ca)$/.test(host)) {
    u.searchParams.set("tag", amazonTag);
    return { url: u.toString(), affiliated: true };
  }

  const bookingAid = process.env.BOOKING_AID;
  if (bookingAid && matches(host, "booking.com")) {
    u.searchParams.set("aid", bookingAid);
    return { url: u.toString(), affiliated: true };
  }

  const gygId = process.env.GETYOURGUIDE_PARTNER_ID;
  if (gygId && /^getyourguide\.[a-z.]+$/.test(host)) {
    u.searchParams.set("partner_id", gygId);
    return { url: u.toString(), affiliated: true };
  }

  const awinId = process.env.AWIN_PUBLISHER_ID;
  if (awinId) {
    const merchants = awinMerchants();
    const domain = Object.keys(merchants).find((d) => matches(host, d));
    if (domain) {
      const link =
        `https://www.awin1.com/cread.php?awinmid=${encodeURIComponent(merchants[domain])}` +
        `&awinaffid=${encodeURIComponent(awinId)}&ued=${encodeURIComponent(u.toString())}`;
      return { url: link, affiliated: true };
    }
  }

  return { url: u.toString(), affiliated: false };
}
