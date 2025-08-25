"use client";

import { motion } from "framer-motion";

export function SummarySection({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="space-y-3"
    >
      <h3 className="font-medium text-zinc-700 flex items-center gap-2 text-sm">
        {icon}
        {title}
      </h3>
      <div className="space-y-2.5 pl-6">{children}</div>
    </motion.div>
  );
}
