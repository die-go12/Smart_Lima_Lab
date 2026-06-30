"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearProyecto(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 100);
  const descripcion = String(formData.get("descripcion") ?? "").trim().slice(0, 500) || null;
  let repoUrl: string | null = String(formData.get("repo_url") ?? "").trim() || null;
  if (repoUrl && !/^https:\/\//i.test(repoUrl)) repoUrl = null;
  const repoPublico = formData.get("repo_publico") === "on";
  const visibilidad = formData.get("visibilidad") === "privado" ? "privado" : "publico";
  const interdisciplinario = formData.get("interdisciplinario") === "on";
  const convocatoria = formData.get("convocatoria") === "on";
  const especialidades = String(formData.get("especialidades_busca") ?? "").trim().slice(0, 200) || null;
  const origen = formData.get("origen") === "proyecto_curso" ? "proyecto_curso" : "proyecto_libre";

  if (!titulo) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: team, error } = await supabase
    .from("teams")
    .insert({
      challenge_id: null,
      nombre: titulo,
      titulo,
      descripcion,
      creado_por: user.id,
      repo_url: repoUrl,
      repo_publico: repoPublico,
      visibilidad,
      interdisciplinario,
      convocatoria_abierta: convocatoria,
      especialidades_busca: especialidades,
      origen,
    })
    .select("id")
    .single();

  if (error || !team) throw new Error("No se pudo crear el proyecto. Intenta de nuevo.");

  await supabase.from("team_members").insert({ team_id: team.id, profile_id: user.id, rol: "líder" });
  await supabase.rpc("evaluar_logros");

  redirect(`/equipos/${team.id}`);
}
