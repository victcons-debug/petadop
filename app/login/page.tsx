import Link from "next/link";
import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>

      {searchParams.error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {searchParams.error}
        </p>
      )}

      <form action={login} className="flex flex-col gap-3">
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
          placeholder="Contraseña"
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
        >
          Entrar
        </button>
      </form>

      <p className="mt-4 text-sm text-neutral-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-brand-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
