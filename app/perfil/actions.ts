"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function cerrarSesion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function actualizarPerfil(formData: FormData) {
  const nombre = String(formData.get("nombre") ?? "").trim().slice(0, 80);
  const carrera = String(formData.get("carrera") ?? "").trim().slice(0, 80) || null;
  const cicloRaw = String(formData.get("ciclo") ?? "").trim();
  const cicloNum = cicloRaw ? parseInt(cicloRaw, 10) : NaN;
  const ciclo = Number.isFinite(cicloNum) ? Math.max(1, Math.min(20, cicloNum)) : null;
  const especialidad = String(formData.get("especialidad") ?? "").trim().slice(0, 60) || null;
  const bio = String(formData.get("bio") ?? "").trim().slice(0, 300) || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ nombre: nombre || null, carrera, ciclo, especialidad, bio })
    .eq("id", user.id);

  redirect("/perfil");
}
