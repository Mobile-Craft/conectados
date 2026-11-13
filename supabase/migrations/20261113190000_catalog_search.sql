-- GAME-118 · HU-4.1 Búsqueda de texto completo en es y en: título, descripción y etiquetas.
-- Sin acentos (canción = cancion) y por prefijo, para buscar mientras se escribe (HU-4.3).

-- ── Configuraciones de texto por idioma ──────────────────────────────────────

create extension if not exists unaccent with schema extensions;

create text search configuration public.es_unaccent (copy = pg_catalog.spanish);
alter text search configuration public.es_unaccent
alter mapping for hword, hword_part, word with extensions.unaccent, spanish_stem;

create text search configuration public.en_unaccent (copy = pg_catalog.english);
alter text search configuration public.en_unaccent
alter mapping for hword, hword_part, word with extensions.unaccent, english_stem;

-- Inmutable para poder usarla en columnas generadas. Un idioma nuevo añade su rama aquí.
create function public.catalog_ts_config(lang public.locale)
returns regconfig
language sql
immutable
set search_path = ''
as $$
  select case lang
    when 'es' then 'public.es_unaccent'::regconfig
    else 'public.en_unaccent'::regconfig
  end;
$$;

-- ── Nombres de etiquetas copiados en cada traducción del pack ────────────────
-- Así título, etiquetas y descripción forman un solo documento indexado, y una búsqueda
-- de dos palabras encuentra el set aunque una esté en el título y otra en una etiqueta.

alter table public.pack_translations add column tag_names text not null default '';

create function public.pack_tag_names(target_pack uuid, lang public.locale)
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(string_agg(tt.name, ' ' order by tt.name), '')
  from public.pack_tags pt
  join public.tag_translations tt on tt.tag_id = pt.tag_id and tt.locale = lang
  where pt.pack_id = target_pack;
$$;

create function public.refresh_pack_tag_names(target_packs uuid[])
returns void
language sql
set search_path = ''
as $$
  update public.pack_translations t
  set tag_names = public.pack_tag_names(t.pack_id, t.locale)
  where t.pack_id = any (target_packs)
    and t.tag_names is distinct from public.pack_tag_names(t.pack_id, t.locale);
$$;

create function public.pack_translations_fill_tag_names()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.tag_names := public.pack_tag_names(new.pack_id, new.locale);
  return new;
end;
$$;

create trigger pack_translations_tag_names
before insert or update of pack_id, locale on public.pack_translations
for each row execute function public.pack_translations_fill_tag_names();

create function public.pack_tags_changed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform public.refresh_pack_tag_names(array[coalesce(new.pack_id, old.pack_id), old.pack_id]);
  return null;
end;
$$;

create trigger pack_tags_refresh_names
after insert or update or delete on public.pack_tags
for each row execute function public.pack_tags_changed();

create function public.tag_translations_changed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform public.refresh_pack_tag_names(array(
    select pack_id from public.pack_tags
    where tag_id in (coalesce(new.tag_id, old.tag_id), old.tag_id)
  ));
  return null;
end;
$$;

create trigger tag_translations_refresh_names
after insert or update or delete on public.tag_translations
for each row execute function public.tag_translations_changed();

-- ── Documento de búsqueda ────────────────────────────────────────────────────
-- Pesos: título (A) > etiquetas (B) > descripción (C).

alter table public.pack_translations add column search_vector tsvector generated always as (
  setweight(to_tsvector(public.catalog_ts_config(locale), title), 'A')
  || setweight(to_tsvector(public.catalog_ts_config(locale), tag_names), 'B')
  || setweight(to_tsvector(public.catalog_ts_config(locale), coalesce(description, '')), 'C')
) stored;

create index pack_translations_search_idx on public.pack_translations using gin (search_vector);

-- ── Consulta ─────────────────────────────────────────────────────────────────

-- Texto libre → tsquery: cada palabra por prefijo y todas obligatorias. Los signos
-- se descartan, así que el texto del usuario nunca se interpreta como operadores.
create function public.catalog_tsquery(query text, lang public.locale)
returns tsquery
language sql
immutable
set search_path = ''
as $$
  select to_tsquery(public.catalog_ts_config(lang), string_agg(word || ':*', ' & '))
  from regexp_split_to_table(lower(coalesce(query, '')), '[^[:alnum:]]+') as word
  where word <> '';
$$;

-- Sets publicados y públicos que coinciden, del más relevante al menos. Corre con los
-- permisos de quien busca: la RLS de packs filtra por edad, y lo compartido por enlace
-- no aparece. Devuelve filas de packs para que el cliente pueda pedir sus relaciones.
-- La tsquery va en una subconsulta escalar: se calcula una vez y deja usar el índice GIN.
create function public.search_packs(query text, lang public.locale, max_results integer default 30)
returns setof public.packs
language sql
stable
security invoker
set search_path = ''
as $$
  select p.*
  from public.packs p
  join public.pack_translations t on t.pack_id = p.id and t.locale = lang
  where p.status = 'published'
    and p.visibility = 'public'
    and t.search_vector @@ (select public.catalog_tsquery(query, lang))
  order by ts_rank(t.search_vector, (select public.catalog_tsquery(query, lang))) desc,
    p.play_count desc,
    p.published_at desc
  limit least(greatest(coalesce(max_results, 30), 1), 100);
$$;

-- Las funciones de trigger y de mantenimiento no se llaman desde la API.
revoke execute on function public.refresh_pack_tag_names(uuid[]) from anon, authenticated, public;
revoke execute on function public.pack_translations_fill_tag_names() from anon, authenticated, public;
revoke execute on function public.pack_tags_changed() from anon, authenticated, public;
revoke execute on function public.tag_translations_changed() from anon, authenticated, public;
