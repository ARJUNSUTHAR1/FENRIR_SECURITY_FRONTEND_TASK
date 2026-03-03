"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  FolderKanban,
  ScanLine,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Scans", href: "/scan", icon: ScanLine },
  { label: "Schedule", href: "/schedule", icon: Calendar },
];

const bottomItems = [
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = pathname === href || (href === "/dashboard" && pathname.startsWith("/scan"));
    return (
      <Link
        href={href}
        onClick={onClose}
        className={clsx(
          "flex items-center gap-3 px-3 py-2.5 rounded-3xl text-sm font-normal tracking-wide transition-colors",
          active
            ? "bg-teal/15 text-teal"
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/5"
        )}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-full w-[220px] flex flex-col justify-between border-r bg-white dark:bg-[#0F0F0F] border-gray-200 dark:border-white/[0.06] transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="">
        <div className="flex items-center justify-start px-5 py-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
            </div>
            <span className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">aps</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="px-3 space-y-0.8 mb-3 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>
        
        <div className="border-t border-gray-200 dark:border-white/[0.06]"></div>

        <div className="px-3 pb-2 space-y-0.8 mt-3">
          {bottomItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>
        </div>

        <div className="px-4 py-4 border-t border-gray-200 dark:border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">admin@edu.com</p>
              <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400">Security Lead</p>
            </div>
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
