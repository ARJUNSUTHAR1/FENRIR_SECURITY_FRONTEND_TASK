"use client";

import { clsx } from "clsx";
import type { SeverityLevel } from "@/types";

interface BadgeProps {
  severity: SeverityLevel;
  count: number;
  size?: "sm" | "md";
}

const styles: Record<SeverityLevel, string> = {
  critical: "bg-red-500 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-amber-400 text-white",
  low: "bg-green-500 text-white",
};

export function SeverityBadge({ severity, count, size = "sm" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded",
        styles[severity],
        size === "sm" ? "text-xs min-w-[22px] h-[22px] px-1.5" : "text-sm min-w-[28px] h-[28px] px-2"
      )}
    >
      {count}
    </span>
  );
}

const labelStyles: Record<SeverityLevel, string> = {
  critical: "bg-red-500/15 text-red-400 border border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  medium: "bg-amber-400/15 text-amber-400 border border-amber-400/30",
  low: "bg-green-500/15 text-green-400 border border-green-500/30",
};

const labelText: Record<SeverityLevel, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function SeverityLabel({ severity }: { severity: SeverityLevel }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center text-xs font-medium rounded px-2.5 py-1",
        labelStyles[severity]
      )}
    >
      {labelText[severity]}
    </span>
  );
}
