-- ============================================================
-- Smart Lima Lab — Datos del USUARIO DEMO "con proyecto" (T11)
--
-- IMPORTANTE: ejecutar ESTE script DESPUÉS de:
--   1) Haber corrido schema.sql.
--   2) Haber creado el usuario demo (entrando una vez a la app
--      con GitHub o email). Al entrar, el trigger crea su perfil.
--
-- Luego: reemplaza el email de abajo por el del usuario demo
-- y dale Run. Esto le crea el equipo Veyro, tareas y badge,
-- para que en la demo inicie sesión y vea su portafolio lleno
-- (y NO se le muestre el modo guía).
-- ============================================================

do $$
declare
  v_profile  uuid;
  v_challenge uuid;
  v_team     uuid;
begin
  -- >>> CAMBIA ESTE EMAIL por el del usuario demo <<<
  select id into v_profile
  from auth.users
  where email = 'CAMBIA_ESTE_EMAIL@ejemplo.com';

  if v_profile is null then
    raise exception 'No existe ese usuario. Crea el usuario demo entrando a la app primero.';
  end if;

  select id into v_challenge
  from public.challenges
  where titulo = 'Congestión en paraderos'
  limit 1;

  insert into public.teams (challenge_id, nombre, creado_por, estado, repo_url)
  values (v_challenge, 'Equipo Veyro', v_profile, 'completado',
          'https://github.com/usuario/veyro')
  returning id into v_team;

  insert into public.team_members (team_id, profile_id, rol)
  values (v_team, v_profile, 'líder');

  insert into public.tasks (team_id, titulo, estado, responsable) values
    (v_team, 'Investigar el problema de movilidad', 'hecho', v_profile),
    (v_team, 'Diseñar pantallas en Figma',          'hecho', v_profile),
    (v_team, 'Construir prototipo navegable',        'hecho', v_profile);

  insert into public.badges (profile_id, nombre, challenge_id)
  values (v_profile, 'Reto completado: Movilidad', v_challenge);

  update public.profiles set guia_vista = true where id = v_profile;
end $$;
