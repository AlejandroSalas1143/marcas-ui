"use client";
import Transition from "@/components/Transition";
import Stepper from "@/components/Stepper";
import Breadcrumb from "@/components/Breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <Breadcrumb
        className="mb-2"
        prefixItems={[
          { href: "/", label: "Dashboard" },
        ]}
        labelMap={{
          marcas: "Registro de Marca",
          "registro-marca": "Registro de Marca",
        }}
      />

      {/* Stepper */}
      <div className="overflow-hidden">
        <Stepper />
      </div>

      {/* Contenido con transición */}
      <div
        className="overflow-hidden min-h-[400px]"
        style={{ display: "grid", gridTemplate: "1fr / 1fr" }}
      >
        <Transition>{children}</Transition>
      </div>
    </div>
  );
}
