/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building2, ShoppingCart, Factory, Target } from "lucide-react";

import { useMarcaDraft } from "@/hooks/useMarcaDraft";
import type { MarcaCreate, MarcaOut } from "@/types";
import type { DeepPartial } from "@/types/utils";

// UI reutilizable
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Field, Label, Hint } from "@/components/ui/Field";
import { AnimatedFieldset } from "@/components/ui/Fieldset";
import { AnimatedInput } from "@/components/ui/AnimatedInput";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";

const sectores = ["Comercio", "Manufactura", "Servicios"] as const;
type TipoPersonaOpcion = "" | "Natural" | "Juridica";
type Draft = DeepPartial<MarcaCreate>;

type Props = {
  initial?: MarcaOut;
  mode?: "create" | "edit";   // override opcional
  basePath?: string;          // prefijo para navegación (default: /registro-marca)
};

export default function Step2({
  basePath = "/registro-marca",
}: Props) {
  const { draft, setDraft, hydrated, mode } = useMarcaDraft();
  const tipo = (draft.titular?.tipo_persona as TipoPersonaOpcion) ?? "";

  if (!hydrated) return null; // evita parpadeo antes de hidratar localStorage

  // Helper para "mergear" parciales en la rama indicada
  const patch = <K extends keyof Draft>(key: K, partial: Partial<Draft[K]>) => {
    setDraft((d) => ({
      ...d,
      [key]: { ...(d[key] as any), ...(partial as any) },
    }));
  };

  const handleTipoPersonaChange = (nuevo: TipoPersonaOpcion) => {
    if (!nuevo) {
      setDraft((d) => ({ ...d, titular: undefined }));
      return;
    }
    setDraft((d) => {
      const base: Draft["titular"] = { ...(d.titular ?? {}), tipo_persona: nuevo };
      if (nuevo === "Natural") {
        delete (base as any).razon_social;
        delete (base as any).nit;
        delete (base as any).rep_legal_nombres;
        delete (base as any).rep_legal_apellidos;
        delete (base as any).rep_legal_identificacion;
      } else {
        delete (base as any).nombres;
        delete (base as any).apellidos;
        delete (base as any).identificacion;
      }
      return { ...d, titular: base };
    });
  };

  return (
    <section className="space-y-6">
      {/* Información del Titular */}
      <Card>
        <CardHeader>
          <CardTitle>{mode === "edit" ? "Editar Titular" : "Información del Titular"}</CardTitle>
          <CardDescription>Ingresa los datos del titular de la marca.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <Label>Tipo de persona</Label>
            <AnimatedSelect
              value={tipo}
              onChange={(value) => handleTipoPersonaChange(value as TipoPersonaOpcion)}
              placeholder="-- Selecciona --"
              options={[
                { value: "Natural", label: "Persona Natural", icon: <User className="w-4 h-4 text-emerald-600" /> },
                { value: "Juridica", label: "Persona Jurídica", icon: <Building2 className="w-4 h-4 text-blue-600" /> },
              ]}
            />
            <Hint>Esto determina qué campos necesitas diligenciar.</Hint>
          </Field>

          <AnimatePresence mode="wait">
            {tipo === "Natural" && (
              <motion.div
                key="natural"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut", height: { duration: 0.4 } }}
              >
                <AnimatedFieldset
                  legend="Persona Natural"
                  icon={<User className="w-4 h-4 text-emerald-600" />}
                  color="emerald"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnimatedInput
                      label="Nombres"
                      placeholder="Ej. Ana María"
                      value={draft.titular?.nombres ?? ""}
                      onChange={(v) => patch("titular", { nombres: v })}
                      delay={0.1}
                    />
                    <AnimatedInput
                      label="Apellidos"
                      placeholder="Ej. Pérez Gómez"
                      value={draft.titular?.apellidos ?? ""}
                      onChange={(v) => patch("titular", { apellidos: v })}
                      delay={0.2}
                    />
                    <AnimatedInput
                      label="Identificación"
                      placeholder="CC / DNI"
                      value={draft.titular?.identificacion ?? ""}
                      onChange={(v) => patch("titular", { identificacion: v })}
                      delay={0.3}
                    />
                  </div>
                </AnimatedFieldset>
              </motion.div>
            )}

            {tipo === "Juridica" && (
              <motion.div
                key="juridica"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut", height: { duration: 0.4 } }}
              >
                <AnimatedFieldset
                  legend="Persona Jurídica"
                  icon={<Building2 className="w-4 h-4 text-blue-600" />}
                  color="blue"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <AnimatedInput
                        label="Razón social"
                        placeholder="Ej. Acme S.A.S."
                        value={draft.titular?.razon_social ?? ""}
                        onChange={(v) => patch("titular", { razon_social: v })}
                        delay={0.1}
                      />
                      <AnimatedInput
                        label="NIT"
                        placeholder="Ej. 900.123.456-7"
                        value={draft.titular?.nit ?? ""}
                        onChange={(v) => patch("titular", { nit: v })}
                        delay={0.2}
                      />
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Representante Legal
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AnimatedInput
                          label="Nombres"
                          placeholder="Ej. Juan Camilo"
                          value={draft.titular?.rep_legal_nombres ?? ""}
                          onChange={(v) => patch("titular", { rep_legal_nombres: v })}
                          delay={0.3}
                        />
                        <AnimatedInput
                          label="Apellidos"
                          placeholder="Ej. Rodríguez Díaz"
                          value={draft.titular?.rep_legal_apellidos ?? ""}
                          onChange={(v) => patch("titular", { rep_legal_apellidos: v })}
                          delay={0.4}
                        />
                        <AnimatedInput
                          label="Identificación"
                          placeholder="CC / DNI"
                          value={draft.titular?.rep_legal_identificacion ?? ""}
                          onChange={(v) => patch("titular", { rep_legal_identificacion: v })}
                          delay={0.5}
                        />
                      </div>
                    </div>
                  </div>
                </AnimatedFieldset>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
          <CardDescription>Usaremos estos datos para notificaciones del trámite.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedInput
              label="Nombres"
              placeholder="Ej. Laura"
              value={draft.contacto?.nombres ?? ""}
              onChange={(v) => patch("contacto", { nombres: v })}
              delay={0.1}
            />
            <AnimatedInput
              label="Apellidos"
              placeholder="Ej. Suárez"
              value={draft.contacto?.apellidos ?? ""}
              onChange={(v) => patch("contacto", { apellidos: v })}
              delay={0.2}
            />
            <AnimatedInput
              label="Correo electrónico"
              placeholder="nombre@correo.com"
              type="email"
              value={draft.contacto?.email ?? ""}
              onChange={(v) => patch("contacto", { email: v })}
              delay={0.3}
            />
            <AnimatedInput
              label="Teléfono"
              placeholder="+57 300 000 0000"
              type="tel"
              value={draft.contacto?.telefono ?? ""}
              onChange={(v) => patch("contacto", { telefono: v })}
              delay={0.4}
            />
            <AnimatedInput
              label="Dirección"
              placeholder="Calle 00 #00-00"
              value={draft.contacto?.direccion ?? ""}
              onChange={(v) => patch("contacto", { direccion: v })}
              delay={0.5}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="País"
                placeholder="Ej. Colombia"
                value={draft.contacto?.pais ?? ""}
                onChange={(v) => patch("contacto", { pais: v })}
                delay={0.6}
              />
              <AnimatedInput
                label="Ciudad"
                placeholder="Ej. Barranquilla"
                value={draft.contacto?.ciudad ?? ""}
                onChange={(v) => patch("contacto", { ciudad: v })}
                delay={0.7}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información empresarial */}
      <Card>
        <CardHeader>
          <CardTitle>Información empresarial</CardTitle>
          <CardDescription>Datos generales de la empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <Label>Sector</Label>
              <AnimatedSelect
                value={(draft.info_empresarial?.sector as string) ?? ""}
                onChange={(value) =>
                  patch("info_empresarial", {
                    sector: value as (typeof sectores)[number],
                    ingresos_anuales: draft.info_empresarial?.ingresos_anuales ?? 0,
                  })
                }
                placeholder="-- Selecciona --"
                options={[
                  { value: "Comercio", label: "Comercio", icon: <ShoppingCart className="w-4 h-4" /> },
                  { value: "Manufactura", label: "Manufactura", icon: <Factory className="w-4 h-4" /> },
                  { value: "Servicios", label: "Servicios", icon: <Target className="w-4 h-4" /> },
                ]}
              />
            </Field>

            <AnimatedInput
              label="Ingresos anuales"
              type="number"
              placeholder="0"
              value={draft.info_empresarial?.ingresos_anuales?.toString() ?? ""}
              onChange={(v) =>
                patch("info_empresarial", {
                  sector: draft.info_empresarial?.sector ?? sectores[0],
                  ingresos_anuales: v === "" ? 0 : Number(v),
                })
              }
              suffix="COP"
              delay={0.1}
            />
          </div>
        </CardContent>
      </Card>

      {/* Navegación integrada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-200"
      >
        <Link
          href={`${basePath}/step-1`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors"
        >
          ← Atrás
        </Link>
        <Link
          href={`${basePath}/step-3`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-colors"
        >
          Continuar →
        </Link>
      </motion.div>
    </section>
  );
}
