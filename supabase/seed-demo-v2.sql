-- ============================================================
-- Datos demo v2 — para mostrar el ciclo completo en la presentación.
-- Ejecutar DESPUÉS de migration-v2.sql y patch-v2b.sql, y de haber
-- entrado al menos una vez con tu usuario (para que exista tu perfil).
-- Reemplaza el email por el tuyo y dale Run.
-- ============================================================
do $$
declare
  v_uid uuid;
  v_team uuid;
begin
  select id into v_uid from auth.users where email = 'CAMBIA_TU_EMAIL@ejemplo.com';
  if v_uid is null then
    raise exception 'No existe ese usuario. Entra una vez a la app y reintenta.';
  end if;

  -- Te marcamos como mentor (para mostrar la vista de Revisión)
  update public.profiles set rol = 'mentor' where id = v_uid;

  -- Una propuesta de reto PENDIENTE (para aprobarla en vivo en /revision)
  insert into public.challenges
    (titulo, categoria, descripcion, propuesto_por, estado_revision, estado, habilidades)
  values
    ('Turnos en comedores universitarios', 'Movilidad',
     'Reducir colas mostrando el aforo en tiempo real de los comedores del campus.',
     v_uid, 'pendiente', 'abierto', '{}');

  -- Un proyecto con CONVOCATORIA ABIERTA e interdisciplinario (para /convocatorias)
  insert into public.teams
    (challenge_id, nombre, titulo, descripcion, creado_por, estado, visibilidad,
     repo_publico, interdisciplinario, convocatoria_abierta, especialidades_busca, origen)
  values
    (null, 'Sensor de calidad de aire', 'Sensor de calidad de aire',
     'Prototipo IoT que mide la calidad del aire en el campus y publica datos abiertos.',
     v_uid, 'en_progreso', 'publico', true, true, true,
     'Medicina, Ingeniería Ambiental', 'proyecto_libre')
  returning id into v_team;

  insert into public.team_members (team_id, profile_id, rol) values (v_team, v_uid, 'líder');
end $$;
