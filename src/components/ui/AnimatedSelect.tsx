"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Option = { value: string; label: string; icon?: ReactNode };

type AnimatedSelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Option[];
};

export function AnimatedSelect({
  value,
  onChange,
  placeholder,
  options,
}: AnimatedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full max-w-xs">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between rounded-xl border bg-white px-3 py-2.5 text-sm text-left shadow-sm outline-none transition
          ${isOpen ? "border-rose-500 ring-2 ring-rose-500/20" : "border-zinc-200 hover:border-zinc-300"}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        whileTap={{ scale: 0.98 }}
      >
        <span className={`flex items-center gap-2 ${selectedOption ? "text-zinc-900" : "text-zinc-400"}`}>
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-zinc-400">
          ▾
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden"
            role="listbox"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-zinc-50 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                role="option"
                aria-selected={value === option.value}
                whileTap={{ scale: 0.98 }}
              >
                {option.icon && <span className="shrink-0">{option.icon}</span>}
                <span className="text-zinc-900">{option.label}</span>
                {value === option.value && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-rose-500">
                    ✓
                  </motion.span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
