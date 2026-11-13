-- GAME-117 · HU-4.1 RLS del catálogo: edad (D-07), acceso por enlace y etiquetas.
-- El filtro por edad vive aquí y no en la interfaz: un menor no obtiene un set 18+
-- ni llamando a la API directamente.

-- ── Ayudantes ────────────────────────────────────────────────────────────────

-- Edad en años de quien consulta, calculada desde su fecha de nacimiento (no desde
-- age_band, que no distingue el nivel 13+). Null sin sesión o sin fecha declarada.
create function public.viewer_age()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select extract(year from age(current_date, p.birth_date))::integer
  from public.profiles p
  where p.id = (select auth.uid())
    and p.birth_date is not null
    and p.deleted_at is null;
$$;

comment on function public.viewer_age() is
  'Edad de quien consulta. Sin edad, las políticas la tratan como 0: solo sets para todos.';

-- Slug que la petición dice conocer, en la cabecera x-pack-slug. Conocer el slug de un
-- set compartido por enlace es lo que da acceso a él.
create function public.requested_pack_slug()
returns text
language sql
stable
set search_path = ''
as $$
  select nullif(current_setting('request.headers', true), '')::json ->> 'x-pack-slug';
$$;

-- ── Packs ────────────────────────────────────────────────────────────────────

drop policy "packs: publicados o propios" on public.packs;

-- El autor ve siempre lo suyo. Los demás, solo lo publicado que su edad permite:
-- público para todos, o por enlace si la petición trae su slug (nunca en listados).
create policy "packs: publicados para su edad, o propios"
on public.packs for select to anon, authenticated
using (
  author_id = (select auth.uid())
  or (
    status = 'published'
    and min_age <= coalesce((select public.viewer_age()), 0)
    and (
      visibility = 'public'
      or (visibility = 'link' and slug = (select public.requested_pack_slug()))
    )
  )
);

-- pack_translations y questions ya dependen de que el pack sea visible (migración inicial):
-- heredan el filtro por edad y el acceso por enlace sin cambios.

-- ── Etiquetas ────────────────────────────────────────────────────────────────

create policy "tags: lectura pública"
on public.tags for select to anon, authenticated
using (true);

create policy "tag_translations: lectura pública"
on public.tag_translations for select to anon, authenticated
using (true);

create policy "pack_tags: si el pack es visible"
on public.pack_tags for select to anon, authenticated
using (exists (select 1 from public.packs p where p.id = pack_id));
