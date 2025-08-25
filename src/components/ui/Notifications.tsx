"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export type NotificationType = "success" | "error" | "warning";
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

export function NotificationContainer({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onRemove={() => onRemove(n.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function NotificationItem({
  notification,
  onRemove,
}: {
  notification: Notification;
  onRemove: () => void;
}) {
  const icon =
    notification.type === "success" ? (
      <CheckCircle className="w-5 h-5 text-emerald-500" />
    ) : (
      <AlertCircle className={`w-5 h-5 ${notification.type === "error" ? "text-red-500" : "text-amber-500"}`} />
    );

  const styles =
    notification.type === "success"
      ? "bg-emerald-50 border-emerald-200"
      : notification.type === "error"
      ? "bg-red-50 border-red-200"
      : "bg-amber-50 border-amber-200";

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`p-4 rounded-xl border shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/90 ${styles}`}
    >
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-900">{notification.title}</h4>
          <p className="text-sm text-zinc-600 mt-1">{notification.message}</p>
        </div>
        <button onClick={onRemove} className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
