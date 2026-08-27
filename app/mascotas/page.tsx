import { createClient } from "@/lib/supabase/server";
import BuscadorMascotas from "@/components/BuscadorMascotas";
import type { Mascota } from "@/lib/types";

export const revalidate = 0;

export default async function MascotasPage() {
  const supabase = createClient();
  const { data: mascotas, error } = await supabase
    .from("mascotas")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Mascotas en adopción</h1>

      {error && (
        <p className="text-sm text-red-600">
          No se pudieron cargar las mascotas en este momento.
        </p>
      )}

      <BuscadorMascotas mascotas={(mascotas as Mascota[]) ?? []} />
    </div>
  );
}
