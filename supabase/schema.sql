-- ============================================================
-- Smart Lima Lab — Esquema, RLS y datos semilla (T09–T11)
-- Pegar TODO esto en: Supabase → SQL Editor → New query → Run
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- TABLAS
-- ----------------------------------------------------------------

-- Perfiles (1 a 1 con auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  carrera text,
  ciclo int,
  bio text,
  avatar_url text,
  github_username text,
  github_url text,
  guia_vista boolean not null default false,
  creado_en timestamptz not null default now()
);

-- Retos reales de Lima
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  categoria text not null,
  descripcion text,
  dificultad text check (dificultad in ('Básico','Intermedio','Avanzado')),
  habilidades text[] not null default '{}',
  mentor text,
  estado text not null default 'abierto' check (estado in ('abierto','en_progreso','completado')),
  creado_en timestamptz not null default now()
);

-- Equipos por reto
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  nombre text not null,
  creado_por uuid references public.profiles(id) on delete set null,
  estado text not null default 'en_progreso' check (estado in ('en_progreso','completado')),
  repo_url text,
  creado_en timestamptz not null default now()
);

-- Miembros de equipo
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  rol text not null default 'miembro',
  unido_en timestamptz not null default now(),
  unique (team_id, profile_id)
);

-- Tareas del proyecto
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  titulo text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente','en_progreso','hecho')),
  responsable uuid references public.profiles(id) on delete set null,
  creado_en timestamptz not null default now()
);

-- Insignias / experiencia
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  nombre text not null,
  challenge_id uuid references public.challenges(id) on delete set null,
  fecha timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- TRIGGER: crear perfil automáticamente al registrarse (incluye GitHub)
-- ----------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, avatar_url, github_username, github_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'name',
             new.email),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'user_name',
    case when new.raw_user_meta_data->>'user_name' is not null
         then 'https://github.com/' || (new.raw_user_meta_data->>'user_name')
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------
-- RLS (Row Level Security) — obligatorio en todas las tablas
-- ----------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.challenges   enable row level security;
alter table public.teams        enable row level security;
alter table public.team_members enable row level security;
alter table public.tasks        enable row level security;
alter table public.badges       enable row level security;

-- profiles: lectura pública (portafolios); el dueño crea/edita el suyo
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- challenges: lectura pública; sin escritura desde el cliente (solo seed/admin)
create policy "challenges_select_all" on public.challenges for select using (true);

-- teams: lectura pública; crea quien está autenticado; editan los miembros
create policy "teams_select_all" on public.teams for select using (true);
create policy "teams_insert_auth" on public.teams for insert with check (auth.uid() = creado_por);
create policy "teams_update_members" on public.teams for update using (
  exists (select 1 from public.team_members m
          where m.team_id = teams.id and m.profile_id = auth.uid())
);

-- team_members: lectura pública; cada usuario se inscribe / sale por sí mismo
create policy "tm_select_all"  on public.team_members for select using (true);
create policy "tm_insert_self" on public.team_members for insert with check (auth.uid() = profile_id);
create policy "tm_delete_self" on public.team_members for delete using (auth.uid() = profile_id);

-- tasks: lectura pública; escritura solo miembros del equipo
create policy "tasks_select_all" on public.tasks for select using (true);
create policy "tasks_insert_members" on public.tasks for insert with check (
  exists (select 1 from public.team_members m
          where m.team_id = tasks.team_id and m.profile_id = auth.uid())
);
create policy "tasks_update_members" on public.tasks for update using (
  exists (select 1 from public.team_members m
          where m.team_id = tasks.team_id and m.profile_id = auth.uid())
);

-- badges: lectura pública; sin escritura desde el cliente
create policy "badges_select_all" on public.badges for select using (true);

-- ----------------------------------------------------------------
-- DATOS SEMILLA: retos reales de Lima (no dependen de usuarios)
-- ----------------------------------------------------------------
insert into public.challenges (titulo, categoria, descripcion, dificultad, habilidades, mentor, estado) values
('Congestión en paraderos', 'Movilidad',
 'Mostrar en tiempo real la congestión de paraderos para que la gente decida mejor su ruta y horario.',
 'Intermedio', array['React','APIs','UX','Datos'], 'Mentor UPCH', 'abierto'),
('Respuesta de ambulancias', 'Salud',
 'Derivar emergencias al hospital con disponibilidad real de camas y especialidad para reducir tiempos.',
 'Avanzado', array['Mapas','APIs','UX'], 'Mentor UPCH', 'abierto'),
('Alertas de zonas inseguras', 'Seguridad',
 'Informar a peatones sobre zonas con incidentes recientes y sugerir rutas más seguras.',
 'Intermedio', array['Geolocalización','React'], 'Mentor UPCH', 'abierto'),
('Puntos de reciclaje', 'Medio ambiente',
 'Mapa de puntos de acopio y reciclaje en Lima con horarios y tipos de residuo aceptados.',
 'Básico', array['React','Mapas'], 'Mentor UPCH', 'abierto'),
('Semáforos adaptativos', 'Movilidad',
 'Prototipo de panel que simula semáforos que se ajustan al flujo vehicular por zona.',
 'Avanzado', array['Datos','Visualización'], 'Mentor UPCH', 'abierto')
on conflict do nothing;

-- Fin del esquema. (Los datos del usuario demo van en seed-demo-user.sql)
