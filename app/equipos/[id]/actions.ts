"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const siguiente = {
  pendiente: "en_progreso",
  en_progreso: "hecho",
  hecho: "pendiente",
} as const;

export async function cambiarEstadoTarea(formData: FormData) {
  const taskId = String(formData.get("task_id") ?? "");
  const teamId = String(formData.get("team_id") ?? "");
  const actual = String(formData.get("estado") ?? "");
  if (!taskId || !(actual in siguiente)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const proximo = siguiente[actual as keyof typeof siguiente];
  await supabase.from("tasks").update({ estado: proximo }).eq("id", taskId);
  revalidatePath(`/equipos/${teamId}`);
}

export async function agregarTarea(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 120);
  if (!teamId || !titulo) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("tasks").insert({ team_id: teamId, titulo, responsable: user.id });
  revalidatePath(`/equipos/${teamId}`);
}

export async function completarReto(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  if (!teamId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("teams").update({ estado: "completado" }).eq("id", teamId);
  // Otorga insignias y promueve a mentor si corresponde (lógica segura en la BD).
  await supabase.rpc("evaluar_logros");

  revalidatePath(`/equipos/${teamId}`);
  revalidatePath("/perfil");
}

export async function postular(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  const mensaje = String(formData.get("mensaje") ?? "").trim().slice(0, 300) || null;
  if (!teamId) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("aplicaciones").insert({ team_id: teamId, profile_id: user.id, mensaje });
  revalidatePath(`/equipos/${teamId}`);
}

export async function aceptarPostulante(formData: FormData) {
  const aplicacionId = String(formData.get("aplicacion_id") ?? "");
  const teamId = String(formData.get("team_id") ?? "");
  const profileId = String(formData.get("profile_id") ?? "");
  if (!aplicacionId || !teamId || !profileId) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("aplicaciones").update({ estado: "aceptada" }).eq("id", aplicacionId);
  await supabase.from("team_members").insert({ team_id: teamId, profile_id: profileId });
  revalidatePath(`/equipos/${teamId}`);
}

export async function rechazarPostulante(formData: FormData) {
  const aplicacionId = String(formData.get("aplicacion_id") ?? "");
  const teamId = String(formData.get("team_id") ?? "");
  if (!aplicacionId) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("aplicaciones").update({ estado: "rechazada" }).eq("id", aplicacionId);
  revalidatePath(`/equipos/${teamId}`);
}

export async function asignarMentor(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  const mentorId = String(formData.get("mentor_id") ?? "") || null;
  if (!teamId) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("teams").update({ mentor_id: mentorId }).eq("id", teamId);
  revalidatePath(`/equipos/${teamId}`);
}

export async function guardarConvocatoria(formData: FormData) {
  const teamId = String(formData.get("team_id") ?? "");
  const abierta = formData.get("convocatoria_abierta") === "on";
  const especialidades = String(formData.get("especialidades_busca") ?? "").trim().slice(0, 200) || null;
  if (!teamId) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase
    .from("teams")
    .update({ convocatoria_abierta: abierta, especialidades_busca: especialidades })
    .eq("id", teamId);
  revalidatePath(`/equipos/${teamId}`);
}
