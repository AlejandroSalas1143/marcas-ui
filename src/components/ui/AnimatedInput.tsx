"use client";

import { motion } from "framer-motion";
import { Field, Label } from "@/components/ui/Field";

type AnimatedInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: string;
  delay?: number;
};

export function AnimatedInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
  delay = 0,
}: AnimatedInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Field>
        <Label>{label}</Label>
        <div className="relative">
          <motion.input
            type={type}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 pr-12 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm
                       hover:border-zinc-300
                       focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition"
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          {suffix ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              {suffix}
            </span>
          ) : null}
        </div>
      </Field>
    </motion.div>
  );
}
