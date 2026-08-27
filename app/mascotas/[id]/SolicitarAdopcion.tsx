"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { solicitarAdopcion } from "./actions";

interface SolicitarAdopcionProps {
  mascotaId: string;
  haySesion: boolean;
}

export default function SolicitarAdopcion({ mascotaId, haySesion }: SolicitarAdopcionProps) {
  const [isPending, startTransition] = useTransition();
  const [resultado, setResultado] = useState<{ error?: string; success?: boolean } | null>(null);

  if (!haySesion) {
    return (
      <p className="rounded-md bg-neutral-100 p-3 text-sm">
        <Link href="/login" className="text-brand-600 hover:underline">
          Inicia sesión
        </Link>{" "}
        para solicitar la adopción de esta mascota.
      </p>
    );
  }

  if (resultado?.success) {
    return (
      <p className="rounded-md bg-green-50 p-3 text-sm text-green-700">
        ¡Tu solicitud fue enviada! El refugio revisará tu mensaje pronto.
      </p>
    );
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const res = await solicitarAdopcion(mascotaId, formData);
          setResultado(res);
        });
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        name="mensaje"
        required
        placeholder="Cuéntale al refugio por qué serías un buen hogar..."
        className="rounded-md border px-3 py-2 text-sm"
        rows={3}
      />
      {resultado?.error && <p className="text-sm text-red-600">{resultado.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Solicitar adopción"}
      </button>
    </form>
  );
}
