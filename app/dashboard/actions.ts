"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function actualizarEstadoSolicitud(formData: FormData) {
  const supabase = createClient();

  const solicitudId = formData.get("solicitudId") as string;
  const estado = formData.get("estado") as string; // 'aceptada' | 'rechazada'

  await supabase
    .from("solicitudes_adopcion")
    .update({ estado })
    .eq("id", solicitudId);

  revalidatePath("/dashboard");
}
