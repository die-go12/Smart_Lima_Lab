-- ============================================================
-- Smart Lima Lab — Migración v2 (idempotente)
-- Pegar TODO en Supabase -> SQL Editor -> Run.
-- Agrega: roles, propuestas de reto, proyectos propios,
-- insignias (catálogo + función de logros) y convocatorias.
-- ============================================================

-- ---- PROFILES ----
alter table public.profiles add column if not exists rol text not null default 'estudiante';
alter table public.profiles add column if not exists especialidad text;
alter table public.profiles drop constraint if exists profiles_rol_check;
alter table public.profiles add constraint profiles_rol_check check (rol in ('estudiante','mentor'));

-- ---- CHALLENGES (propuestas + guía técnica) ----
alter table public.challenges add column if not exists propuesto_por uuid references public.profiles(id) on delete set null;
alter table public.challenges add column if not exists estado_revision text not null default 'aprobado';
alter table public.challenges add column if not exists guia_tecnica text;
alter table public.challenges add column if not exists aprobado_por uuid references public.profiles(id) on delete set null;
alter table public.challenges drop constraint if exists challenges_estado_revision_check;
alter table public.challenges add constraint challenges_estado_revision_check check (estado_revision in ('pendiente','aprobado','rechazado'));

-- ---- TEAMS como PROYECTOS ----
alter table public.teams alter column challenge_id drop not null;
alter table public.teams add column if not exists titulo text;
alter table public.teams add column if not exists descripcion text;
alter table public.teams add column if not exists visibilidad text not null default 'publico';
alter table public.teams add column if not exists repo_publico boolean not null default true;
alter table public.teams add column if not exists interdisciplinario boolean not null default false;
alter table public.teams add column if not exists especialidades_busca text;
alter table public.teams add column if not exists convocatoria_abierta boolean not null default false;
alter table public.teams add column if not exists origen text not null default 'reto';
alter table public.teams drop constraint if exists teams_visibilidad_check;
alter table public.teams add constraint teams_visibilidad_check check (visibilidad in ('publico','privado'));
alter table public.teams drop constraint if exists teams_origen_check;
alter table public.teams add constraint teams_origen_check check (origen in ('reto','proyecto_curso','proyecto_libre'));

-- ---- CATÁLOGO DE INSIGNIAS ----
create table if not exists public.badge_defs (
  codigo text primary key,
  nombre text not null,
  descripcion text,
  requisito text,
  icono text,
  orden int not null default 0
);

alter table public.badges add column if not exists codigo text references public.badge_defs(codigo) on delete set null;
-- evitar duplicados por persona+insignia
create unique index if not exists badges_profile_codigo_uniq
  on public.badges(profile_id, codigo) where codigo is not null;

-- ---- CONVOCATORIAS / POSTULACIONES ----
create table if not exists public.aplicaciones (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  mensaje text,
  estado text not null default 'pendiente' check (estado in ('pendiente','aceptada','rechazada')),
  creado_en timestamptz not null default now(),
  unique (team_id, profile_id)
);

-- ============================================================
-- FUNCIONES DE LOGROS (SECURITY DEFINER) — evitan auto-trampa
-- ============================================================
create or replace function public._dar(p_uid uuid, p_codigo text)
returns void language plpgsql security definer set search_path = public as $$
declare v_nombre text;
begin
  select nombre into v_nombre from public.badge_defs where codigo = p_codigo;
  insert into public.badges (profile_id, nombre, codigo)
  values (p_uid, coalesce(v_nombre, p_codigo), p_codigo)
  on conflict (profile_id, codigo) where codigo is not null do nothing;
end;
$$;

create or replace function public.evaluar_logros()
returns void language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_completados int;
  v_categorias int;
  v_creados int;
  v_mentorias int;
  v_propuestas int;
begin
  if v_uid is null then return; end if;

  select count(*) into v_completados
  from public.team_members tm join public.teams t on t.id = tm.team_id
  where tm.profile_id = v_uid and t.estado = 'completado';

  select count(distinct c.categoria) into v_categorias
  from public.team_members tm join public.teams t on t.id = tm.team_id
  join public.challenges c on c.id = t.challenge_id
  where tm.profile_id = v_uid and t.estado = 'completado';

  select count(*) into v_creados from public.teams t where t.creado_por = v_uid;
  select count(*) into v_mentorias from public.challenges c where c.aprobado_por = v_uid;
  select count(*) into v_propuestas from public.challenges c
  where c.propuesto_por = v_uid and c.estado_revision = 'aprobado';

  if v_completados >= 1 then perform public._dar(v_uid,'constructor'); end if;
  if v_completados >= 3 then perform public._dar(v_uid,'veterano'); end if;
  if v_categorias  >= 2 then perform public._dar(v_uid,'todoterreno'); end if;
  if v_creados     >= 1 then perform public._dar(v_uid,'capitan'); end if;
  if v_propuestas  >= 1 then perform public._dar(v_uid,'visionario'); end if;
  if v_mentorias   >= 1 then perform public._dar(v_uid,'mentoria'); end if;
  if v_mentorias   >= 3 then perform public._dar(v_uid,'lider'); end if;

  if v_completados >= 2 then
    update public.profiles set rol = 'mentor' where id = v_uid and rol <> 'mentor';
    perform public._dar(v_uid,'mentor_novato');
  end if;
