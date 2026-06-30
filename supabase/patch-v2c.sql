-- Parche v2c: mentor asignable a proyectos (equipos).
-- Pegar en Supabase -> SQL Editor -> Run.
alter table public.teams
  add column if not exists mentor_id uuid references public.profiles(id) on delete set null;
