import { register } from "./actions";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Crear cuenta</h1>

      {searchParams.error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={register} className="flex flex-col gap-3">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo o del refugio"
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          required
          minLength={6}
          className="rounded-md border px-3 py-2 text-sm"
        />

        <fieldset className="rounded-md border p-3 text-sm">
          <legend className="px-1 font-medium">Tipo de cuenta</legend>
          <label className="flex items-center gap-2 py-1">
            <input type="radio" name="rol" value="adoptante" defaultChecked />
            Adoptante — quiero encontrar una mascota
          </label>
          <label className="flex items-center gap-2 py-1">
            <input type="radio" name="rol" value="refugio" />
            Refugio — quiero publicar mascotas en adopción
          </label>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
        >
          Registrarme
        </button>
      </form>
    </div>
  );
}
