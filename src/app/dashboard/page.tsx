"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Columns,
  Plus,
  Download,
  StopCircle,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  TriangleAlert,
  ScanSearch,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SeverityBadge } from "@/components/ui/Badge";
import { StatusChip } from "@/components/ui/StatusChip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { scans, dashboardStats, severityStats } from "@/data/mock";
import type { ScanStatus, ScanType } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import clsx from "clsx";


const PAGE_SIZE = 10;

const severityIcons = {
  critical: AlertOctagon,
  high: TriangleAlert,
  medium: TriangleAlert,
  low: ScanSearch,
};

const severityColors = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-amber-400",
  low: "text-blue-400",
};

export default function DashboardPage() {
  const router = useRouter();
  const { toasts, addToast, dismissToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScanStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ScanType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [newScanName, setNewScanName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return scans.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchType = typeFilter === "all" || s.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [search, statusFilter, typeFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  function handleNewScan() {
    if (!newScanName.trim()) {
      addToast("Please enter a scan name.", "warning");
      return;
    }
    setShowNewScanModal(false);
    setNewScanName("");
    addToast(`Scan "${newScanName}" has been created successfully.`, "success");
  }

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-white dark:bg-[#161616]">
        <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          <div className="flex items-center gap-1.5 text-xs overflow-hidden shrink min-w-0">
            <span className="text-gray-400 dark:text-gray-500 whitespace-nowrap hidden sm:block">Scan /</span>
            <span className="text-teal font-medium whitespace-nowrap">Dashboard</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={() => addToast("Exporting report…", "info")} className="hidden sm:flex">
              Export Report
            </Button>
            <Button variant="danger" size="sm" icon={<StopCircle size={14} />} onClick={() => addToast("All active scans have been stopped.", "warning")} className="hidden sm:flex">
              Stop Scan
            </Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-shrink-0 px-8 sm:px-6 py-2.5 sm:py-3.5 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] overflow-x-auto">
          <div className="flex items-center justify-between gap-x-4 sm:gap-x-6 text-xs whitespace-nowrap">
            <StatItem label="Org" value={dashboardStats.org} />
            <Divider />
            <StatItem label="Owner" value={dashboardStats.owner} />
            <Divider />
            <StatItem label="Total Scans" value={String(dashboardStats.totalScans)} />
            <Divider />
            <StatItem label="Scheduled" value={String(dashboardStats.scheduled)} />
            <Divider />
            <StatItem label="Rescans" value={String(dashboardStats.rescans)} />
            <Divider />
            <StatItem label="Failed" value={String(dashboardStats.failedScans)} />
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 ml-6">
              <RefreshCw className="text-teal dark:text-teal-hover" size={12} />
              <span>{dashboardStats.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-white/[0.06] border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          {(["critical", "high", "medium", "low"] as const).map((level) => {
            const stat = severityStats[level];
            const Icon = severityIcons[level];
            return (
              <div key={level} className="group px-3 sm:px-5 lg:px-6 py-3 sm:py-5 cursor-pointer">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-[11px] sm:text-sm font-medium text-gray-500 dark:text-gray-400 capitalize group-hover:translate-x-1 transition-transform duration-300">
                    {level} <span className="hidden sm:inline">Severity</span>
                  </span>
                  <div className={clsx("p-1 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:-translate-x-1 transition-transform duration-300", severityColors[level])}>
                    <Icon size={13} />
                  </div>
                </div>
                <div className="flex items-end gap-2 group-hover:translate-x-1 transition-transform duration-300">
                  <span className="text-xl sm:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white leading-none">
                    {stat.count}
                  </span>
                  <div className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-medium pb-0.5 ${stat.direction === "up" ? "text-red-400" : "text-green-400"}`}>
                    {stat.direction === "up" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    <span className="sm:hidden">+{stat.change}%</span>
                    <span className="hidden sm:inline">+{stat.change}% than yesterday</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3 bg-[#F5F5F5] dark:bg-[#111111]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search scans..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-teal transition-colors"
              />
            </div>
            <Button variant="outline" size="sm" icon={<Filter size={13} />} onClick={() => setShowFilters((v) => !v)} className="shrink-0 text-xs">
              Filter
            </Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={() => setShowNewScanModal(true)} className="shrink-0 text-xs">
              <span className="hidden sm:inline">New scan</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          {showFilters && (
            <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as ScanStatus | "all");
                    setPage(1);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 outline-none focus:border-teal"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="failed">Failed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value as ScanType | "all");
                    setPage(1);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 outline-none focus:border-teal"
                >
                  <option value="all">All</option>
                  <option value="Greybox">Greybox</option>
                  <option value="Blackbox">Blackbox</option>
                  <option value="Whitebox">Whitebox</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSearch("");
                  setPage(1);
                }}
                className="text-xs text-teal hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 pb-4 sm:pb-6 bg-[#F5F5F5] dark:bg-[#111111] pt-1">
          <div className="flex-1 min-h-0 rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616] flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="sticky top-0 bg-white dark:bg-[#161616] z-10">
                  <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                    <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      Scan Name
                    </th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      Type
                    </th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Progress
                    </th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Vulnerability
                    </th>
                    <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      Last Scan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-gray-400 dark:text-gray-500">
                        No scans match your current filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((scan) => (
                      <tr
                        key={scan.id}
                        onClick={() => router.push(`/scan/${scan.id}`)}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      >
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3.5">
                          <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-teal transition-colors text-xs sm:text-sm">
                            {scan.name}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {scan.type}
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                          <StatusChip status={scan.status} />
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 min-w-[120px] sm:min-w-[160px]">
                          <ProgressBar progress={scan.progress} status={scan.status} />
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                            {scan.vulnerabilities.critical > 0 && (
                              <SeverityBadge severity="critical" count={scan.vulnerabilities.critical} />
                            )}
                            {scan.vulnerabilities.high > 0 && (
                              <SeverityBadge severity="high" count={scan.vulnerabilities.high} />
                            )}
                            {scan.vulnerabilities.medium > 0 && (
                              <SeverityBadge severity="medium" count={scan.vulnerabilities.medium} />
                            )}
                            {scan.vulnerabilities.low > 0 && (
                              <SeverityBadge severity="low" count={scan.vulnerabilities.low} />
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-right text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">
                          {scan.lastScan}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 border-t border-gray-100 dark:border-white/[0.06]">
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Scans
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-light tracking-tight text-gray-900 dark:text-white mb-1.5">New Scan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Enter a name for the new scan target.
            </p>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Web App Servers"
              value={newScanName}
              onChange={(e) => setNewScanName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewScan()}
              className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal transition-colors mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowNewScanModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleNewScan}>
                Create Scan
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppLayout>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-400 dark:text-gray-500">{label}:</span>
      <span className="font-semibold text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-3.5 w-px bg-gray-200 dark:bg-white/10" />;
}
