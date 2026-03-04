"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/useToast";
import { ScanDetailSkeleton } from "@/components/ui/Skeleton";
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"activity" | "verification">("activity");
  const [consoleExpanded, setConsoleExpanded] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const logTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [visibleLogs, setVisibleLogs] = useState(4);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scan = scans.find((s) => s.id === id) ?? scans[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleLogs(4);
      setProgress(0);
      setIsRunning(true);
      setCurrentStepIndex(0);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (logTimerRef.current) {
      clearInterval(logTimerRef.current);
      logTimerRef.current = null;
    }
    logTimerRef.current = setInterval(() => {
      setVisibleLogs((v) => {
        const max = activeTab === "activity" ? activityLogs.length : verificationLogs.length;
        if (v >= max) {
          if (logTimerRef.current) {
            clearInterval(logTimerRef.current);
            logTimerRef.current = null;
          }
          return v;
        }
        return v + 1;
      });
    }, 1800);
    return () => {
      if (logTimerRef.current) {
        clearInterval(logTimerRef.current);
        logTimerRef.current = null;
      }
    };
  }, [activeTab, loading]);

  useEffect(() => {
    userScrolledUp.current = false;
  }, [activeTab]);

  useEffect(() => {
    if (loading) return;
    const el = logContainerRef.current;
    if (!el || userScrolledUp.current) return;
    el.scrollTop = el.scrollHeight;
  }, [visibleLogs, loading]);

  useEffect(() => {
    if (loading || !isRunning) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsRunning(false);
          return 100;
        }
        return prev + 0.4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isRunning, loading]);

  useEffect(() => {
    if (loading) return;
    const idx = Math.min(steps.length - 1, Math.floor((progress / 100) * steps.length));
    setCurrentStepIndex(idx);
  }, [progress, loading]);

  function handleStopScan() {
    setIsRunning(false);
    addToast("Scan stopped at " + Math.round(progress) + "%.", "warning");
  }

  const logs = activeTab === "activity" ? activityLogs : verificationLogs;
  const displayedLogs = logs.slice(0, visibleLogs);

  const allDone = !isRunning && progress >= 100;

  if (loading) {
    return (
      <AppLayout>
        <ScanDetailSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-[#F5F5F5] dark:bg-[#111111] overflow-y-auto lg:overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto shrink min-w-0">
            <button onClick={() => router.push("/dashboard")} className="text-gray-400 dark:text-gray-500 hover:text-teal transition-colors whitespace-nowrap">Scan</button>
            <span className="text-gray-300 dark:text-gray-600 shrink-0">/</span>
            <button onClick={() => router.push("/dashboard")} className="text-gray-400 dark:text-gray-500 hover:text-teal transition-colors whitespace-nowrap hidden sm:block">Private Assets</button>
            <span className="text-gray-300 dark:text-gray-600 shrink-0 hidden sm:block">/</span>
            <span className="text-teal font-medium whitespace-nowrap">New Scan</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => addToast("Generating report…", "info")} className="hidden sm:flex">
              Export Report
            </Button>
            <Button variant="danger" size="sm" icon={<StopCircle size={14} />} onClick={handleStopScan} disabled={!isRunning}>
              Stop Scan
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-4 sm:mx-6 mt-4 sm:mt-5 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center sm:items-start">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px]">
                <div className="absolute inset-0 rounded-full bg-gray-900 dark:bg-[#0a0a0a] shadow-lg" />
                <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                  <motion.circle
                    cx="55"
                    cy="55"
                    r="46"
                    fill="none"
                    stroke="#0e9e9e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 46}`}
                    strokeDashoffset={2 * Math.PI * 46 * (1 - progress / 100)}
                    transition={{ duration: 0.1, ease: "linear" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base sm:text-lg font-bold text-white">{Math.round(progress)}%</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400">In Progress</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-w-0">
              <div className="sm:hidden py-2">
                <div className="flex items-end gap-1.5 mb-2">
                  {steps.map((step, i) => {
                    const done = allDone || i < currentStepIndex || (i === currentStepIndex && isRunning);
                    const isAct = i === currentStepIndex && isRunning;
                    const Icon = step.icon;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={clsx(
                          "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                          isAct ? "bg-teal border-teal text-white" : done ? "bg-teal/15 border-teal/40 text-teal" : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600"
                        )}>
                          <Icon size={11} strokeWidth={isAct ? 2.5 : 1.8} />
                        </div>
                        <div className={clsx("h-1 w-full rounded-full transition-all duration-500", done ? "bg-teal" : "bg-gray-200 dark:bg-white/10")} />
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Step <span className="text-teal font-medium">{Math.min(currentStepIndex + 1, steps.length)}</span>/{steps.length}
                    {" · "}
                    <span className="text-teal font-medium">{steps[Math.min(currentStepIndex, steps.length - 1)]?.label}</span>
                  </span>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">{Math.round(progress)}%</span>
                </div>
              </div>

              <div className="hidden sm:flex items-start justify-between w-full py-2">
                {steps.map((step, i) => {
                  const isActive = i === currentStepIndex && isRunning;
                  const isCompleted = allDone ? i <= currentStepIndex : i < currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={clsx(
                            "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all relative overflow-hidden",
                            isActive
                              ? "bg-teal border-teal text-white"
                              : isCompleted
                              ? "bg-teal/20 border-teal/40 text-teal"
                              : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600"
                          )}
                          style={isActive ? { boxShadow: "0 0 0 3px rgba(14,158,158,0.2), 0 0 12px rgba(14,158,158,0.4)" } : undefined}
                        >
                          {isActive && <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />}
                          <Icon size={15} strokeWidth={isActive ? 2.5 : 1.8} className="relative z-10" />
                        </div>
                        <span className={clsx("text-xs font-medium text-center leading-tight whitespace-nowrap", isActive ? "text-teal" : isCompleted ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-600")}>
                          {step.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="flex-1 mx-1 relative" style={{ marginBottom: "22px", minWidth: "12px", maxWidth: "100px" }}>
                          <div className={clsx("h-0.5 transition-all duration-500", (allDone || i < currentStepIndex) ? "bg-teal/50" : "bg-gray-200 dark:bg-white/10")} />
                          {isActive && i === currentStepIndex - 1 && <div className="absolute inset-0 h-0.5 bg-teal animate-pulse" />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-white/[0.06]">
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
            "mx-4 sm:mx-6 mt-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] transition-all duration-300 flex flex-col",
            consoleExpanded ? "lg:flex-1 lg:min-h-0 mb-0" : "shrink-0 mb-4"
          )}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className={clsx("w-2 h-2 rounded-full", isRunning ? "bg-teal animate-pulse" : "bg-gray-400")} />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Live Scan Console
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                <div className={clsx("w-1.5 h-1.5 rounded-full", isRunning ? "bg-amber-400 animate-pulse" : "bg-gray-400")} />
                {isRunning ? "Running..." : progress >= 100 ? "Completed" : "Stopped"}
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
            <div className="lg:flex-1 lg:min-h-0 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-white/[0.06]">
              <div className="flex flex-col lg:flex-1 lg:min-h-0">
                <div className="shrink-0 flex items-center border-b border-gray-100 dark:border-white/[0.06] h-[46px]">
                  <button
                    onClick={() => { setActiveTab("activity"); setVisibleLogs(4); }}
                    className={clsx(
                      "px-5 h-full text-sm font-medium transition-colors border-b-2",
                      activeTab === "activity" ? "text-teal border-teal" : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    Activity Log
                  </button>
                  <button
                    onClick={() => { setActiveTab("verification"); setVisibleLogs(4); }}
                    className={clsx(
                      "px-5 h-full text-sm font-medium transition-colors border-b-2",
                      activeTab === "verification" ? "text-teal border-teal" : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
                    )}
                  >
                    Verification Loops
                  </button>
                </div>

                <div
                  ref={logContainerRef}
                  onScroll={() => {
                    const el = logContainerRef.current;
                    if (!el) return;
                    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
                    userScrolledUp.current = !atBottom;
                  }}
                  className="overflow-y-auto max-h-[500px] lg:max-h-none lg:flex-1 lg:min-h-0 font-mono bg-white dark:bg-[#161616] space-y-3"
                  style={{ padding: "20px", paddingBottom: "32px" }}
                >
                  <AnimatePresence initial={false}>
                    {displayedLogs.map((log, i) => (
                      <motion.div
                        key={`${activeTab}-${i}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-xs leading-relaxed"
                      >
                        <span className="text-gray-400 dark:text-gray-500 mr-2">[{log.time}]</span>
                        <LogText message={log.message} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {visibleLogs < logs.length && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                      Processing...
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-1 lg:min-h-0 bg-gray-50 dark:bg-[#111111] border-t lg:border-t-0 border-gray-200 dark:border-white/[0.06]">
                <div className="shrink-0 px-5 flex items-center border-b border-gray-200 dark:border-white/[0.06] h-[46px]">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Finding Log</h3>
                </div>
                <div className="overflow-y-auto max-h-[500px] lg:max-h-none lg:flex-1 lg:min-h-0 space-y-3" style={{ padding: "20px", paddingBottom: "32px" }}>
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] p-4 hover:border-gray-300 dark:hover:border-white/10 transition-colors"
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

        <div className="mx-4 sm:mx-6 mb-5 mt-4 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] px-4 sm:px-5 py-3">
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
