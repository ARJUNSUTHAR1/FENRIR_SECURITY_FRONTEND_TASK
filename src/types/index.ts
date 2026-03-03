export type SeverityLevel = "critical" | "high" | "medium" | "low";
export type ScanStatus = "completed" | "scheduled" | "failed" | "in_progress";
export type ScanType = "Greybox" | "Blackbox" | "Whitebox";
export type ScanStep = "spidering" | "mapping" | "testing" | "validating" | "reporting";

export interface VulnerabilityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface Scan {
  id: string;
  name: string;
  type: ScanType;
  status: ScanStatus;
  progress: number;
  vulnerabilities: VulnerabilityCounts;
  lastScan: string;
  target?: string;
  startedAt?: string;
  credentials?: number;
  files?: string;
  checklists?: string;
  currentStep?: ScanStep;
}

export interface LogEntry {
  time: string;
  message: string;
}

export interface Finding {
  id: string;
  severity: SeverityLevel;
  title: string;
  endpoint: string;
  description: string;
  time: string;
}

export interface DashboardStats {
  org: string;
  owner: string;
  totalScans: number;
  scheduled: number;
  rescans: number;
  failedScans: number;
  lastUpdated: string;
}

export interface SeverityStats {
  critical: { count: number; change: number; direction: "up" | "down" };
  high: { count: number; change: number; direction: "up" | "down" };
  medium: { count: number; change: number; direction: "up" | "down" };
  low: { count: number; change: number; direction: "up" | "down" };
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}
