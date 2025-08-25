// app/registro-marca/(steps)/step-1/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Step1 from "./Step1";
import { useMarcaDraft } from "@/hooks/useMarcaDraft";

export default function CreateStep1Page() {
  const { resetDraft, hydrated } = useMarcaDraft();

  // Evita que el efecto corra más de una vez
  const ranRef = useRef(false);

  useEffect(() => {
    if (!hydrated || ranRef.current) return;
    ranRef.current = true;
    resetDraft();
    // Nota: no pongas resetDraft en deps para que no cambie la identidad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  return <Step1 mode="create" basePath="/registro-marca" />;
}
