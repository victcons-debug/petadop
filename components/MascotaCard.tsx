import Link from "next/link";
import Image from "next/image";
import type { Mascota } from "@/lib/types";

interface MascotaCardProps {
  mascota: Mascota;
}

const ESTADO_LABEL: Record<Mascota["estado"], string> = {
  disponible: "Disponible",
  en_proceso: "En proceso",
  adoptado: "Adoptado",
};

export default function MascotaCard({ mascota }: MascotaCardProps) {
  return (
    <Link
      href={`/mascotas/${mascota.id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-48 w-full bg-neutral-200">
        {mascota.imagen_url ? (
          <Image
            src={mascota.imagen_url}
            alt={mascota.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{mascota.nombre}</h3>
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
            {ESTADO_LABEL[mascota.estado]}
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          {mascota.especie} {mascota.raza ? `· ${mascota.raza}` : ""}
        </p>
      </div>
    </Link>
  );
}
