"use client";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      await fetch(`/api/delete/${id}`, { method: "DELETE" });
      setOpen(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg text-white text-sm font-semibold cursor-pointer bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 transition"
        disabled={loading}
      >
        {loading ? "Eliminando..." : "Eliminar"}
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => (!loading ? setOpen(false) : null)}
        onConfirm={handleDelete}
        loading={loading}
        title="Eliminar registro"
        description={
          <>
            ¿Eliminar <strong>“{name}”</strong>?<br />
            Esta acción no se puede deshacer.
          </>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  );
}
