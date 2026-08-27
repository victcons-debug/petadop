import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Mascota, Perfil, SolicitudAdopcion } from "@/lib/types";
import { actualizarEstadoSolicitud } from "./actions";

// Tipo de la solicitud con los datos relacionados que trae el join de Supabase
interface SolicitudConRelaciones extends SolicitudAdopcion {
  mascotas: { nombre: string } | null;
  perfiles: { nombre: string } | null;
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null; // el middleware ya protege esta ruta

  const { data: perfilData } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const perfil = perfilData as Perfil;

  if (perfil.rol === "refugio") {
    const { data: misMascotas } = await supabase
      .from("mascotas")
      .select("*")
      .eq("refugio_id", user.id)
      .order("created_at", { ascending: false });

    const { data: solicitudes } = await supabase
      .from("solicitudes_adopcion")
      .select("*, mascotas(nombre), perfiles!solicitudes_adopcion_adoptante_id_fkey(nombre)")
      .in(
        "mascota_id",
        ((misMascotas as Mascota[]) ?? []).map((m) => m.id)
      )
      .order("created_at", { ascending: false });

    return (
      <div className="flex flex-col gap-10">
        <section>
          <h2 className="mb-3 font-semibold">Mis mascotas publicadas</h2>
          {(!misMascotas || misMascotas.length === 0) && (
            <p className="text-sm text-neutral-500">Aún no has publicado ninguna mascota.</p>
          )}
          <div className="flex flex-col gap-2">
            {(misMascotas as Mascota[] | null)?.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{m.nombre}</p>
                  <p className="text-xs text-neutral-500">{m.estado}</p>
                </div>
                <Link
                  href={`/dashboard/mascotas/${m.id}/editar`}
                  className="text-sm text-brand-600 hover:underline"
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Solicitudes de adopción recibidas</h2>
          {(!solicitudes || solicitudes.length === 0) && (
            <p className="text-sm text-neutral-500">No has recibido solicitudes todavía.</p>
          )}
          <div className="flex flex-col gap-2">
            {(solicitudes as SolicitudConRelaciones[] | null)?.map((s) => (
              <div key={s.id} className="rounded-md border p-3 text-sm">
                <p>
                  <span className="font-medium">{s.perfiles?.nombre}</span> quiere adoptar a{" "}
                  <span className="font-medium">{s.mascotas?.nombre}</span>
                </p>
                <p className="mt-1 text-neutral-600">{s.mensaje}</p>
                <p className="mt-1 text-xs text-neutral-400">Estado: {s.estado}</p>
                {s.estado === "pendiente" && (
                  <form action={actualizarEstadoSolicitud} className="mt-2 flex gap-2">
                    <input type="hidden" name="solicitudId" value={s.id} />
                    <button
                      name="estado"
                      value="aceptada"
                      className="rounded-md bg-green-600 px-3 py-1 text-white"
                    >
                      Aceptar
                    </button>
                    <button
                      name="estado"
                      value="rechazada"
                      className="rounded-md bg-red-600 px-3 py-1 text-white"
                    >
                      Rechazar
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Rol adoptante: ve sus propias solicitudes
  const { data: misSolicitudes } = await supabase
    .from("solicitudes_adopcion")
    .select("*, mascotas(nombre)")
    .eq("adoptante_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section>
      <h2 className="mb-3 font-semibold">Mis solicitudes de adopción</h2>
      {(!misSolicitudes || misSolicitudes.length === 0) && (
        <p className="text-sm text-neutral-500">
          Todavía no has solicitado adoptar ninguna mascota.{" "}
          <Link href="/mascotas" className="text-brand-600 hover:underline">
            Explora el listado
          </Link>
          .
        </p>
      )}
      <div className="flex flex-col gap-2">
        {(misSolicitudes as (SolicitudAdopcion & { mascotas: { nombre: string } })[] | null)?.map(
          (s) => (
            <div key={s.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{s.mascotas?.nombre}</p>
              <p className="text-neutral-600">{s.mensaje}</p>
              <p className="mt-1 text-xs text-neutral-400">Estado: {s.estado}</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
