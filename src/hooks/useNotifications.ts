"use client";

import { useCallback, useRef, useState } from "react";
import type { Notification, NotificationType } from "@/components/ui/Notifications";

export function useNotifications(autoCloseMs = 5000) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const add = useCallback(
    (type: NotificationType, title: string, message: string) => {
      const id = Math.random().toString(36).slice(2);
      const n: Notification = { id, type, title, message };
      setNotifications((prev) => [...prev, n]);
      timers.current[id] = setTimeout(() => remove(id), autoCloseMs);
    },
    [autoCloseMs, remove]
  );

  return { notifications, add, remove };
}
