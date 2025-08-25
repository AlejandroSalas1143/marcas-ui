"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { n: 1, label: "Información de la Marca" },
  { n: 2, label: "Información del Titular" },
  { n: 3, label: "Resumen" },
];

function getStepIndex(path: string) {
  const m = path.match(/\/step-(\d+)(?:\/|$)/i);
  const n = m ? parseInt(m[1], 10) : 1;
  return Math.max(0, Math.min(STEPS.length - 1, n - 1));
}

function getBase(path: string) {
  // /registro-marca  (create)
  // /registro-marca/:id/edit (edit)
  const m = path.match(/^\/registro-marca(?:\/(\d+)\/edit)?/i);
  if (m && m[1]) return `/registro-marca/${m[1]}/edit`;
  return "/registro-marca";
}

export default function Stepper() {
  const path = usePathname() || "/";
  const currentIdx = getStepIndex(path);
  const base = getBase(path);

  return (
    <div className="bg-white border rounded-xl p-4">
      <div className="flex items-center justify-center gap-6">
        {STEPS.map((s, i) => {
          const href = `${base}/step-${s.n}`;
          const isActive = i === currentIdx;
          const isDone = i < currentIdx;

          return (
            <div key={s.n} className="flex items-center gap-3">
              <Link href={href} className="relative">
                <motion.div
                  className={[
                    "h-9 w-9 rounded-full flex items-center justify-center border text-sm font-medium transition-colors",
                    isActive
                      ? "text-white border-transparent"
                      : isDone
                      ? "text-rose-600 border-rose-200 bg-rose-50"
                      : "text-zinc-600 border-zinc-200 bg-white hover:bg-zinc-50",
                  ].join(" ")}
                  initial={false}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 shadow-sm"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative z-10">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.svg
                          key="check"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ type: "spring", stiffness: 600, damping: 25 }}
                        >
                          <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      ) : (
                        <motion.span
                          key="number"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 600, damping: 25 }}
                        >
                          {s.n}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>

              <motion.span
                className="text-sm transition-colors"
                initial={false}
                animate={{
                  color: isActive || isDone ? "rgb(225 29 72)" : "rgb(107 114 128)",
                  fontWeight: isActive ? 500 : 400,
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {s.label}
              </motion.span>

              {i < STEPS.length - 1 && (
                <div className="w-10 h-px bg-zinc-200 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 h-px bg-gradient-to-r from-rose-500 to-pink-500"
                    initial={{ width: "0%" }}
                    animate={{ width: i < currentIdx ? "100%" : "0%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: i < currentIdx ? 0.1 : 0 }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
