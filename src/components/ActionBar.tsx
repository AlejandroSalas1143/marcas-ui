"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function ActionBar({
  backHref,
  right,
  delay = 0.5,
}: {
  backHref: string;
  right?: React.ReactNode; // botones extra a la derecha
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center justify-between pt-6 mt-6 border-t border-zinc-200"
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors"
      >
        ← Atrás
      </Link>
      <div className="flex gap-3">{right}</div>
    </motion.div>
  );
}
