import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SolicitarAdopcion from "./SolicitarAdopcion";
import type { Mascota } from "@/lib/types";

export default async function DetalleMascotaPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: mascota } = await supabase
    .from("mascotas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!mascota) notFound();

  const m = mascota as Mascota;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: refugio } = await supabase
    .from("perfiles")
    .select("nombre")
    .eq("id", m.refugio_id)
    .single();

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="relative h-80 w-full overflow-hidden rounded-xl bg-neutral-200">
        {m.imagen_url ? (
          <Image src={m.imagen_url} alt={m.nombre} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            Sin imagen
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold">{m.nombre}</h1>
        <p className="mt-1 text-neutral-500">
          {m.especie} {m.raza ? `· ${m.raza}` : ""}{" "}
          {m.edad_meses ? `· ${m.edad_meses} meses` : ""}
        </p>
        <p className="mt-1 text-sm text-neutral-400">Publicado por {refugio?.nombre ?? "un refugio"}</p>

        <p className="mt-4 whitespace-pre-line">{m.descripcion}</p>

        <div className="mt-6">
          <h2 className="mb-2 font-semibold">¿Te gustaría adoptarlo?</h2>
          <SolicitarAdopcion mascotaId={m.id} haySesion={!!user} />
        </div>
      </div>
    </div>
  );
}
