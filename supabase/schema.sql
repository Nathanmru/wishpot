-- =====================================================================
--  Schéma de la base — à coller dans Supabase > SQL Editor > Run
--  (peut être relancé sans risque : tout est "if not exists"/"or replace")
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Profils (nom + photo du compte Google) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Cagnottes (un projet = un voyage ou une maison) ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  kind text not null check (kind in ('travel', 'home')),
  currency text not null default 'EUR',
  invite_token text not null unique default encode(gen_random_bytes(12), 'hex'),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  monthly_amount numeric(10,2) not null default 0 check (monthly_amount >= 0),
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  added_by uuid references auth.users(id) on delete set null,
  url text,
  title text not null check (char_length(title) between 1 and 200),
  image_url text,
  price numeric(10,2) not null default 0 check (price >= 0),
  quantity int not null default 1 check (quantity between 1 and 999),
  category text,
  purchased boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists items_project_idx on public.items(project_id);

-- Versements dans la cagnotte ("j'ai mis 100 € de côté ce mois-ci")
create table if not exists public.deposits (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(10,2) not null check (amount > 0),
  note text,
  deposited_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists deposits_project_idx on public.deposits(project_id);

-- Clics sortants (pour suivre l'affiliation)
create table if not exists public.clicks (
  id bigserial primary key,
  item_id uuid references public.items(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  host text,
  affiliated boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Fonctions utilitaires ----------
create or replace function public.is_member(pid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from project_members where project_id = pid and user_id = auth.uid());
$$;

create or replace function public.is_owner(pid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from project_members where project_id = pid and user_id = auth.uid() and role = 'owner');
$$;

-- Créer une cagnotte + s'y ajouter comme propriétaire, en une fois
create or replace function public.create_project(p_name text, p_kind text, p_monthly numeric, p_currency text default 'EUR')
returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  insert into projects (name, kind, currency, created_by)
  values (trim(p_name), p_kind, coalesce(p_currency, 'EUR'), auth.uid())
  returning id into new_id;
  insert into project_members (project_id, user_id, role, monthly_amount)
  values (new_id, auth.uid(), 'owner', greatest(coalesce(p_monthly, 0), 0));
  return new_id;
end $$;

-- Rejoindre une cagnotte avec le lien d'invitation
create or replace function public.join_project(p_token text)
returns uuid language plpgsql security definer set search_path = public as $$
declare pid uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  select id into pid from projects where invite_token = p_token;
  if pid is null then raise exception 'invalid invite'; end if;
  insert into project_members (project_id, user_id, role)
  values (pid, auth.uid(), 'member')
  on conflict (project_id, user_id) do nothing;
  return pid;
end $$;

-- Aperçu public d'une invitation (nom + type), sans être membre
create or replace function public.invite_preview(p_token text)
returns table (name text, kind text, members int)
language sql stable security definer set search_path = public as $$
  select p.name, p.kind, (select count(*)::int from project_members m where m.project_id = p.id)
  from projects p where p.invite_token = p_token;
$$;

-- Générer un nouveau lien d'invitation (l'ancien ne marche plus)
create or replace function public.regenerate_invite(pid uuid)
returns text language plpgsql security definer set search_path = public as $$
declare tok text;
begin
  if not is_owner(pid) then raise exception 'forbidden'; end if;
  tok := encode(gen_random_bytes(12), 'hex');
  update projects set invite_token = tok where id = pid;
  return tok;
end $$;

-- ---------- Sécurité : chacun ne voit que ses cagnottes ----------
alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.project_members enable row level security;
alter table public.items           enable row level security;
alter table public.deposits        enable row level security;
alter table public.clicks          enable row level security;

drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update to authenticated using (id = auth.uid());

drop policy if exists "projects member read" on public.projects;
create policy "projects member read" on public.projects for select to authenticated using (is_member(id));
drop policy if exists "projects owner update" on public.projects;
create policy "projects owner update" on public.projects for update to authenticated using (is_owner(id));
drop policy if exists "projects owner delete" on public.projects;
create policy "projects owner delete" on public.projects for delete to authenticated using (is_owner(id));

drop policy if exists "members read" on public.project_members;
create policy "members read" on public.project_members for select to authenticated using (is_member(project_id));
drop policy if exists "members self update" on public.project_members;
create policy "members self update" on public.project_members for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "members leave or owner kick" on public.project_members;
create policy "members leave or owner kick" on public.project_members for delete to authenticated
  using (user_id = auth.uid() or is_owner(project_id));

drop policy if exists "items member all" on public.items;
create policy "items member all" on public.items for all to authenticated
  using (is_member(project_id)) with check (is_member(project_id));

drop policy if exists "deposits member read" on public.deposits;
create policy "deposits member read" on public.deposits for select to authenticated using (is_member(project_id));
drop policy if exists "deposits self insert" on public.deposits;
create policy "deposits self insert" on public.deposits for insert to authenticated
  with check (user_id = auth.uid() and is_member(project_id));
drop policy if exists "deposits self delete" on public.deposits;
create policy "deposits self delete" on public.deposits for delete to authenticated using (user_id = auth.uid());

drop policy if exists "clicks insert" on public.clicks;
create policy "clicks insert" on public.clicks for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

grant execute on function public.create_project(text, text, numeric, text) to authenticated;
grant execute on function public.join_project(text) to authenticated;
grant execute on function public.invite_preview(text) to anon, authenticated;
grant execute on function public.regenerate_invite(uuid) to authenticated;

-- Lien membres → profils (pour afficher nom et photo)
do $$ begin
  alter table public.project_members
    add constraint project_members_profile_fk foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;
