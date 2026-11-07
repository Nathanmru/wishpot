import { siteUrl } from "@/lib/config";
import { PIN_BOARDS, boardItems } from "@/lib/pinBoards";

/** Flux RSS d'un tableau Pinterest : Pinterest le lit chaque jour et crée une épingle par nouvel article. */
export const revalidate = 3600;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_req: Request, { params }: { params: Promise<{ board: string }> }) {
  const { board } = await params;
  const b = PIN_BOARDS.find((x) => x.slug === board);
  if (!b) return new Response("Not found", { status: 404 });
  const base = siteUrl();
  const items = boardItems(board)
    .map(({ l, at }) => {
      const link = `${base}/idees/${l.slug}`;
      const img = `${base}/idees/${l.slug}/pin`;
      const title = l.h1.split(" : ")[0];
      return `<item>
<title>${esc(title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${new Date(at).toUTCString()}</pubDate>
<description>${esc(`<img src="${img}" alt="${esc(title)}" /><p>${l.description}</p>`)}</description>
<media:content url="${img}" medium="image" type="image/png" width="1000" height="1500" />
<enclosure url="${img}" type="image/png" length="0" />
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(`Atelier Nama — ${b.name}`)}</title>
<link>${base}</link>
<atom:link href="${base}/flux/${b.slug}" rel="self" type="application/rss+xml" />
<description>${esc(`Idées déco et pièces chinées pour : ${b.name}`)}</description>
<language>fr-FR</language>
${items}
</channel>
</rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=3600" } });
}