end;
$$;

grant execute on function public.evaluar_logros() to authenticated;

-- ============================================================
-- RLS (actualizado)
-- ============================================================
alter table public.badge_defs   enable row level security;
alter table public.aplicaciones enable row level security;

-- badge_defs: lectura pública
drop policy if exists "badge_defs_select_all" on public.badge_defs;
create policy "badge_defs_select_all" on public.badge_defs for select using (true);

-- teams: ver públicos, o si eres miembro/creador (respeta 'privado')
drop policy if exists "teams_select_all" on public.teams;
drop policy if exists "teams_select_visible" on public.teams;
create policy "teams_select_visible" on public.teams for select using (
  visibilidad = 'publico'
  or creado_por = auth.uid()
  or exists (select 1 from public.team_members m where m.team_id = teams.id and m.profile_id = auth.uid())
);

-- challenges: ver aprobados, o el proponente ve los suyos, o un mentor ve todo
drop policy if exists "challenges_select_all" on public.challenges;
drop policy if exists "challenges_select_visible" on public.challenges;
create policy "challenges_select_visible" on public.challenges for select using (
  estado_revision = 'aprobado'
  or propuesto_por = auth.uid()
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.rol = 'mentor')
);

-- challenges: proponer (estudiante autenticado)
drop policy if exists "challenges_insert_propuesta" on public.challenges;
create policy "challenges_insert_propuesta" on public.challenges for insert
  with check (auth.uid() = propuesto_por);

-- challenges: aprobar/editar (solo mentor)
drop policy if exists "challenges_update_mentor" on public.challenges;
create policy "challenges_update_mentor" on public.challenges for update using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.rol = 'mentor')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.rol = 'mentor')
);

-- aplicaciones: postular uno mismo; ver el postulante o el dueño del proyecto; aceptar/rechazar el dueño
drop policy if exists "apl_insert_self" on public.aplicaciones;
create policy "apl_insert_self" on public.aplicaciones for insert with check (auth.uid() = profile_id);

drop policy if exists "apl_select_visible" on public.aplicaciones;
create policy "apl_select_visible" on public.aplicaciones for select using (
  profile_id = auth.uid()
  or exists (select 1 from public.teams t where t.id = aplicaciones.team_id and t.creado_por = auth.uid())
);

drop policy if exists "apl_update_owner" on public.aplicaciones;
create policy "apl_update_owner" on public.aplicaciones for update using (
  exists (select 1 from public.teams t where t.id = aplicaciones.team_id and t.creado_por = auth.uid())
) with check (
  exists (select 1 from public.teams t where t.id = aplicaciones.team_id and t.creado_por = auth.uid())
);

-- ============================================================
-- SEMILLA: catálogo de insignias
-- ============================================================
insert into public.badge_defs (codigo, nombre, descripcion, requisito, icono, orden) values
('primer_paso','Primer paso','Diste tu primer paso en la plataforma.','Unirte a tu primer equipo','footprints',1),
('constructor','Constructor','Completaste tu primer reto.','Completar 1 reto','hammer',2),
('veterano','Veterano','Ya tienes experiencia probada.','Completar 3 retos','medal',3),
('todoterreno','Todoterreno','Trabajas en distintos dominios.','Completar retos de 2+ categorías','layers',4),
('capitan','Capitán','Lideraste la creación de un equipo.','Crear un equipo','flag',5),
('visionario','Visionario','Tu propuesta de reto fue aprobada.','Proponer un reto aprobado','lightbulb',6),
('mentor_novato','Mentor novato','Alcanzaste el rol de mentor.','Completar 2 proyectos','graduation-cap',7),
('mentoria','Mentoría','Guiaste tu primer reto como mentor.','Aprobar 1 reto como mentor','compass',8),
('lider','Líder','Mentoreaste a varios grupos.','Mentorear 3+ grupos','crown',9),
('interdisciplinario','Interdisciplinario','Colaboraste fuera de tu especialidad.','Unirte a un proyecto interdisciplinario','users',10)
on conflict (codigo) do nothing;

-- Fin migración v2.

-- Mejora: nombre por defecto = nombre real -> usuario GitHub -> parte del correo
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nombre, avatar_url, github_username, github_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name',
             new.raw_user_meta_data->>'user_name',
             split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name',
    case when new.raw_user_meta_data->>'user_name' is not null
         then 'https://github.com/' || (new.raw_user_meta_data->>'user_name') end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
