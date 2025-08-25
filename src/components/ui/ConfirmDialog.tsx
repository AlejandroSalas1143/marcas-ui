"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { ReactNode, useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  description?: ReactNode; // puede ser string o nodo
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  closeOnBackdrop?: boolean;
};

export default function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar",
  loading = false,
  onClose,
  onConfirm,
  closeOnBackdrop = true,
}: Props) {
  // ESC para cerrar, Enter para confirmar
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Trash2 size={18} />
                  </div>
                  <h2 id="confirm-title" className="text-base font-semibold text-zinc-900">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 py-4">
                {typeof description === "string" ? (
                  <p
                    id="confirm-desc"
                    className="w-full text-center text-sm text-zinc-600 whitespace-pre-line"
                  >
                    {description}
                  </p>
                ) : (
                  <div
                    id="confirm-desc"
                    className="w-full text-center text-sm text-zinc-600 [&_strong]:font-semibold [&_br]:block"
                  >
                    {description}
                  </div>
                )}
              </div>

              <div className="px-5 pb-5 flex items-center justify-end gap-2">
                <button
                  disabled={loading}
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg text-sm font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 cursor-pointer"
                >
                  {cancelText}
                </button>

                <button
                  disabled={loading}
                  onClick={onConfirm}
                  className="px-3 py-2 rounded-lg text-white text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-500 hover:from-pink-600 hover:to-rose-600 disabled:opacity-60 cursor-pointer transition"
                >
                  {loading ? "Eliminando..." : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
