"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function solicitarAdopcion(mascotaId: string, formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para solicitar una adopción." };
  }

  const mensaje = formData.get("mensaje") as string;

  const { error } = await supabase.from("solicitudes_adopcion").insert({
    mascota_id: mascotaId,
    adoptante_id: user.id,
    mensaje,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/mascotas/${mascotaId}`);
  return { success: true };
}
