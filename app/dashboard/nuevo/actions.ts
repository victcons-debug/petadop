"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearMascota(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const nombre = formData.get("nombre") as string;
  const especie = formData.get("especie") as string;
  const raza = formData.get("raza") as string;
  const edad_meses = formData.get("edad_meses") as string;
  const descripcion = formData.get("descripcion") as string;
  const imagen_url = formData.get("imagen_url") as string;

  const { error } = await supabase.from("mascotas").insert({
    refugio_id: user.id,
    nombre,
    especie,
    raza: raza || null,
    edad_meses: edad_meses ? Number(edad_meses) : null,
    descripcion,
    imagen_url: imagen_url || null,
  });

  if (error) {
    redirect(`/dashboard/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
