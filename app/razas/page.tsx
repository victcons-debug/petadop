import Image from "next/image";
import type { RazaPerro } from "@/lib/types";

// Consumo de API externa pública (Dog CEO API) desde un Server Component,
// aplicando fetch + async/await, tal como en el Catálogo Dinámico de Jugadores del primer parcial.
async function obtenerRazasAleatorias(): Promise<RazaPerro[]> {
  const respuesta = await fetch("https://dog.ceo/api/breeds/image/random/9", {
    // Evita cachear indefinidamente una lista que queremos que cambie
    next: { revalidate: 60 },
  });

  if (!respuesta.ok) {
    throw new Error(`La API de razas respondió con estado ${respuesta.status}`);
  }

  const data = await respuesta.json();

  const imagenes: string[] = data.message ?? [];

  return imagenes.map((url) => {
    // La URL trae la raza embebida, ej: .../breeds/hound-afghan/n123.jpg
    const partes = url.split("/breeds/")[1]?.split("/")[0] ?? "desconocida";
    const raza = partes.split("-").reverse().join(" ");
    return { raza, imagen: url };
  });
}

export default async function RazasPage() {
  let razas: RazaPerro[] = [];
  let huboError = false;

  try {
    razas = await obtenerRazasAleatorias();
  } catch (e) {
    // Manejo básico de errores si la API externa no responde o tarda demasiado
    huboError = true;
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Inspírate: razas de perros</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Datos en vivo desde la API pública{" "}
        <a
          href="https://dog.ceo/dog-api/"
          target="_blank"
          className="text-brand-600 hover:underline"
        >
          Dog CEO
        </a>{" "}
        — útil como referencia si estás pensando en qué tipo de perro adoptar.
      </p>

      {huboError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          No se pudo conectar con la API de razas en este momento. Intenta recargar la página.
        </p>
      )}

      {!huboError && razas.length === 0 && (
        <p className="text-sm text-neutral-500">Cargando razas...</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {razas.map((r, i) => (
          <div key={i} className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="relative h-40 w-full">
              <Image src={r.imagen} alt={r.raza} fill className="object-cover" />
            </div>
            <p className="p-2 text-center text-sm capitalize">{r.raza}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
