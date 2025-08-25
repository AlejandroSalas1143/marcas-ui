"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Color = "zinc" | "emerald" | "blue";
const colorClasses: Record<Color, string> = {
  zinc: "border-zinc-200 text-zinc-700",
  emerald: "border-emerald-200 text-emerald-700 bg-emerald-50/50",
  blue: "border-blue-200 text-blue-700 bg-blue-50/50",
};

export function AnimatedFieldset({
  legend,
  children,
  icon,
  color = "zinc",
  className = "",
}: {
  legend: string;
  children: ReactNode;
  icon?: ReactNode;
  color?: Color;
  className?: string;
}) {
  return (
    <motion.fieldset
      className={`border rounded-xl p-4 md:p-5 ${colorClasses[color]} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      <legend className="px-2 text-sm font-medium flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        {legend}
      </legend>
      <div className="mt-3 space-y-4">{children}</div>
    </motion.fieldset>
  );
}
