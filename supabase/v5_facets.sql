-- Wishpot v5 : les compteurs du catalogue en un appel (au-delà des 1 000 lignes d'une requête)
create or replace function catalog_facets(p_room text default null) returns jsonb
language sql stable as $$
  with p as (select room, category, style, color, shop, niche from products where active),
       r as (select * from p where p_room is null or room = p_room)
  select jsonb_build_object(
    'total', (select count(*) from p),
    'rooms', coalesce((select jsonb_object_agg(room, n) from (select room, count(*) n from p group by room) x), '{}'),
    'cats', coalesce((select jsonb_object_agg(category, n) from (select category, count(*) n from r group by category) x), '{}'),
    'styles', coalesce((select jsonb_object_agg(style, n) from (select style, count(*) n from r where style is not null group by style) x), '{}'),
    'colors', coalesce((select jsonb_object_agg(color, n) from (select color, count(*) n from r where color is not null group by color) x), '{}'),
    'shops', coalesce((select jsonb_object_agg(shop, n) from (select shop, count(*) n from r group by shop) x), '{}'),
    'niche', (select count(*) from r where niche)
  )
$$;
grant execute on function catalog_facets(text) to anon, authenticated;
