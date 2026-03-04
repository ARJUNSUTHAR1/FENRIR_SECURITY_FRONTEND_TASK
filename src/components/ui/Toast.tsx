"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";
import type { ToastMessage } from "@/types";

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap = {
  success: "border-green-500/50 bg-green-500 dark:bg-green-600 text-white",
  error: "border-red-500/50 bg-red-500 dark:bg-red-600 text-white",
  info: "border-teal/50 bg-teal dark:bg-teal-hover text-white",
  warning: "border-amber-400/50 bg-amber-400 dark:bg-amber-500 text-white",
};

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [onDismiss]);

  const Icon = iconMap[toast.type];

  return (
    <div
      className={clsx(
        "flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium transition-all duration-300 min-w-[280px] max-w-[360px]",
        colorMap[toast.type],
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span className="flex-1 text-white">{toast.message}</span>
      <button onClick={onDismiss} className="shrink-0 opacity-80 hover:opacity-100 transition-opacity text-white">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-10 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}
