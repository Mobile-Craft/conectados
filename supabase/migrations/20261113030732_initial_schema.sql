-- GAME-11 · Migración inicial: perfiles y catálogo (plan, sección 2.3).
-- Historias, IA, partidas, salas y negocio llegan en sus propias migraciones.
-- Regla: una migración publicada no se edita; los cambios van en una nueva.

-- ── Tipos compartidos ────────────────────────────────────────────────────────
-- Texto con CHECK en lugar de enums: añadir un valor luego es cambiar un CHECK, no un tipo.

create domain public.locale as text check (value in ('es', 'en'));

-- ── Identidad ────────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 50),
  avatar_url text,
  birth_date date check (birth_date > date '1900-01-01'),
  -- Derivado de birth_date. Se recalcula al cambiar la fecha; el age gate (HU-3.2)
  -- y el filtro por edad (HU-4.6) usan public.age_band_of() para no depender de él.
  age_band text check (age_band in ('under_18', '18_plus')),
  locale public.locale not null default 'es',
  theme_pref text not null default 'system' check (theme_pref in ('system', 'light', 'dark')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.profiles is 'Un perfil por usuario de auth, también para invitados anónimos.';

create function public.age_band_of(birth date)
returns text
language sql
stable
set search_path = ''
as $$
  select case
    when birth is null then null
    when birth > (current_date - interval '18 years')::date then 'under_18'
    else '18_plus'
  end;
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function public.profiles_derive_age_band()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.age_band := public.age_band_of(new.birth_date);
  return new;
end;
$$;

create trigger profiles_age_band
before insert or update of birth_date on public.profiles
for each row execute function public.profiles_derive_age_band();

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Cada usuario nuevo de auth (Google, Apple o anónimo) recibe su perfil.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ── Catálogo ─────────────────────────────────────────────────────────────────

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  icon text,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order integer not null default 0
);

create table public.category_translations (
  category_id uuid not null references public.categories (id) on delete cascade,
  locale public.locale not null,
  name text not null check (char_length(name) between 1 and 60),
  description text,
  primary key (category_id, locale)
);

create table public.packs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  cover_url text,
  category_id uuid references public.categories (id) on delete set null,
  intensity smallint not null default 1 check (intensity between 1 and 5),
  min_age smallint not null default 0 check (min_age in (0, 13, 18)),
  source text not null default 'curated' check (source in ('curated', 'ai')),
  author_id uuid references public.profiles (id) on delete cascade,
  visibility text not null default 'public' check (visibility in ('public', 'link', 'private')),
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  question_count integer not null default 0 check (question_count >= 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Curado: sin autor. Generado por IA: siempre con autor.
  constraint packs_author_matches_source check (
    (source = 'curated' and author_id is null) or (source = 'ai' and author_id is not null)
  ),
  constraint packs_published_has_date check (status <> 'published' or published_at is not null)
);

create index packs_category_idx on public.packs (category_id);
create index packs_catalog_idx on public.packs (status, visibility, min_age);
create index packs_author_idx on public.packs (author_id) where author_id is not null;

create trigger packs_updated_at
before update on public.packs
for each row execute function public.set_updated_at();

create table public.pack_translations (
  pack_id uuid not null references public.packs (id) on delete cascade,
  locale public.locale not null,
  title text not null check (char_length(title) between 1 and 80),
  description text,
  primary key (pack_id, locale)
);

-- Cada idioma tiene sus propias preguntas: no se traducen en runtime (D-06).
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs (id) on delete cascade,
  locale public.locale not null,
  order_index integer not null check (order_index >= 0),
  type text not null default 'open' check (type in ('open', 'choice', 'vote', 'dare')),
  intensity smallint not null default 1 check (intensity between 1 and 5),
  body text not null check (char_length(body) between 1 and 500),
  unique (pack_id, locale, order_index)
);

-- ── Seguridad a nivel de fila ───────────────────────────────────────────────
-- Todo cerrado por defecto. Los clientes solo leen; las escrituras del catálogo
-- y de los sets generados van por Edge Functions con service_role (plan, RLS).

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.category_translations enable row level security;
alter table public.packs enable row level security;
alter table public.pack_translations enable row level security;
alter table public.questions enable row level security;

-- profiles: solo el propio.
create policy "profiles: leer el propio"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "profiles: editar el propio"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Categorías: públicas.
create policy "categories: lectura pública"
on public.categories for select to anon, authenticated
using (true);

create policy "category_translations: lectura pública"
on public.category_translations for select to anon, authenticated
using (true);

-- Packs: publicados y públicos, o los propios. El filtro por edad (min_age frente a
-- age_band, D-07) se añade en HU-4.6, y el acceso por enlace (visibility='link') en HU-7.7.
create policy "packs: publicados o propios"
on public.packs for select to anon, authenticated
using (
  (status = 'published' and visibility = 'public')
  or author_id = (select auth.uid())
);

-- Traducciones y preguntas: visibles si su pack lo es (la subconsulta aplica la RLS de packs).
create policy "pack_translations: si el pack es visible"
on public.pack_translations for select to anon, authenticated
using (exists (select 1 from public.packs p where p.id = pack_id));

create policy "questions: si el pack es visible"
on public.questions for select to anon, authenticated
using (exists (select 1 from public.packs p where p.id = pack_id));

-- Las funciones de trigger no se llaman desde la API.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.profiles_derive_age_band() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;
