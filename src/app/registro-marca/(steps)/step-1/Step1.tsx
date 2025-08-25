"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useMarcaDraft } from "@/hooks/useMarcaDraft";
import type { MarcaOut } from "@/types";

// UI reutilizable
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Hint } from "@/components/ui/Field";
import { AnimatedInput } from "@/components/ui/AnimatedInput";

type Props = {
  initial?: MarcaOut;
  mode?: "create" | "edit";   // opcional, override
  basePath?: string;          // para el botón "Continuar"
};

export default function Step1({
  initial,
  mode: modeProp,
  basePath = "/registro-marca",
}: Props) {
  const { draft, setDraft, bootstrap, mode, hydrated } = useMarcaDraft();

  // Solo bootstrapea si cambia el ID de la marca
  const lastIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!initial || !hydrated) return;
    if (lastIdRef.current === initial.id) return;

    bootstrap(initial, modeProp ?? "edit");
    lastIdRef.current = initial.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id, hydrated, modeProp]);

  if (!hydrated) return null; // evita parpadeo antes de hidratar

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === "edit" ? "Editar Información de la Marca" : "Información de la Marca"}
          </CardTitle>
          <CardDescription>Estos datos serán la base del registro.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre de la marca */}
            <div className="space-y-2">
              <AnimatedInput
                label="Nombre de la marca"
                placeholder="Ej. ACME"
                value={draft.nombre ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, nombre: v }))}
                delay={0.1}
              />
            </div>

            {/* Clase de Niza */}
            <div className="space-y-2">
              <AnimatedInput
                label="Clase de Niza (1 - 45)"
                type="number"
                placeholder="1"
                value={draft.clase_niza?.toString() ?? ""}
                onChange={(v) => {
                  const n = Number(v);
                  setDraft((d) => ({
                    ...d,
                    clase_niza: v === "" || Number.isNaN(n) ? undefined : n,
                  }));
                }}
                suffix="1 - 45"
                delay={0.2}
              />
              <Hint>Sistema de clasificación de productos/servicios (Niza).</Hint>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-2">
            <span className="text-sm text-zinc-500">
              La información se guarda automáticamente.
            </span>
            <Link
              href={`${basePath}/step-2`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition"
            >
              Continuar →
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
