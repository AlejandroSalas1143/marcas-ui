"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function getStepIndex(path: string) {
  const m = path.match(/\/step-(\d+)(?:\/|$)/i);
  return m ? parseInt(m[1], 10) : null;
}

let globalDirection: 1 | -1 = 1;

const variants = {
  enter: () => ({
    x: globalDirection === 1 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: () => ({
    x: globalDirection === 1 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export default function Transition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevStepRef = useRef<number | null>(null);
  const [routeKey, setRouteKey] = useState<string | number>("");

  useEffect(() => {
    const curr = getStepIndex(pathname);
    const prev = prevStepRef.current;
    
    if (prev !== null && curr !== null && prev !== curr) {
      globalDirection = curr > prev ? 1 : -1;
      console.log(`Navigation: step-${prev} → step-${curr}, direction: ${globalDirection}`);
    }
    
    prevStepRef.current = curr;
    setRouteKey(curr ?? pathname);
    
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="col-start-1 row-start-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}