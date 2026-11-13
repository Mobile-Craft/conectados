-- GAME-119 · HU-4.1 Pruebas de RLS del catálogo: anónimo, invitado, menor, adulto y autor.
-- Corre con `npm run db:test`. Todo pasa dentro de una transacción que se deshace al final.

begin;

create extension if not exists pgtap with schema extensions;

select plan(36);

-- ── Datos de prueba (como postgres, sin RLS) ────────────────────────────────

insert into auth.users (id, aud, role, email, is_anonymous) values
  ('00000000-0000-4000-8000-0000000000a0', 'authenticated', 'authenticated', null, true),
  ('00000000-0000-4000-8000-0000000000a1', 'authenticated', 'authenticated', 'nino@rls.test', false),
  ('00000000-0000-4000-8000-0000000000a2', 'authenticated', 'authenticated', 'teen@rls.test', false),
  ('00000000-0000-4000-8000-0000000000a3', 'authenticated', 'authenticated', 'adulto@rls.test', false),
  ('00000000-0000-4000-8000-0000000000a4', 'authenticated', 'authenticated', 'autor@rls.test', false);

-- El invitado (a0) no declara fecha: cuenta como sin edad.
update public.profiles set birth_date = current_date - interval '10 years' where id = '00000000-0000-4000-8000-0000000000a1';
update public.profiles set birth_date = current_date - interval '15 years' where id = '00000000-0000-4000-8000-0000000000a2';
update public.profiles set birth_date = current_date - interval '30 years' where id = '00000000-0000-4000-8000-0000000000a3';
update public.profiles set birth_date = current_date - interval '30 years' where id = '00000000-0000-4000-8000-0000000000a4';

insert into public.categories (id, slug) values ('00000000-0000-4000-8000-0000000000c1', 'rls-categoria');

insert into public.packs (id, slug, min_age, status, published_at, source, author_id, visibility) values
  ('00000000-0000-4000-8000-0000000000b1', 'rls-todos', 0, 'published', now(), 'curated', null, 'public'),
  ('00000000-0000-4000-8000-0000000000b2', 'rls-13', 13, 'published', now(), 'curated', null, 'public'),
  ('00000000-0000-4000-8000-0000000000b3', 'rls-18', 18, 'published', now(), 'curated', null, 'public'),
  ('00000000-0000-4000-8000-0000000000b4', 'rls-borrador', 0, 'draft', null, 'curated', null, 'public'),
  ('00000000-0000-4000-8000-0000000000b5', 'rls-enlace-k3x9', 0, 'published', now(), 'ai', '00000000-0000-4000-8000-0000000000a4', 'link'),
  ('00000000-0000-4000-8000-0000000000b6', 'rls-enlace18-q7z2', 18, 'published', now(), 'ai', '00000000-0000-4000-8000-0000000000a4', 'link'),
  ('00000000-0000-4000-8000-0000000000b7', 'rls-privado', 0, 'published', now(), 'ai', '00000000-0000-4000-8000-0000000000a4', 'private'),
  ('00000000-0000-4000-8000-0000000000b8', 'rls-autor-borrador', 18, 'draft', null, 'ai', '00000000-0000-4000-8000-0000000000a4', 'private');

update public.packs set category_id = '00000000-0000-4000-8000-0000000000c1' where slug like 'rls-%';

-- Cada pack: una traducción con la palabra "zafiro" (para buscar) y una pregunta.
insert into public.pack_translations (pack_id, locale, title)
select id, 'es', 'Zafiro ' || slug from public.packs where slug like 'rls-%';

insert into public.questions (pack_id, locale, order_index, body)
select id, 'es', 0, 'Pregunta de ' || slug from public.packs where slug like 'rls-%';

insert into public.tags (id, slug) values ('00000000-0000-4000-8000-0000000000d1', 'rls-etiqueta');
insert into public.pack_tags (pack_id, tag_id) values
  ('00000000-0000-4000-8000-0000000000b1', '00000000-0000-4000-8000-0000000000d1'),
  ('00000000-0000-4000-8000-0000000000b3', '00000000-0000-4000-8000-0000000000d1');

-- Packs de prueba que ve quien consulta ahora, ordenados por slug.
create function pg_temp.visible_slugs()
returns text[]
language sql
as $$
  select coalesce(array_agg(slug order by slug), '{}') from public.packs where slug like 'rls-%';
$$;
grant execute on function pg_temp.visible_slugs() to anon, authenticated;

-- ── Anónimo (sin sesión) ─────────────────────────────────────────────────────

set local role anon;
select set_config('request.jwt.claims', '', true);
select set_config('request.headers', '', true);

