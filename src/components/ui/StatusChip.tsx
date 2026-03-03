"use client";

import { clsx } from "clsx";
import type { ScanStatus } from "@/types";

const chipStyles: Record<ScanStatus, string> = {
  completed: "bg-green-500/15 text-green-400 border border-green-500/30",
  scheduled: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
  failed: "bg-red-500/15 text-red-400 border border-red-500/30",
  in_progress: "bg-teal/15 text-teal border border-teal/30",
};

const chipText: Record<ScanStatus, string> = {
  completed: "Completed",
  scheduled: "Scheduled",
  failed: "Failed",
  in_progress: "In Progress",
};

export function StatusChip({ status }: { status: ScanStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap",
        chipStyles[status]
      )}
    >
      {chipText[status]}
    </span>
  );
}
