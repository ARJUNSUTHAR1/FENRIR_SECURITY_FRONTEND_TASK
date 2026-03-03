"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  ScanLine,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SeverityBadge } from "@/components/ui/Badge";
import { StatusChip } from "@/components/ui/StatusChip";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { scans } from "@/data/mock";
import type { ScanStatus, ScanType } from "@/types";

const PAGE_SIZE = 10;

export default function ScansPage() {
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
    addToast(`Scan "${newScanName}" created successfully.`, "success");
  }

  return (
    <AppLayout>
      <div className="h-full flex flex-col bg-white dark:bg-[#161616]">
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <ScanLine size={18} className="text-teal" />
            <h1 className="text-base font-medium text-gray-900 dark:text-white">All Scans</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setShowNewScanModal(true)}
          >
            New scan
          </Button>
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-3 bg-[#F5F5F5] dark:bg-[#111111]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative flex-1 min-w-[150px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search scans..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-teal transition-colors"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Filter size={14} />}
              onClick={() => setShowFilters((v) => !v)}
              className="text-xs"
            >
              Filter
            </Button>
          </div>

          {showFilters && (
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as ScanStatus | "all"); setPage(1); }}
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
                  onChange={(e) => { setTypeFilter(e.target.value as ScanType | "all"); setPage(1); }}
                  className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 outline-none focus:border-teal"
                >
                  <option value="all">All</option>
                  <option value="Greybox">Greybox</option>
                  <option value="Blackbox">Blackbox</option>
                  <option value="Whitebox">Whitebox</option>
                </select>
              </div>
              <button
                onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setSearch(""); setPage(1); }}
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
                    <th className="text-left px-3 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Scan Name</th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Progress</th>
                    <th className="text-left px-2 sm:px-4 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Vulnerability</th>
                    <th className="text-right px-3 sm:px-5 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">Last Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-gray-400 dark:text-gray-500 text-xs">
                        No scans match your filters.
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
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{scan.type}</td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5"><StatusChip status={scan.status} /></td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5 min-w-[120px] sm:min-w-[160px]">
                          <ProgressBar progress={scan.progress} status={scan.status} />
                        </td>
                        <td className="px-2 sm:px-4 py-2.5 sm:py-3.5">
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                            {scan.vulnerabilities.critical > 0 && <SeverityBadge severity="critical" count={scan.vulnerabilities.critical} />}
                            {scan.vulnerabilities.high > 0 && <SeverityBadge severity="high" count={scan.vulnerabilities.high} />}
                            {scan.vulnerabilities.medium > 0 && <SeverityBadge severity="medium" count={scan.vulnerabilities.medium} />}
                            {scan.vulnerabilities.low > 0 && <SeverityBadge severity="low" count={scan.vulnerabilities.low} />}
                          </div>
                        </td>
                        <td className="px-3 sm:px-5 py-2.5 sm:py-3.5 text-right text-gray-400 dark:text-gray-500 text-[10px] sm:text-xs whitespace-nowrap">{scan.lastScan}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex-shrink-0 flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 border-t border-gray-100 dark:border-white/[0.06]">
              <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Scans
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={12} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={12} />
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Enter a name for the new scan target.</p>
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
              <Button variant="outline" onClick={() => setShowNewScanModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleNewScan}>Create Scan</Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppLayout>
  );
}
