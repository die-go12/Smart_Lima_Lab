import { createClient } from "@/lib/supabase/server";
import type {
  Challenge,
  Team,
  Task,
  Badge,
  Profile,
  TeamMember,
  BadgeDef,
  Aplicacion,
} from "@/lib/types";

// ---- Retos ----
export async function getChallenges(): Promise<Challenge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("estado_revision", "aprobado")
    .order("creado_en", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Challenge[];
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("challenges").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Challenge) ?? null;
}

export async function getPendingChallenges(): Promise<Challenge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("estado_revision", "pendiente")
    .order("creado_en", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Challenge[];
}

// ---- Equipos / proyectos ----
export async function getTeamsByChallenge(challengeId: string): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("challenge_id", challengeId)
    .order("creado_en", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Team[];
}

export async function getTeamById(id: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("teams").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Team) ?? null;
}

export async function getProyectos(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .is("challenge_id", null)
    .order("creado_en", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Team[];
}

export async function getConvocatorias(): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("convocatoria_abierta", true)
    .order("creado_en", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Team[];
}

// ---- Tareas ----
export async function getTasksByTeam(teamId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("team_id", teamId)
    .order("creado_en", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Task[];
}

// ---- Miembros / aplicaciones ----
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, team_id, profile_id, rol, profiles(nombre, github_username, avatar_url)")
    .eq("team_id", teamId);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TeamMember[];
}

export async function getTeamsByProfile(profileId: string): Promise<Team[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("teams(*)")
    .eq("profile_id", profileId);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as unknown as { teams: Team | null }[];
  return rows.map((r) => r.teams).filter(Boolean) as Team[];
}

export async function getAplicaciones(teamId: string): Promise<Aplicacion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("aplicaciones")
    .select("id, team_id, profile_id, mensaje, estado, creado_en, profiles(nombre, github_username, avatar_url, especialidad)")
    .eq("team_id", teamId)
    .order("creado_en", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Aplicacion[];
}

// ---- Perfil ----
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile) ?? null;
}

// ---- Insignias ----
export async function getBadgesByProfile(profileId: string): Promise<Badge[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .eq("profile_id", profileId)
    .order("fecha", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Badge[];
}

export async function getBadgeDefs(): Promise<BadgeDef[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("badge_defs")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as BadgeDef[];
}

export async function getMentores(): Promise<Profile[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("rol", "mentor")
    .order("nombre", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Profile[];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  return (data as Profile) ?? null;
}
