-- v9 : vérification automatique des pièces vendues / épuisées (et remise en ligne si elles reviennent)

alter table public.products add column if not exists checked_at timestamptz;
alter table public.products add column if not exists gone_at timestamptz;
create index if not exists products_checked_idx on public.products (checked_at nulls first) where active;

-- Résultats : [{id, status: ok|gone|unknown}] — réservé à la clé d'import.
-- gone_at marque les pièces retirées par la vérification : seules celles-là peuvent revenir (jamais celles retirées à la main).
create or replace function public.stock_update(p_key text, p_rows jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not exists (select 1 from import_keys where key = p_key) then raise exception 'forbidden'; end if;
  update products p
     set checked_at = now(),
         active = case when r->>'status' = 'gone' then false
                       when r->>'status' = 'ok' and p.gone_at is not null then true
                       else p.active end,
         gone_at = case when r->>'status' = 'gone' then coalesce(p.gone_at, now())
                        when r->>'status' = 'ok' then null
                        else p.gone_at end
    from jsonb_array_elements(p_rows) r
   where p.id = (r->>'id')::bigint
     and (p.active or p.gone_at is not null);
  get diagnostics n = row_count;
  return n;
end $$;

revoke all on function public.stock_update(text, jsonb) from public;
grant execute on function public.stock_update(text, jsonb) to anon, authenticated;
