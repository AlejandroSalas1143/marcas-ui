/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle, User, Building2, Mail, Phone, MapPin, TrendingUp, Tag, Hash,
} from "lucide-react";

import { useMarcaDraft } from "@/hooks/useMarcaDraft";
import { useCreateMarca } from "@/hooks/useCreateMarca"; // <- expone crear y actualizar

import { NotificationContainer } from "@/components/ui/Notifications";
import { SummarySection } from "@/components/summary/SummarySection";
import { SummaryInfo } from "@/components/summary/SummaryInfo";
import { ActionBar } from "@/components/ActionBar";

import type { MarcaOut } from "@/types";

type Props = {
  initial?: MarcaOut;
  mode?: "create" | "edit";     // override opcional
  basePath?: string;            // navegación (default: /registro-marca)
};

// --- helpers opcionales para marcar cambios ---
function getPath(obj: any, path: (string | number)[]) {
  return path.reduce((acc, k) => (acc == null ? acc : acc[k as any]), obj);
}

function isChanged(initial: any, draft: any, path: (string | number)[]) {
  const a = getPath(initial, path);
  const b = getPath(draft, path);
  return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full text-xs px-2 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200">
      {children}
    </span>
  );
}

function ChangedWrap({
  changed,
  children,
}: {
  changed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={changed ? "rounded-lg p-1 -m-1" : ""}>
      {children}
    </div>
  );
}

