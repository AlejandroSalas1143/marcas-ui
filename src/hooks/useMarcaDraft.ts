/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import type { MarcaCreate, MarcaOut } from "@/types";
import { DeepPartial } from "@/types/utils";

type DraftMeta = {
  __marca_id?: number;
  titular_id?: number;
};

type Draft = DeepPartial<MarcaCreate> & DraftMeta;

type Mode = "create" | "edit";

const KEY = "marcaDraft";
const KEY_MODE = "marcaDraftMode";

export function useMarcaDraft() {
  const [draft, setDraft] = useState<Draft>({});
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("create");

  // Hidratar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const rawMode = localStorage.getItem(KEY_MODE) as Mode | null;
      if (raw) setDraft(JSON.parse(raw) as Draft);
      if (rawMode === "edit" || rawMode === "create") setMode(rawMode);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persistir draft
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  // Persistir mode
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY_MODE, mode);
  }, [mode, hydrated]);

  function resetDraft() {
    setDraft({});
    setMode("create");
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY_MODE);
  }

  const bootstrap = useCallback((initial: MarcaOut, nextMode: Mode = "edit") => {
    const mapped: Draft = {
      __marca_id: (initial as any).id,
      titular_id: (initial as any).titular?.id,

      nombre: initial.nombre,
      clase_niza: initial.clase_niza,

      titular: initial.titular
        ? {
            tipo_persona: initial.titular.tipo_persona,
            nombres: initial.titular.nombres ?? undefined,
            apellidos: initial.titular.apellidos ?? undefined,
            identificacion: initial.titular.identificacion ?? undefined,
            razon_social: initial.titular.razon_social ?? undefined,
            nit: initial.titular.nit ?? undefined,
            rep_legal_nombres: initial.titular.rep_legal_nombres ?? undefined,
            rep_legal_apellidos: initial.titular.rep_legal_apellidos ?? undefined,
            rep_legal_identificacion: initial.titular.rep_legal_identificacion ?? undefined,
          }
        : undefined,

      contacto: initial.titular?.contacto
        ? {
            nombres: initial.titular.contacto.nombres,
            apellidos: initial.titular.contacto.apellidos,
            email: initial.titular.contacto.email,
            telefono: initial.titular.contacto.telefono,
            direccion: initial.titular.contacto.direccion,
            pais: initial.titular.contacto.pais,
            ciudad: initial.titular.contacto.ciudad,
          }
        : undefined,

      info_empresarial: initial.titular?.info_empresarial
        ? {
            sector: initial.titular.info_empresarial.sector,
            ingresos_anuales: Number(initial.titular.info_empresarial.ingresos_anuales ?? 0),
          }
        : undefined,
    };

    setDraft((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(mapped);
      return same ? prev : mapped;
    });

    setMode((prev) => (prev === nextMode ? prev : nextMode));
  }, []);

  return { draft, setDraft, resetDraft, hydrated, mode, bootstrap };
}
