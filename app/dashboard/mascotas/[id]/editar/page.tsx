import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Mascota } from "@/lib/types";
import { actualizarMascota, eliminarMascota } from "../actions";

export default async function EditarMascotaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const supabase = createClient();
  const { data: mascota } = await supabase
    .from("mascotas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!mascota) notFound();
  const m = mascota as Mascota;

  const actualizarConId = actualizarMascota.bind(null, m.id);
  const eliminarConId = eliminarMascota.bind(null, m.id);

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-bold">Editar {m.nombre}</h1>

      {searchParams.error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={actualizarConId} className="flex flex-col gap-3">
        <input name="nombre" defaultValue={m.nombre} required className="rounded-md border px-3 py-2 text-sm" />

        <select name="especie" defaultValue={m.especie} required className="rounded-md border px-3 py-2 text-sm">
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        <input name="raza" defaultValue={m.raza ?? ""} className="rounded-md border px-3 py-2 text-sm" />
        <input
          name="edad_meses"
          type="number"
          min={0}
          defaultValue={m.edad_meses ?? ""}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <textarea
          name="descripcion"
          defaultValue={m.descripcion}
          required
          rows={4}
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input name="imagen_url" defaultValue={m.imagen_url ?? ""} className="rounded-md border px-3 py-2 text-sm" />

        <select name="estado" defaultValue={m.estado} className="rounded-md border px-3 py-2 text-sm">
          <option value="disponible">Disponible</option>
          <option value="en_proceso">En proceso</option>
          <option value="adoptado">Adoptado</option>
        </select>

        <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
          Guardar cambios
        </button>
      </form>

      <form action={eliminarConId} className="mt-3">
        <button type="submit" className="text-sm text-red-600 hover:underline">
          Eliminar mascota
        </button>
      </form>
    </div>
  );
}
