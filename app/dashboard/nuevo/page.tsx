import { crearMascota } from "./actions";

export default function NuevaMascotaPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-bold">Publicar una mascota en adopción</h1>

      {searchParams.error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={crearMascota} className="flex flex-col gap-3">
        <input name="nombre" placeholder="Nombre" required className="rounded-md border px-3 py-2 text-sm" />

        <select name="especie" required className="rounded-md border px-3 py-2 text-sm">
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
        </select>

        <input name="raza" placeholder="Raza (opcional)" className="rounded-md border px-3 py-2 text-sm" />
        <input
          name="edad_meses"
          type="number"
          min={0}
          placeholder="Edad en meses (opcional)"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <textarea
          name="descripcion"
          required
          rows={4}
          placeholder="Describe su personalidad, salud, etc."
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          name="imagen_url"
          placeholder="URL de una imagen (opcional)"
          className="rounded-md border px-3 py-2 text-sm"
        />

        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
        >
          Publicar
        </button>
      </form>
    </div>
  );
}
