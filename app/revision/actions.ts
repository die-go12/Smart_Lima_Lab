"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function aprobarReto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const guia = String(formData.get("guia_tecnica") ?? "").trim().slice(0, 1000) || null;
  const dificultad = String(formData.get("dificultad") ?? "").trim() || null;
  const habilidadesRaw = String(formData.get("habilidades") ?? "").trim();
  const habilidades = habilidadesRaw
    ? habilidadesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: ch } = await supabase
    .from("challenges")
    .update({
      estado_revision: "aprobado",
      guia_tecnica: guia,
      dificultad,
      habilidades,
      aprobado_por: user.id,
    })
    .eq("id", id)
    .select("propuesto_por")
    .single();

  await supabase.rpc("evaluar_logros");
  if (ch?.propuesto_por) {
    await supabase.rpc("evaluar_logros_de", { p_uid: ch.propuesto_por });
  }
  revalidatePath("/revision");
}

export async function rechazarReto(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("challenges").update({ estado_revision: "rechazado", aprobado_por: user.id }).eq("id", id);
  revalidatePath("/revision");
}
