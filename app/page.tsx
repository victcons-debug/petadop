import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <h1 className="text-4xl font-bold">
        Encuentra a tu próximo <span className="text-brand-600">mejor amigo</span>
      </h1>
      <p className="max-w-xl text-neutral-600">
        PetAdopt conecta refugios de animales con familias que quieren adoptar.
        Explora mascotas disponibles o publica las tuyas si representas a un refugio.
      </p>
      <div className="flex gap-3">
        <Link
          href="/mascotas"
          className="rounded-md bg-brand-600 px-5 py-2.5 text-white hover:bg-brand-700"
        >
          Ver mascotas disponibles
        </Link>
        <Link
          href="/register"
          className="rounded-md border px-5 py-2.5 hover:bg-neutral-100"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}
