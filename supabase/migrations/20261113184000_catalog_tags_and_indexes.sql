-- GAME-116 · HU-4.1 Catálogo: etiquetas, popularidad e índices del listado (plan, sección 2.3).
-- Las políticas RLS van en la migración siguiente; aquí las tablas nacen ya cerradas.

-- ── Etiquetas ────────────────────────────────────────────────────────────────

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create table public.tag_translations (
  tag_id uuid not null references public.tags (id) on delete cascade,
  locale public.locale not null,
  name text not null check (char_length(name) between 1 and 40),
  primary key (tag_id, locale)
);

create table public.pack_tags (
  pack_id uuid not null references public.packs (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (pack_id, tag_id)
);

-- La clave primaria cubre "etiquetas de un pack"; este índice cubre "packs de una etiqueta".
create index pack_tags_tag_idx on public.pack_tags (tag_id);

alter table public.tags enable row level security;
alter table public.tag_translations enable row level security;
alter table public.pack_tags enable row level security;

-- ── Popularidad ──────────────────────────────────────────────────────────────
-- Veces que se ha jugado el set. Solo lo escribe el servidor, con las estadísticas de partidas.

alter table public.packs
add column play_count integer not null default 0 check (play_count >= 0);

-- ── Índices del listado ──────────────────────────────────────────────────────
-- Parciales: Descubrir y la búsqueda solo listan sets publicados y públicos.

create index packs_listing_category_idx on public.packs (category_id, published_at desc)
where status = 'published' and visibility = 'public';

create index packs_listing_popular_idx on public.packs (play_count desc, published_at desc)
where status = 'published' and visibility = 'public';

create index packs_listing_recent_idx on public.packs (published_at desc)
where status = 'published' and visibility = 'public';
