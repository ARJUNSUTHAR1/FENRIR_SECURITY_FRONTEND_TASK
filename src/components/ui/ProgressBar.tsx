"use client";

import { clsx } from "clsx";
import type { ScanStatus } from "@/types";

interface ProgressBarProps {
  progress: number;
  status: ScanStatus;
}

export function ProgressBar({ progress, status }: ProgressBarProps) {
  const barColor =
    status === "failed"
      ? "bg-red-500"
      : status === "in_progress"
      ? "bg-teal"
      : "bg-teal";

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden min-w-[80px]">
        <div
          className={clsx("h-full rounded-full transition-all", barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 w-9 text-right shrink-0">
        {progress}%
      </span>
    </div>
  );
}
