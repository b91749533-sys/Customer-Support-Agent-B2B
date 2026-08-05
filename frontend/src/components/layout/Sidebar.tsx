"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LifeBuoy,
  LayoutDashboard,
  Ticket,
  Users,
  MessageSquare,
  BookOpen,
  UserCheck,
  BarChart3,
  CreditCard,
  Settings,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tickets Engine", href: "/dashboard/tickets", icon: Ticket, badge: "4" },
    { name: "Customer CRM", href: "/dashboard/customers", icon: Users },
    { name: "Live Chat Console", href: "/dashboard/live-chat", icon: MessageSquare, badge: "Live", badgeColor: "bg-emerald-500" },
    { name: "Knowledge Base", href: "/dashboard/knowledge-base", icon: BookOpen },
    { name: "Team & RBAC", href: "/dashboard/team", icon: UserCheck },
    { name: "Analytics Reports", href: "/dashboard/reports", icon: BarChart3 },
    { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Support<span className="text-blue-600">Flow</span>
            </span>
          </Link>
        </div>

        {/* Workspace Indicator */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
          <div className="truncate">
            <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Workspace</div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Acme SaaS Solutions</div>
          </div>
          <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">Pro</span>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs",
                    item.badgeColor || "bg-blue-600"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Attribution Card */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-200/60 dark:border-slate-800 text-center">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">SupportFlow Platform</div>
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">Built by Youssef Manssouri</div>
        </div>
      </div>
    </aside>
  );
}
