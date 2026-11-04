-- Maison Piécette v6 : « Ma sélection », les pièces gardées pour plus tard, rattachées au compte
do $$
declare t text;
begin
  select format_type(atttypid, atttypmod) into t from pg_attribute where attrelid = 'public.products'::regclass and attname = 'id';
  execute format('create table if not exists saved_items (
    user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
    product_id %s not null references products(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, product_id)
  )', t);
end $$;

alter table saved_items enable row level security;

drop policy if exists "saved: lire les siennes" on saved_items;
drop policy if exists "saved: ajouter les siennes" on saved_items;
drop policy if exists "saved: retirer les siennes" on saved_items;
create policy "saved: lire les siennes" on saved_items for select using (auth.uid() = user_id);
create policy "saved: ajouter les siennes" on saved_items for insert with check (auth.uid() = user_id);
create policy "saved: retirer les siennes" on saved_items for delete using (auth.uid() = user_id);

grant select, insert, delete on saved_items to authenticated;
