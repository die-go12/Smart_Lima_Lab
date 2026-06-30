-- Parche v2b: aceptar postulantes (insert por dueño) + logros parametrizados.
-- Pegar en Supabase -> SQL Editor -> Run.

-- El dueño del proyecto puede agregar miembros (al aceptar una postulación)
drop policy if exists "tm_insert_owner" on public.team_members;
create policy "tm_insert_owner" on public.team_members for insert with check (
  exists (select 1 from public.teams t where t.id = team_members.team_id and t.creado_por = auth.uid())
);

-- Logros parametrizados (para otorgar al proponente cuando un mentor aprueba)
create or replace function public.evaluar_logros_de(p_uid uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_completados int; v_categorias int; v_creados int; v_mentorias int; v_propuestas int;
begin
  if p_uid is null then return; end if;
  select count(*) into v_completados from public.team_members tm join public.teams t on t.id=tm.team_id where tm.profile_id=p_uid and t.estado='completado';
  select count(distinct c.categoria) into v_categorias from public.team_members tm join public.teams t on t.id=tm.team_id join public.challenges c on c.id=t.challenge_id where tm.profile_id=p_uid and t.estado='completado';
  select count(*) into v_creados from public.teams t where t.creado_por=p_uid;
  select count(*) into v_mentorias from public.challenges c where c.aprobado_por=p_uid;
  select count(*) into v_propuestas from public.challenges c where c.propuesto_por=p_uid and c.estado_revision='aprobado';
  if v_completados>=1 then perform public._dar(p_uid,'constructor'); end if;
  if v_completados>=3 then perform public._dar(p_uid,'veterano'); end if;
  if v_categorias>=2 then perform public._dar(p_uid,'todoterreno'); end if;
  if v_creados>=1 then perform public._dar(p_uid,'capitan'); end if;
  if v_propuestas>=1 then perform public._dar(p_uid,'visionario'); end if;
  if v_mentorias>=1 then perform public._dar(p_uid,'mentoria'); end if;
  if v_mentorias>=3 then perform public._dar(p_uid,'lider'); end if;
  if v_completados>=2 then
    update public.profiles set rol='mentor' where id=p_uid and rol<>'mentor';
    perform public._dar(p_uid,'mentor_novato');
  end if;
end; $$;

create or replace function public.evaluar_logros()
returns void language plpgsql security definer set search_path=public as $$
begin perform public.evaluar_logros_de(auth.uid()); end; $$;

grant execute on function public.evaluar_logros_de(uuid) to authenticated;
grant execute on function public.evaluar_logros() to authenticated;
