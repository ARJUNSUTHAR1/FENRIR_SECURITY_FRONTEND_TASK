"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { clsx } from "clsx";
import {
  ScanLine,
  Network,
  FlaskConical,
  ShieldCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  X,
  Download,
  StopCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SeverityLabel } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { scans, activityLogs, verificationLogs, findings } from "@/data/mock";
import type { ScanStep } from "@/types";

const steps: { key: ScanStep; label: string; icon: React.ElementType }[] = [
  { key: "spidering", label: "Spidering", icon: ScanLine },
  { key: "mapping", label: "Mapping", icon: Network },
  { key: "testing", label: "Testing", icon: FlaskConical },
  { key: "validating", label: "Validating", icon: ShieldCheck },
  { key: "reporting", label: "Reporting", icon: FileText },
];

const stepOrder: ScanStep[] = ["spidering", "mapping", "testing", "validating", "reporting"];

function parseLogLine(message: string) {
  const parts: { text: string; type: "plain" | "teal" | "code" | "critical" | "dim" }[] = [];
  let remaining = message;

  const patterns = [
    { regex: /\*\*IDOR vulnerability\*\*/, type: "critical" as const },
    { regex: /'[^']*'/, type: "code" as const },
    { regex: /\/[a-zA-Z0-9/_.-]+(?=\s|$|\.|\,)/, type: "teal" as const },
    { regex: /https?:\/\/[^\s,]+/, type: "teal" as const },
    { regex: /"TODO:[^"]*"/, type: "teal" as const },
    { regex: /test:test/, type: "teal" as const },
    { regex: /X-UserId:\s*\d+/, type: "code" as const },
    { regex: /Apache httpd [^\n]+/, type: "dim" as const },
  ];

  while (remaining.length > 0) {
    let earliest: { index: number; length: number; type: typeof patterns[0]["type"] } | null = null;

    for (const p of patterns) {
      const match = p.regex.exec(remaining);
      if (match && (earliest === null || match.index < earliest.index)) {
        earliest = { index: match.index, length: match[0].length, type: p.type };
      }
    }

    if (!earliest) {
      parts.push({ text: remaining, type: "plain" });
      break;
    }

    if (earliest.index > 0) {
      parts.push({ text: remaining.slice(0, earliest.index), type: "plain" });
    }
    parts.push({ text: remaining.slice(earliest.index, earliest.index + earliest.length), type: earliest.type });
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return parts;
}

export default function ScanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useToast();
  const [activeTab, setActiveTab] = useState<"activity" | "verification">("activity");
  const [consoleExpanded, setConsoleExpanded] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const [visibleLogs, setVisibleLogs] = useState(4);

  const scan = scans.find((s) => s.id === id) ?? scans[0];
  const currentStepIndex = stepOrder.indexOf(scan.currentStep ?? "spidering");

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleLogs, activeTab]);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLogs((v) => {
        const max = activeTab === "activity" ? activityLogs.length : verificationLogs.length;
        if (v < max) return v + 1;
        clearInterval(timer);
        return v;
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [activeTab]);

  const logs = activeTab === "activity" ? activityLogs : verificationLogs;
  const displayedLogs = logs.slice(0, visibleLogs);

  return (
    <AppLayout>
      <div className="min-h-full bg-[#F5F5F5] dark:bg-[#111111]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 dark:text-gray-500">Scan</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 dark:text-gray-500 hover:text-teal transition-colors"
            >
              Home
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-400 dark:text-gray-500 hover:text-teal transition-colors"
            >
              Private Assets
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-teal font-medium">New Scan</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => addToast("Generating report…", "info")}
            >
              Export Report
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<StopCircle size={14} />}
              onClick={() => addToast("Scan has been stopped.", "warning")}
            >
              Stop Scan
            </Button>
          </div>
        </div>

        <div className="mx-6 mt-5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="shrink-0">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-100 dark:text-white/5" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="#0CC8A8"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - scan.progress / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{scan.progress}%</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">In Progress</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-0 relative">
                {steps.map((step, i) => {
                  const isActive = i === currentStepIndex;
                  const isCompleted = i < currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center flex-1 min-w-0">
                      <div className="flex flex-col items-center gap-1.5 relative flex-1">
                        <div
                          className={clsx(
                            "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all z-10",
                            isActive
                              ? "bg-teal border-teal text-white"
                              : isCompleted
                              ? "bg-teal/20 border-teal/40 text-teal"
                              : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600"
                          )}
                        >
                          <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                        </div>
                        <span
                          className={clsx(
                            "text-xs font-medium whitespace-nowrap",
                            isActive
                              ? "text-teal"
                              : isCompleted
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-400 dark:text-gray-600"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={clsx(
                            "flex-1 h-0.5 mb-5 mx-1",
                            i < currentStepIndex
                              ? "bg-teal/40"
                              : "bg-gray-200 dark:bg-white/10"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                <MetaItem label="Scan Type" value="Grey Box" />
                <MetaItem label="Targets" value={scan.target ?? "N/A"} highlight />
                <MetaItem label="Started At" value={scan.startedAt ?? "N/A"} />
                <MetaItem label="Credentials" value={`${scan.credentials} Active`} />
                <MetaItem label="Files" value={scan.files ?? "N/A"} />
                <MetaItem label="Checklists" value={scan.checklists ?? "N/A"} />
              </div>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "mx-6 mt-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] overflow-hidden transition-all duration-300",
            consoleExpanded ? "mb-0" : "mb-4"
          )}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Live Scan Console
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Running...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setConsoleExpanded((v) => !v)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                {consoleExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
              </button>
              <button
                onClick={() => addToast("Console closed.", "info")}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {consoleExpanded && (
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-white/[0.06]">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex border-b border-gray-100 dark:border-white/[0.06]">
                  <button
                    onClick={() => {
                      setActiveTab("activity");
                      setVisibleLogs(4);
                    }}
                    className={clsx(
                      "px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                      activeTab === "activity"
                        ? "text-teal border-teal"
                        : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    Activity Log
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("verification");
                      setVisibleLogs(4);
                    }}
                    className={clsx(
                      "px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                      activeTab === "verification"
                        ? "text-teal border-teal"
                        : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    Verification Loops
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[380px] font-mono">
                  {displayedLogs.map((log, i) => (
                    <div key={i} className="text-xs leading-relaxed">
                      <span className="text-gray-400 dark:text-gray-500 mr-2">[{log.time}]</span>
                      <LogText message={log.message} />
                    </div>
                  ))}
                  {visibleLogs < logs.length && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      Processing...
                    </div>
                  )}
                  <div ref={logEndRef} />
                </div>
              </div>

              <div className="lg:w-[340px] shrink-0 flex flex-col">
                <div className="px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Finding Log
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px]">
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="rounded-xl border border-gray-100 dark:border-white/[0.06] p-4 hover:border-gray-300 dark:hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <SeverityLabel severity={finding.severity} />
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                          {finding.time}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {finding.title}
                      </p>
                      <p className="text-xs text-teal font-mono mb-2">{finding.endpoint}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {finding.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mx-6 mb-5 mt-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] px-5 py-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <StatusBarItem label="Sub-Agents" value="0" dot="#9CA3AF" />
            <StatusBarItem label="Parallel Executions" value="2" dot="#0CC8A8" />
            <StatusBarItem label="Operations" value="1" dot="#9CA3AF" />
            <div className="ml-auto flex items-center gap-4">
              <StatusBarItem label="Critical" value={String(findings.filter((f) => f.severity === "critical").length)} color="text-red-400" />
              <StatusBarItem label="High" value={String(findings.filter((f) => f.severity === "high").length)} color="text-orange-400" />
              <StatusBarItem label="Medium" value={String(findings.filter((f) => f.severity === "medium").length)} color="text-amber-400" />
              <StatusBarItem label="Low" value={String(findings.filter((f) => f.severity === "low").length)} color="text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppLayout>
  );
}

function MetaItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{label}</p>
      <p className={clsx("text-sm font-medium", highlight ? "text-teal" : "text-gray-800 dark:text-gray-200")}>
        {value}
      </p>
    </div>
  );
}

function LogText({ message }: { message: string }) {
  const parts = parseLogLine(message);
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "teal")
          return <span key={i} className="text-teal">{part.text}</span>;
        if (part.type === "code")
          return (
            <span key={i} className="bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded px-1 py-0.5">
              {part.text}
            </span>
          );
        if (part.type === "critical")
          return <span key={i} className="text-red-400 font-semibold">{part.text}</span>;
        if (part.type === "dim")
          return <span key={i} className="text-gray-400 dark:text-gray-500">{part.text}</span>;
        return (
          <span key={i} className="text-gray-700 dark:text-gray-300">
            {part.text}
          </span>
        );
      })}
    </>
  );
}

function StatusBarItem({
  label,
  value,
  dot,
  color,
}: {
  label: string;
  value: string;
  dot?: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {dot && (
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dot }} />
      )}
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>
      <span className={clsx("font-semibold", color ?? "text-gray-700 dark:text-gray-300")}>
        {value}
      </span>
    </div>
  );
}
