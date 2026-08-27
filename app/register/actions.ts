"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function register(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nombre = formData.get("nombre") as string;
  const rol = formData.get("rol") as string; // 'adoptante' | 'refugio'

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, rol }, // el trigger de la BD usa esto para crear el perfil
    },
  });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login");
}
