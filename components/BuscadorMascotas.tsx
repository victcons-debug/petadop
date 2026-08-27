"use client";

import { useMemo, useState } from "react";
import MascotaCard from "./MascotaCard";
import type { Mascota } from "@/lib/types";

interface BuscadorMascotasProps {
  mascotas: Mascota[];
}

export default function BuscadorMascotas({ mascotas }: BuscadorMascotasProps) {
  const [texto, setTexto] = useState("");
  const [especie, setEspecie] = useState<"todas" | Mascota["especie"]>("todas");

  const resultado = useMemo(() => {
    return mascotas.filter((m) => {
      const coincideTexto =
        m.nombre.toLowerCase().includes(texto.toLowerCase()) ||
        (m.raza ?? "").toLowerCase().includes(texto.toLowerCase());
      const coincideEspecie = especie === "todas" || m.especie === especie;
      return coincideTexto && coincideEspecie;
    });
  }, [mascotas, texto, especie]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Buscar por nombre o raza..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <select
          value={especie}
          onChange={(e) => setEspecie(e.target.value as "todas" | Mascota["especie"])}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="todas">Todas las especies</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
          <option value="otro">Otros</option>
        </select>
      </div>

      {resultado.length === 0 ? (
        <p className="text-sm text-neutral-500">No se encontraron mascotas con ese filtro.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {resultado.map((m) => (
            <MascotaCard key={m.id} mascota={m} />
          ))}
        </div>
      )}
    </div>
  );
}
