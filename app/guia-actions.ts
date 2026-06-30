"use server";

import { createClient } from "@/lib/supabase/server";

export async function marcarGuiaVista() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update({ guia_vista: true }).eq("id", user.id);
}
