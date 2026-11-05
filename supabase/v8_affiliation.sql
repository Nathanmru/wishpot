-- v8 : clics du catalogue + programmes d'affiliation activables sans redéploiement

alter table public.clicks add column if not exists product_id bigint;
alter table public.clicks add column if not exists shop text;
alter table public.clicks add column if not exists source text;
create index if not exists clicks_created_idx on public.clicks(created_at desc);

create table if not exists public.affiliate_programs (
  domain text primary key,          -- ex. selency.fr
  shop text,                        -- nom affiché (Selency)
  network text,                     -- Awin, Affilae, Rakuten…
  template text,                    -- lien avec {url} ou {raw}
  active boolean not null default false,
  note text,
  updated_at timestamptz not null default now()
);
alter table public.affiliate_programs enable row level security;
drop policy if exists "affiliate programs read" on public.affiliate_programs;
create policy "affiliate programs read" on public.affiliate_programs for select to anon, authenticated using (active);

-- Une ligne par boutique du catalogue (inactive tant que la boutique ne t'a pas accepté)
insert into public.affiliate_programs (domain, shop)
select distinct on (d) d, shop
from (
  select regexp_replace(lower(substring(url from '^https?://([^/]+)')), '^www\.', '') as d, shop
  from public.products where active
) s
where d is not null
order by d, shop
on conflict (domain) do nothing;

-- Tableau de bord des clics (lecture depuis le dashboard Supabase)
create or replace view public.click_stats as
select date_trunc('day', created_at)::date as jour,
       coalesce(shop, host) as boutique,
       count(*) as clics,
       count(*) filter (where affiliated) as clics_affilies
from public.clicks
group by 1, 2
order by 1 desc, 3 desc;
revoke all on public.click_stats from anon, authenticated;

select domain, shop from public.affiliate_programs order by shop;
