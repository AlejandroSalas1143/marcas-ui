/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useNotifications } from "@/hooks/useNotifications";
import { useMarcaDraft } from "@/hooks/useMarcaDraft";

function buildPayloadFromDraft(draft: any) {
  const payload: any = {
    nombre: draft?.nombre,
    clase_niza: typeof draft?.clase_niza === "string" ? Number(draft?.clase_niza) : draft?.clase_niza,
  };

  if (draft?.titular_id) payload.titular_id = draft.titular_id;

  const t = draft?.titular;
  if (t && (t.tipo_persona || t.nombres || t.apellidos || t.identificacion || t.razon_social || t.nit)) {
    const titular: any = {
      tipo_persona: t.tipo_persona, // "Natural" | "Juridica"
      nombres: t.nombres || undefined,
      apellidos: t.apellidos || undefined,
      identificacion: t.identificacion || undefined,
      razon_social: t.razon_social || undefined,
      nit: t.nit || undefined,
      rep_legal_nombres: t.rep_legal_nombres || undefined,
      rep_legal_apellidos: t.rep_legal_apellidos || undefined,
      rep_legal_identificacion: t.rep_legal_identificacion || undefined,
    };

    if (titular.tipo_persona === "Natural") {
      delete titular.razon_social;
      delete titular.nit;
      delete titular.rep_legal_nombres;
      delete titular.rep_legal_apellidos;
      delete titular.rep_legal_identificacion;
    }
    if (titular.tipo_persona === "Juridica") {
      delete titular.nombres;
      delete titular.apellidos;
      delete titular.identificacion;
    }

    payload.titular = titular;
  }

  const c = draft?.contacto;
  if (c && (c.nombres || c.apellidos || c.email || c.telefono || c.direccion || c.pais || c.ciudad)) {
    payload.contacto = {
      nombres: c.nombres || "",
      apellidos: c.apellidos || "",
      email: c.email || "",
      telefono: c.telefono || "",
      direccion: c.direccion || "",
      pais: c.pais || "",
      ciudad: c.ciudad || "",
    };
  }

  const ie = draft?.info_empresarial;
  if (ie && (ie.sector || ie.ingresos_anuales === 0 || ie.ingresos_anuales)) {
    payload.info_empresarial = {
      sector: ie.sector,
      ingresos_anuales:
        ie.ingresos_anuales === "" || ie.ingresos_anuales == null
          ? 0
          : Number(ie.ingresos_anuales),
    };
  }

  return payload;
}

export function useCreateMarca() {
  const router = useRouter();
  const { add, notifications, remove } = useNotifications();
  const { resetDraft } = useMarcaDraft();
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const validarBase = useCallback(
    (draft: any) => {
      if (!draft?.nombre || !draft?.clase_niza) {
        add("warning", "Información incompleta", "Completa el nombre de la marca y la clase de Niza.");
        return false;
      }
      if (!draft.titular_id && !draft.titular) {
        add("warning", "Titular requerido", "Debes crear o seleccionar un titular para la marca.");
        return false;
      }
      return true;
    },
    [add]
  );

  const crear = useCallback(
    async (draft: any, onLoading?: (x: boolean) => void) => {
      try {
        onLoading?.(true);
        if (!validarBase(draft)) return;

        const payload = buildPayloadFromDraft(draft);
        const created = await api.createMarca(payload);

        resetDraft();
        add("success", "¡Marca creada!", `Tu marca "${created.nombre}" fue registrada con ID #${created.id}`);

        timerRef.current = setTimeout(() => {
          router.push("/");
        }, 1200);
      } catch (e: any) {
        add("error", "Error al crear la marca", e?.message ?? "Ocurrió un error inesperado.");
      } finally {
        onLoading?.(false);
      }
    },
    [add, resetDraft, router, validarBase]
  );

  const actualizar = useCallback(
    async (draft: any, onLoading?: (x: boolean) => void) => {
      try {
        onLoading?.(true);

        const id = draft?.__marca_id ?? draft?.id;
        if (!id) {
          add("error", "ID faltante", "No se encontró __marca_id en el borrador para actualizar.");
          return;
        }
        if (!validarBase(draft)) return;

        const payload = buildPayloadFromDraft(draft);
        const updated = await api.updateMarca(id, payload);

        add("success", "Cambios guardados", `La marca "${updated.nombre}" (#${updated.id}) se actualizó correctamente.`);
      } catch (e: any) {
        add("error", "Error al actualizar la marca", e?.message ?? "Ocurrió un error inesperado.");
      } finally {
        onLoading?.(false);
      }
    },
    [add, validarBase]
  );

  return { crear, actualizar, notifications, remove, add };
}
