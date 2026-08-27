import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nombre: string | null = null;
  if (user) {
    const { data: perfil } = await supabase
      .from("perfiles")
      .select("nombre")
      .eq("id", user.id)
      .single();
    nombre = perfil?.nombre ?? null;
  }

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-600">
          🐾 PetAdopt
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/mascotas" className="hover:text-brand-600">Mascotas</Link>
          <Link href="/razas" className="hover:text-brand-600">Razas</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-brand-600">
                Hola, {nombre ?? "usuario"}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-brand-600">Iniciar sesión</Link>
              <Link
                href="/register"
                className="rounded-md bg-brand-600 px-3 py-1.5 text-white hover:bg-brand-700"
              >
                Registrarme
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
