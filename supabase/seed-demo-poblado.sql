-- ============================================================
-- Datos demo POBLADOS: equipo lleno + equipo con plaza abierta.
-- Requisitos: crea antes en Supabase -> Authentication -> Add user
-- (Auto Confirm) las cuentas: ana@demo.com, luis@demo.com,
-- sofia@demo.com, carlos@demo.com. Tu cuenta diegolv1205 = mentor.
-- Reemplaza el email de diego si hace falta. Luego Run.
-- ============================================================
do $$
declare
  v_diego uuid; v_ana uuid; v_luis uuid; v_sofia uuid; v_carlos uuid;
  v_a uuid; v_b uuid;
begin
  select id into v_diego  from auth.users where email = 'diegolv1205@gmail.com';
  select id into v_ana    from auth.users where email = 'ana@demo.com';
  select id into v_luis   from auth.users where email = 'luis@demo.com';
  select id into v_sofia  from auth.users where email = 'sofia@demo.com';
  select id into v_carlos from auth.users where email = 'carlos@demo.com';

  if v_ana is null or v_luis is null or v_sofia is null or v_carlos is null then
    raise exception 'Faltan cuentas demo. Crea ana/luis/sofia/carlos en Authentication -> Add user.';
  end if;

  -- Perfiles con nombre + especialidad (para que el CV se vea)
  update public.profiles set nombre='Diego Loayza', especialidad='Ingeniería Informática', rol='mentor' where id=v_diego;
  update public.profiles set nombre='Ana Quispe',   especialidad='Medicina'                where id=v_ana;
  update public.profiles set nombre='Luis Ramírez', especialidad='Ingeniería Informática'  where id=v_luis;
  update public.profiles set nombre='Sofía Torres', especialidad='Diseño'                  where id=v_sofia;
  update public.profiles set nombre='Carlos Ríos',  especialidad='Ingeniería Ambiental'    where id=v_carlos;

  -- Idempotencia: borra estos dos proyectos demo si ya existían
  delete from public.teams where titulo in ('Ruta Segura Lima','Aire Limpio Campus');

  -- ===== Equipo A: LLENO (convocatoria cerrada) con mentor =====
  insert into public.teams (challenge_id, nombre, titulo, descripcion, creado_por, estado,
    visibilidad, repo_publico, interdisciplinario, convocatoria_abierta, especialidades_busca, origen, mentor_id)
  values (null,'Ruta Segura Lima','Ruta Segura Lima',
    'App que sugiere rutas peatonales más seguras según incidentes recientes.',
    v_luis,'en_progreso','publico',true,false,false,null,'proyecto_libre', v_diego)
  returning id into v_a;
  insert into public.team_members (team_id, profile_id, rol) values
    (v_a, v_luis, 'líder'), (v_a, v_ana, 'miembro'), (v_a, v_sofia, 'miembro');
  insert into public.tasks (team_id, titulo, estado, responsable) values
    (v_a,'Definir alcance', 'hecho', v_luis),
    (v_a,'Diseñar pantallas', 'en_progreso', v_sofia),
    (v_a,'Conectar datos de incidentes', 'pendiente', v_luis);

  -- ===== Equipo B: PLAZA ABIERTA + postulaciones =====
  insert into public.teams (challenge_id, nombre, titulo, descripcion, creado_por, estado,
    visibilidad, repo_publico, interdisciplinario, convocatoria_abierta, especialidades_busca, origen, mentor_id)
  values (null,'Aire Limpio Campus','Aire Limpio Campus',
    'Sensores IoT que miden la calidad del aire en el campus y publican datos abiertos.',
    v_carlos,'en_progreso','publico',true,true,true,'Informática, Diseño','proyecto_libre', v_diego)
  returning id into v_b;
  insert into public.team_members (team_id, profile_id, rol) values
    (v_b, v_carlos, 'líder'), (v_b, v_ana, 'miembro');
  insert into public.aplicaciones (team_id, profile_id, mensaje, estado) values
    (v_b, v_luis,  'Puedo encargarme del backend y la ingesta de datos.', 'pendiente'),
    (v_b, v_sofia, 'Me gustaría diseñar el dashboard de visualización.',  'pendiente');
end $$;
