"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={cerrarSesion}
      className="rounded-md border px-3 py-1.5 hover:bg-neutral-100"
    >
      Cerrar sesión
    </button>
  );
}
