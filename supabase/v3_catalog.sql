-- Wishpot v3 : catalogue enrichi (style, couleur, marques de niche) et import sécurisé

create extension if not exists unaccent with schema extensions;

alter table products add column if not exists style text;
alter table products add column if not exists color text;
alter table products add column if not exists niche boolean not null default false;

create sequence if not exists products_id_seq;
select setval('products_id_seq', greatest((select coalesce(max(id), 0) from products), 1));
alter table products alter column id set default nextval('products_id_seq');
create unique index if not exists products_url_key on products (url);
create index if not exists products_style_idx on products (style);
create index if not exists products_color_idx on products (color);

create or replace function wp_norm(t text) returns text language sql stable as $$
  select trim(regexp_replace(lower(extensions.unaccent(coalesce(t, ''))), '[^a-z0-9]+', ' ', 'g'))
$$;

-- Le style se devine aux matières et aux formes citées dans le nom du produit
create or replace function wp_style(t text) returns text language plpgsql stable as $$
declare s text := ' ' || wp_norm(t) || ' ';
begin
  if s ~ '\m(cuir|chesterfield|club|vintage|vieilli|patine|retro|chine|brocante|seconde main|annees|suedine|cotele)\M' then return 'vintage'; end if;
  if s ~ '\m(rotin|osier|jute|macrame|bambou|jonc|raphia|franges|berbere|kilim|jacinthe|sisal|tresse|tressee|paille|boheme)\M' then return 'boheme'; end if;
  if s ~ '\m(dore|doree|laiton|marbre|velours|arche|globe|nacre|deco|opalin|ambre|chrome)\M' then return 'art-deco'; end if;
  if s ~ '\m(fer|forge|industriel|atelier|beton|acier noir|metal noir|tubulaire)\M' then return 'industriel'; end if;
  if s ~ '\m(lin|bouclette|bouclettes|bouclee|travertin|ceramique|gres|terre cuite|organique|nuage|papier|washi|japandi)\M' then return 'naturel'; end if;
  if s ~ '\m(moulure|moulures|capitonne|classique|bistrot|provence|faience|campagne|vichy|perle|perlee|chandelier)\M' then return 'classique'; end if;
  if s ~ '\m(chene|bouleau|frene|hetre|pin|scandinave|hevea|teck)\M' then return 'scandinave'; end if;
  return 'contemporain';
end $$;

-- La couleur dominante, d'après les mots du nom
create or replace function wp_color(t text) returns text language plpgsql stable as $$
declare s text := ' ' || wp_norm(t) || ' ';
begin
  if s ~ '\m(terracotta|rouille|ocre|orange|brique|cuivre)\M' then return 'terracotta'; end if;
  if s ~ '\m(vert|verte|kaki|sauge|olive|celadon|emeraude|foret)\M' then return 'vert'; end if;
  if s ~ '\m(bleu|bleue|marine|canard|encre|indigo|turquoise)\M' then return 'bleu'; end if;
  if s ~ '\m(rose|corail|poudre|framboise)\M' then return 'rose'; end if;
  if s ~ '\m(jaune|moutarde|safran)\M' then return 'jaune'; end if;
  if s ~ '\m(rouge|bordeaux|cerise)\M' then return 'rouge'; end if;
  if s ~ '\m(cognac|camel|caramel|marron|brun|chocolat|noyer|ecureuil|noisette|miel|teck|acacia|manguier|sheesham|cuir)\M' then return 'brun'; end if;
  if s ~ '\m(dore|doree|laiton|or|champagne|ambre)\M' then return 'dore'; end if;
  if s ~ '\m(noir|noire|noirs|anthracite|charbon)\M' then return 'noir'; end if;
  if s ~ '\m(gris|grise|argent|argente|chrome)\M' then return 'gris'; end if;
  if s ~ '\m(beige|ecru|ecrue|creme|sable|lin|naturel|ivoire|jute|rotin|osier|blanc casse|bouclette|bouclettes)\M' then return 'beige'; end if;
  if s ~ '\m(blanc|blanche|blancs)\M' then return 'blanc'; end if;
  if s ~ '\m(chene|bouleau|frene|hetre|pin|bois|bambou|hevea)\M' then return 'bois'; end if;
  return null;
end $$;

update products set style = wp_style(title), color = wp_color(title);

-- Import réservé : la clé reste dans une table que personne ne peut lire
create table if not exists import_keys (key text primary key);
alter table import_keys enable row level security;

create or replace function import_products(p_key text, p_rows jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not exists (select 1 from import_keys where key = p_key) then raise exception 'forbidden'; end if;
  insert into products (shop, title, price, image_url, url, room, category, search, style, color, niche, active)
  select r->>'shop', left(r->>'title', 200), (r->>'price')::numeric, r->>'img', r->>'url', r->>'room', r->>'cat',
         wp_norm(coalesce(r->>'title', '') || ' ' || coalesce(r->>'shop', '')),
         coalesce(r->>'style', wp_style(r->>'title')), coalesce(r->>'color', wp_color(r->>'title')),
         coalesce((r->>'niche')::boolean, false), true
  from jsonb_array_elements(p_rows) r
  where (r->>'price') ~ '^[0-9]+(\.[0-9]+)?$' and (r->>'price')::numeric > 0
    and r->>'img' like 'https://%' and r->>'url' like 'https://%'
    and r->>'room' in ('salon','chambre','salle-a-manger','cuisine','salle-de-bain','bureau','entree','exterieur')
  on conflict (url) do nothing;
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function import_products(text, jsonb) from public;
grant execute on function import_products(text, jsonb) to anon, authenticated;
