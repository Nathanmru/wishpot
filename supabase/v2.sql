-- =====================================================================
--  Mise à jour v2 — pièces, cœurs, commentaires, liste à partager
--  (à coller dans Supabase > SQL Editor > Run ; peut être relancé)
-- =====================================================================

-- ---------- Objets : pièce + réservation par un proche ----------
alter table public.items add column if not exists room text;
alter table public.items add column if not exists reserved_by text;
alter table public.items add column if not exists reserved_at timestamptz;

-- ---------- Cagnotte : lien public de la liste ----------
alter table public.projects add column if not exists share_token text unique;

-- ---------- Cœurs ----------
create table if not exists public.item_likes (
  item_id uuid not null references public.items(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (item_id, user_id)
);

-- ---------- Commentaires ----------
create table if not exists public.item_comments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists item_comments_item_idx on public.item_comments(item_id);

create or replace function public.item_project(iid uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select project_id from items where id = iid;
$$;

alter table public.item_likes enable row level security;
alter table public.item_comments enable row level security;

drop policy if exists "likes member read" on public.item_likes;
create policy "likes member read" on public.item_likes for select to authenticated using (is_member(item_project(item_id)));
drop policy if exists "likes self insert" on public.item_likes;
create policy "likes self insert" on public.item_likes for insert to authenticated
  with check (user_id = auth.uid() and is_member(item_project(item_id)));
drop policy if exists "likes self delete" on public.item_likes;
create policy "likes self delete" on public.item_likes for delete to authenticated using (user_id = auth.uid());

drop policy if exists "comments member read" on public.item_comments;
create policy "comments member read" on public.item_comments for select to authenticated using (is_member(item_project(item_id)));
drop policy if exists "comments self insert" on public.item_comments;
create policy "comments self insert" on public.item_comments for insert to authenticated
  with check (user_id = auth.uid() and is_member(item_project(item_id)));
drop policy if exists "comments self delete" on public.item_comments;
create policy "comments self delete" on public.item_comments for delete to authenticated using (user_id = auth.uid());

-- ---------- Liste à partager ----------
-- Activer / couper le lien public (propriétaire uniquement)
create or replace function public.set_share(pid uuid, enabled boolean)
returns text language plpgsql security definer set search_path = public as $$
declare tok text;
begin
  if not is_owner(pid) then raise exception 'forbidden'; end if;
  if enabled then
    update projects set share_token = coalesce(share_token, encode(gen_random_bytes(9), 'hex')) where id = pid returning share_token into tok;
  else
    update projects set share_token = null where id = pid;
    tok := null;
  end if;
  return tok;
end $$;

-- Lecture publique de la liste (sans montant épargné ni noms des membres)
create or replace function public.public_list(p_token text)
returns json language sql stable security definer set search_path = public as $$
  select case when p.id is null then null else json_build_object(
    'name', p.name,
    'kind', p.kind,
    'currency', p.currency,
    'owner', (select split_part(coalesce(pr.display_name, ''), ' ', 1) from profiles pr where pr.id = p.created_by),
    'items', coalesce((
      select json_agg(json_build_object(
        'id', i.id, 'title', i.title, 'price', i.price, 'quantity', i.quantity,
        'image_url', i.image_url, 'url', i.url, 'room', i.room,
        'reserved', i.reserved_by is not null or i.purchased
      ) order by (i.reserved_by is not null or i.purchased), i.created_at desc)
      from items i where i.project_id = p.id
    ), '[]'::json)
  ) end
  from projects p where p.share_token = p_token and p_token is not null;
$$;

-- Un proche réserve un objet ("Je l'offre")
create or replace function public.reserve_item(p_token text, p_item uuid, p_name text)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if p_token is null or char_length(trim(coalesce(p_name, ''))) = 0 then return false; end if;
  update items i set reserved_by = left(trim(p_name), 60), reserved_at = now()
  from projects p
  where i.id = p_item and i.project_id = p.id and p.share_token = p_token
    and i.reserved_by is null and not i.purchased;
  get diagnostics n = row_count;
  return n > 0;
end $$;

grant execute on function public.set_share(uuid, boolean) to authenticated;
grant execute on function public.public_list(text) to anon, authenticated;
grant execute on function public.reserve_item(text, uuid, text) to anon, authenticated;