export default function Step3({
  initial,
  basePath = "/registro-marca",
}: Props) {
  const { draft, resetDraft, hydrated, mode } = useMarcaDraft();
  const [loading, setLoading] = useState(false);

  // Asegúrate que este hook tenga actualizar(draft, setLoading)
  const { crear, actualizar, notifications, remove, add } = useCreateMarca();

  const handlePrimary = async () => {
    try {
      if (draft.__marca_id) {
        await actualizar(draft, setLoading);            // EDIT: PUT/PATCH
        add("success", "Cambios guardados", "La marca se actualizó correctamente.");
      } else {
        await crear(draft, setLoading);                 // CREATE: POST
        add("success", "Marca creada", "La marca se creó correctamente.");
        // opcional: resetDraft();
      }
    } catch (e: any) {
      add("error", "Error", e?.message ?? "No fue posible completar la operación.");
    }
  };

  const handleClearDraft = () => {
    resetDraft();
    add("success", "Borrador limpiado", "Se ha eliminado toda la información del borrador.");
  };

  if (!hydrated) return null;

  return (
    <section className="space-y-6">
      <NotificationContainer notifications={notifications} onRemove={remove} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-zinc-200/80 rounded-2xl p-5 md:p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-base md:text-lg font-semibold text-zinc-900 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            {mode === "edit" ? "Resumen de la Marca (Edición)" : "Resumen de la Marca"}
          </h2>
          <p className="text-sm text-zinc-600 mt-1">
            Revisa la información antes de {mode === "edit" ? "guardar" : "crear"} la marca
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Marca */}
          <SummarySection title="Información de la Marca" icon={<Tag className="w-4 h-4 text-rose-500" />} delay={0.1}>
            <ChangedWrap changed={isChanged(initial, draft, ["nombre"])}>
              <SummaryInfo icon={<Hash className="w-4 h-4 text-zinc-500" />} label="Nombre" value={draft.nombre} />
            </ChangedWrap>
            <ChangedWrap changed={isChanged(initial, draft, ["clase_niza"])}>
              <SummaryInfo icon={<TrendingUp className="w-4 h-4 text-zinc-500" />} label="Clase de Niza" value={String(draft.clase_niza ?? "")} />
            </ChangedWrap>
          </SummarySection>

          {/* Titular: SIEMPRE visible, aunque haya titular_id */}
          <SummarySection
            title="Titular"
            icon={
              draft.titular?.tipo_persona === "Natural" ? (
                <User className="w-4 h-4 text-emerald-500" />
              ) : (
                <Building2 className="w-4 h-4 text-blue-500" />
              )
            }
            delay={0.2}
          >
            {!!draft.titular_id && (
              <div className="mb-2">
                <Chip>Vinculado a ID {draft.titular_id}</Chip>
              </div>
            )}

            {draft.titular ? (
              <>
                <ChangedWrap changed={isChanged(initial, draft, ["titular", "tipo_persona"])}>
                  <SummaryInfo
                    label="Tipo"
                    value={
                      draft.titular?.tipo_persona === "Natural"
                        ? "Persona Natural"
                        : draft.titular?.tipo_persona === "Juridica"
                        ? "Persona Jurídica"
                        : undefined
                    }
                  />
                </ChangedWrap>

                {draft.titular?.tipo_persona === "Natural" && (
                  <>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "nombres"])}>
                      <SummaryInfo label="Nombres" value={draft.titular?.nombres} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "apellidos"])}>
                      <SummaryInfo label="Apellidos" value={draft.titular?.apellidos} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "identificacion"])}>
                      <SummaryInfo label="Identificación" value={draft.titular?.identificacion} />
                    </ChangedWrap>
                  </>
                )}

                {draft.titular?.tipo_persona === "Juridica" && (
                  <>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "razon_social"])}>
                      <SummaryInfo label="Razón social" value={draft.titular?.razon_social} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "nit"])}>
                      <SummaryInfo label="NIT" value={draft.titular?.nit} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "rep_legal_nombres"])}>
                      <SummaryInfo label="Rep. legal nombres" value={draft.titular?.rep_legal_nombres} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "rep_legal_apellidos"])}>
                      <SummaryInfo label="Rep. legal apellidos" value={draft.titular?.rep_legal_apellidos} />
                    </ChangedWrap>
                    <ChangedWrap changed={isChanged(initial, draft, ["titular", "rep_legal_identificacion"])}>
                      <SummaryInfo label="Rep. legal ID" value={draft.titular?.rep_legal_identificacion} />
                    </ChangedWrap>
                  </>
                )}
              </>
            ) : (
              <>
                {draft.titular_id ? (
                  <p className="text-zinc-500 text-sm">
                    No hay detalles del titular cargados en el borrador.{" "}
                    <span className="text-zinc-700">Se usará el titular vinculado (ID {draft.titular_id}).</span>
                  </p>
                ) : (
                  <p className="text-zinc-500 text-sm">Sin información de titular</p>
                )}
              </>
            )}
          </SummarySection>

          {/* Contacto: SIEMPRE visible */}
          <SummarySection title="Contacto" icon={<Mail className="w-4 h-4 text-purple-500" />} delay={0.3}>
            <ChangedWrap
              changed={
                isChanged(initial, draft, ["contacto", "nombres"]) ||
                isChanged(initial, draft, ["contacto", "apellidos"])
              }
            >
              <SummaryInfo
                icon={<User className="w-4 h-4 text-zinc-500" />}
                label="Nombre completo"
                value={`${draft.contacto?.nombres ?? ""} ${draft.contacto?.apellidos ?? ""}`.trim() || undefined}
              />
            </ChangedWrap>

            <ChangedWrap changed={isChanged(initial, draft, ["contacto", "email"])}>
              <SummaryInfo icon={<Mail className="w-4 h-4 text-zinc-500" />} label="Email" value={draft.contacto?.email} />
            </ChangedWrap>

            <ChangedWrap changed={isChanged(initial, draft, ["contacto", "telefono"])}>
              <SummaryInfo icon={<Phone className="w-4 h-4 text-zinc-500" />} label="Teléfono" value={draft.contacto?.telefono} />
            </ChangedWrap>

            <ChangedWrap
              changed={
                isChanged(initial, draft, ["contacto", "direccion"]) ||
                isChanged(initial, draft, ["contacto", "ciudad"]) ||
                isChanged(initial, draft, ["contacto", "pais"])
              }
            >
              <SummaryInfo
                icon={<MapPin className="w-4 h-4 text-zinc-500" />}
                label="Dirección"
                value={`${draft.contacto?.direccion ?? ""}, ${draft.contacto?.ciudad ?? ""} - ${draft.contacto?.pais ?? ""}`.replace(/^, |,$/, "") || undefined}
              />
            </ChangedWrap>
          </SummarySection>

          {/* Información Empresarial: SIEMPRE visible */}
          <SummarySection title="Información Empresarial" icon={<TrendingUp className="w-4 h-4 text-orange-500" />} delay={0.4}>
            <ChangedWrap changed={isChanged(initial, draft, ["info_empresarial", "sector"])}>
              <SummaryInfo icon={<Building2 className="w-4 h-4 text-zinc-500" />} label="Sector" value={draft.info_empresarial?.sector ?? ""} />
            </ChangedWrap>

            <ChangedWrap changed={isChanged(initial, draft, ["info_empresarial", "ingresos_anuales"])}>
              <SummaryInfo
                icon={<TrendingUp className="w-4 h-4 text-zinc-500" />}
                label="Ingresos anuales"
                value={
                  draft.info_empresarial?.ingresos_anuales
                    ? `$${Number(draft.info_empresarial.ingresos_anuales).toLocaleString()} COP`
                    : undefined
                }
              />
            </ChangedWrap>
          </SummarySection>
        </div>

        <ActionBar
          backHref={`${basePath}/step-2`}
          right={
            <>
              <button
                onClick={handleClearDraft}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors text-sm"
              >
                Limpiar borrador
              </button>

              <button
                onClick={handlePrimary}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-[2px] border-white/60 border-r-transparent" />
                    {draft.__marca_id ? "Guardando..." : "Creando..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {draft.__marca_id ? "Guardar cambios" : "Crear Marca"}
                  </>
                )}
              </button>
            </>
          }
        />
      </motion.div>
    </section>
  );
}
