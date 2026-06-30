"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearEquipo(formData: FormData) {
  const challengeId = String(formData.get("challenge_id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim().slice(0, 80);
  let repoUrl: string | null = String(formData.get("repo_url") ?? "").trim() || null;
  if (repoUrl && !/^https:\/\//i.test(repoUrl)) repoUrl = null;

  if (!challengeId || !nombre) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: team, error } = await supabase
    .from("teams")
    .insert({ challenge_id: challengeId, nombre, creado_por: user.id, repo_url: repoUrl })
    .select("id")
    .single();

  if (error || !team) throw new Error("No se pudo crear el equipo. Intenta de nuevo.");

  await supabase.from("team_members").insert({
    team_id: team.id,
    profile_id: user.id,
    rol: "líder",
  });

  redirect(`/equipos/${team.id}`);
}

export async function unirseEquipo(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  if (!teamId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("team_members").insert({ team_id: teamId, profile_id: user.id });

  redirect(`/equipos/${teamId}`);
}