select is(pg_temp.visible_slugs(), array['rls-todos'], 'anónimo: solo los sets para todos');
select is((select count(*)::int from public.questions where pack_id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'anónimo: no lee preguntas de un set 18+ por su id');
select is((select count(*)::int from public.search_packs('zafiro', 'es')), 1, 'anónimo: la búsqueda solo trae lo que puede ver');
select throws_ok($$insert into public.packs (slug) values ('rls-intruso')$$, '42501', null, 'anónimo: no crea packs');

-- Por enlace: con el slug en la cabecera ve ese set y sus preguntas, pero no aparece al buscar.
select set_config('request.headers', '{"x-pack-slug":"rls-enlace-k3x9"}', true);
select is(pg_temp.visible_slugs(), array['rls-enlace-k3x9', 'rls-todos'], 'anónimo con slug: ve el set compartido');
select is((select count(*)::int from public.questions where pack_id = '00000000-0000-4000-8000-0000000000b5'), 1,
  'anónimo con slug: lee sus preguntas');
select is((select count(*)::int from public.search_packs('zafiro', 'es')), 1, 'anónimo con slug: el set compartido no sale al buscar');

select set_config('request.headers', '{"x-pack-slug":"rls-enlace-otro"}', true);
select is(pg_temp.visible_slugs(), array['rls-todos'], 'anónimo con slug equivocado: no ve el set compartido');

select set_config('request.headers', '{"x-pack-slug":"rls-privado"}', true);
select is(pg_temp.visible_slugs(), array['rls-todos'], 'el slug no abre un set privado');

select set_config('request.headers', '{"x-pack-slug":"rls-borrador"}', true);
select is(pg_temp.visible_slugs(), array['rls-todos'], 'el slug no abre un borrador');

-- ── Invitado (sesión anónima, sin fecha de nacimiento) ──────────────────────

reset role;
set local role authenticated;
select set_config('request.headers', '', true);
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-4000-8000-0000000000a0","role":"authenticated","is_anonymous":true}', true);

select is(public.viewer_age(), null, 'invitado sin fecha: sin edad');
select is(pg_temp.visible_slugs(), array['rls-todos'], 'invitado sin fecha: solo los sets para todos');

-- ── Menor de 13 ──────────────────────────────────────────────────────────────

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true);

select is(pg_temp.visible_slugs(), array['rls-todos'], 'niño (10): solo los sets para todos');
select is((select count(*)::int from public.packs where id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'niño: no obtiene el set 18+ pidiéndolo por id');
select is((select count(*)::int from public.questions where pack_id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'niño: no lee sus preguntas');
select is((select count(*)::int from public.pack_translations where pack_id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'niño: no lee sus traducciones');
select is((select count(*)::int from public.pack_tags where pack_id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'niño: no lee sus etiquetas');
select is((select count(*)::int from public.search_packs('zafiro', 'es')), 1, 'niño: la búsqueda no trae sets de su edad para arriba');
select is((select count(*)::int from public.profiles where id <> '00000000-0000-4000-8000-0000000000a1'), 0,
  'niño: no lee perfiles ajenos');

select set_config('request.headers', '{"x-pack-slug":"rls-enlace18-q7z2"}', true);
select is((select count(*)::int from public.packs where slug = 'rls-enlace18-q7z2'), 0,
  'niño con slug: no abre un set 18+ compartido por enlace');
select set_config('request.headers', '', true);

-- ── Adolescente (15) ─────────────────────────────────────────────────────────

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a2","role":"authenticated"}', true);

select is(public.viewer_age(), 15, 'adolescente: edad calculada en el servidor');
select is(pg_temp.visible_slugs(), array['rls-13', 'rls-todos'], 'adolescente: sets para todos y 13+');
select is((select count(*)::int from public.questions where pack_id = '00000000-0000-4000-8000-0000000000b3'), 0,
  'adolescente: no lee preguntas de un set 18+');

-- ── Adulto ───────────────────────────────────────────────────────────────────

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a3","role":"authenticated"}', true);

select is(pg_temp.visible_slugs(), array['rls-13', 'rls-18', 'rls-todos'], 'adulto: todo lo publicado y público, nada ajeno ni borradores');
select is((select count(*)::int from public.questions where pack_id = '00000000-0000-4000-8000-0000000000b3'), 1,
  'adulto: lee preguntas de un set 18+');
select is((select count(*)::int from public.pack_tags where pack_id = '00000000-0000-4000-8000-0000000000b3'), 1,
  'adulto: lee sus etiquetas');
select is((select count(*)::int from public.search_packs('zafiro', 'es')), 3, 'adulto: la búsqueda trae los tres sets públicos');

select set_config('request.headers', '{"x-pack-slug":"rls-enlace18-q7z2"}', true);
select is((select count(*)::int from public.packs where slug = 'rls-enlace18-q7z2'), 1, 'adulto con slug: abre el set 18+ compartido');
select set_config('request.headers', '', true);

-- Escrituras: los clientes solo leen el catálogo.
select throws_ok($$insert into public.packs (slug) values ('rls-intruso')$$, '42501', null, 'adulto: no crea packs');
select throws_ok($$insert into public.questions (pack_id, locale, order_index, body)
  values ('00000000-0000-4000-8000-0000000000b1', 'es', 9, 'intrusa')$$, '42501', null, 'adulto: no crea preguntas');
select throws_ok($$insert into public.tags (slug) values ('rls-intrusa')$$, '42501', null, 'adulto: no crea etiquetas');
select throws_ok($$insert into public.pack_tags (pack_id, tag_id)
  values ('00000000-0000-4000-8000-0000000000b2', '00000000-0000-4000-8000-0000000000d1')$$, '42501', null,
  'adulto: no etiqueta packs');

-- ── Autor ────────────────────────────────────────────────────────────────────

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a4","role":"authenticated"}', true);

select is(pg_temp.visible_slugs(),
  array['rls-13', 'rls-18', 'rls-autor-borrador', 'rls-enlace-k3x9', 'rls-enlace18-q7z2', 'rls-privado', 'rls-todos'],
  'autor: ve lo publicado y además todo lo suyo, en cualquier estado');
select is((select count(*)::int from public.search_packs('zafiro', 'es')), 3, 'autor: lo suyo privado no sale al buscar');

-- Sin políticas de escritura, el autor tampoco cambia ni borra lo suyo desde el cliente.
update public.packs set play_count = 999, status = 'published' where slug = 'rls-autor-borrador';
delete from public.packs where slug = 'rls-privado';

reset role;
select is((select status from public.packs where slug = 'rls-autor-borrador'), 'draft', 'autor: no cambia su set desde el cliente');
select is((select count(*)::int from public.packs where slug = 'rls-privado'), 1, 'autor: no borra su set desde el cliente');

select * from finish();

rollback;
