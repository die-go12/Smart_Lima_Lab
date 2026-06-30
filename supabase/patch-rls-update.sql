-- Parche de seguridad (M1): agrega WITH CHECK a las políticas de UPDATE.
-- Pegar en Supabase -> SQL Editor -> Run. Reemplaza las políticas existentes.

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "teams_update_members" on public.teams;
create policy "teams_update_members" on public.teams
  for update
  using (
    exists (select 1 from public.team_members m
            where m.team_id = teams.id and m.profile_id = auth.uid())
  )
  with check (
    exists (select 1 from public.team_members m
            where m.team_id = teams.id and m.profile_id = auth.uid())
  );

drop policy if exists "tasks_update_members" on public.tasks;
create policy "tasks_update_members" on public.tasks
  for update
  using (
    exists (select 1 from public.team_members m
            where m.team_id = tasks.team_id and m.profile_id = auth.uid())
  )
  with check (
    exists (select 1 from public.team_members m
            where m.team_id = tasks.team_id and m.profile_id = auth.uid())
  );
