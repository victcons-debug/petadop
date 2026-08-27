"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function actualizarMascota(mascotaId: string, formData: FormData) {
  const supabase = createClient();

  const nombre = formData.get("nombre") as string;
  const especie = formData.get("especie") as string;
  const raza = formData.get("raza") as string;
  const edad_meses = formData.get("edad_meses") as string;
  const descripcion = formData.get("descripcion") as string;
  const imagen_url = formData.get("imagen_url") as string;
  const estado = formData.get("estado") as string;

  // RLS en Supabase garantiza que solo el refugio dueño pueda actualizar este registro.
  const { error } = await supabase
    .from("mascotas")
    .update({
      nombre,
      especie,
      raza: raza || null,
      edad_meses: edad_meses ? Number(edad_meses) : null,
      descripcion,
      imagen_url: imagen_url || null,
      estado,
    })
    .eq("id", mascotaId);

  if (error) {
    redirect(`/dashboard/mascotas/${mascotaId}/editar?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function eliminarMascota(mascotaId: string) {
  const supabase = createClient();

  // RLS garantiza que solo el dueño pueda eliminarla.
  await supabase.from("mascotas").delete().eq("id", mascotaId);

  redirect("/dashboard");
}
