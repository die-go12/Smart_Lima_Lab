"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function proponerReto(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "").trim().slice(0, 120);
  const categoria = String(formData.get("categoria") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim().slice(0, 600) || null;
  if (!titulo || !categoria) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("challenges").insert({
    titulo,
    categoria,
    descripcion,
    propuesto_por: user.id,
    estado_revision: "pendiente",
    estado: "abierto",
    habilidades: [],
  });

  redirect("/retos");
}
