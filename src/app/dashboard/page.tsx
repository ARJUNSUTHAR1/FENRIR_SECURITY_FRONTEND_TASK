"use client";

import { useState, useMemo } from "react";
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

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScanStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ScanType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [newScanName, setNewScanName] = useState("");

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

  return (
    <AppLayout>
      <div className="min-h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 dark:text-gray-500">Scan</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
              Home
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
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
              onClick={() => addToast("Exporting report…", "info")}
            >
              Export Report
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<StopCircle size={14} />}
              onClick={() => addToast("All active scans have been stopped.", "warning")}
            >
              Stop Scan
            </Button>

            <ThemeToggle />
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
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
            <StatItem label="Failed Scans" value={String(dashboardStats.failedScans)} />
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 ml-auto">
              <RefreshCw size={13} />
              <span className="text-xs">{dashboardStats.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-white/[0.06] border-b border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#161616]">
          {(["critical", "high", "medium", "low"] as const).map((level) => {
            const stat = severityStats[level];
            const Icon = severityIcons[level];
            return (
              <div key={level} className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {level} Severity
                  </span>
                  <div className={clsx("p-1.5 rounded-lg bg-gray-100 dark:bg-white/5", severityColors[level])}>
                    <Icon  size={16} />
                  </div>
                </div>
                <div className="flex items-end gap-2.5">
                  <span className="text-3xl font-normal tracking-tight text-gray-900 dark:text-white leading-none">
                    {stat.count}
                  </span>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-medium pb-0.5 ${
                      stat.direction === "up" ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {stat.direction === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    <span>+{stat.change}% increase than yesterday</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 pt-5 pb-4 bg-[#F5F5F5] dark:bg-[#111111]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search scans by name or type..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-teal transition-colors"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              icon={<Filter size={14} />}
              onClick={() => setShowFilters((v) => !v)}
            >
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Columns size={14} />}
              onClick={() => addToast("Column customization coming soon.", "info")}
            >
              Column
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setShowNewScanModal(true)}
            >
              New scan
            </Button>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
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

        <div className="px-6 pb-6 bg-[#F5F5F5] dark:bg-[#111111]">
          <div className="rounded-xl border border-gray-200 dark:border-white/[0.06] overflow-hidden bg-white dark:bg-[#161616]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/[0.06]">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      Scan Name
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      Type
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Progress
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Vulnerability
                    </th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">
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
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-teal transition-colors">
                            {scan.name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">
                          {scan.type}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusChip status={scan.status} />
                        </td>
                        <td className="px-4 py-3.5 min-w-[160px]">
                          <ProgressBar progress={scan.progress} status={scan.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
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
                        <td className="px-5 py-3.5 text-right text-gray-400 dark:text-gray-500 text-xs whitespace-nowrap">
                          {scan.lastScan}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-white/[0.06]">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Scans
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={14} />
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
