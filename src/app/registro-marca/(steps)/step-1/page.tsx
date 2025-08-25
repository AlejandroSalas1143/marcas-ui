"use client";

import { useEffect, useRef } from "react";
import Step1 from "./Step1";
import { useMarcaDraft } from "@/hooks/useMarcaDraft";

export default function CreateStep1Page() {
  const { resetDraft, hydrated } = useMarcaDraft();

  const ranRef = useRef(false);

  useEffect(() => {
    if (!hydrated || ranRef.current) return;
    ranRef.current = true;
    resetDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  if (!hydrated) return null;

  return <Step1 mode="create" basePath="/registro-marca" />;
}
