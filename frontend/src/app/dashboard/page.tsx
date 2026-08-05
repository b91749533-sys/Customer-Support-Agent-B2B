"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Plus,
  Filter,
  Users,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { fetchApi } from "@/lib/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

export default function DashboardOverviewPage() {
  const [metrics, setMetrics] = useState<any>({
    open_tickets: 42,
    closed_tickets: 184,
    pending_tickets: 12,
    avg_response_time_minutes: 14.5,
    csat_score: 4.9,
    tickets_today: 18,
    resolution_rate: 94.2,
    tickets_trend: [
      { date: "Aug 01", created: 12, resolved: 10 },
      { date: "Aug 02", created: 15, resolved: 14 },
      { date: "Aug 03", created: 22, resolved: 18 },
      { date: "Aug 04", created: 18, resolved: 20 },
      { date: "Aug 05", created: 25, resolved: 22 },
      { date: "Aug 06", created: 19, resolved: 16 },
      { date: "Aug 07", created: 28, resolved: 26 },
    ],
    category_breakdown: [
      { name: "Technical Issue", value: 45, color: "#3b82f6" },
      { name: "Billing & Account", value: 25, color: "#6366f1" },
      { name: "General Support", value: 20, color: "#10b981" },
      { name: "Feature Request", value: 10, color: "#f59e0b" },
    ],
    agent_workload: [
      { agent: "Youssef Manssouri", assigned_tickets: 14 },
      { agent: "Sarah Jenkins", assigned_tickets: 18 },
      { agent: "Alex Morgan", assigned_tickets: 10 },
    ]
  });

  useEffect(() => {
    async function loadMetrics() {
      try {
        const data = await fetchApi("/reports/overview");
        if (data) setMetrics(data);
      } catch (err) {
        // Fallback to pre-populated state if offline
      }
    }
    loadMetrics();
  }, []);

  const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry and operational metrics for Acme SaaS Solutions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/tickets">
            <Button variant="primary" className="gap-2 text-xs font-bold">
              <Plus className="h-4 w-4" /> Create Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Open Tickets</span>
              <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Ticket className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.open_tickets}</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> +4 today
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Closed Tickets</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.closed_tickets}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {metrics.resolution_rate}% resolution rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Response SLA</span>
              <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.avg_response_time_minutes}m</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Target &lt; 30m
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CSAT Score</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Star className="h-5 w-5 fill-current" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.csat_score} <span className="text-lg text-slate-400">/ 5.0</span></span>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                420 Customer Ratings
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ticket Trends Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Ticket Volume & Resolution Trends</CardTitle>
                <CardDescription>Daily comparison of created vs. resolved tickets over the last 7 days</CardDescription>
              </div>
              <Badge variant="outline">Last 7 Days</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.tickets_trend || []}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b", color: "#fff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCreated)" name="Created Tickets" />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved Tickets" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tickets by Category</CardTitle>
            <CardDescription>Distribution across support request types</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex flex-col justify-between">
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={metrics.category_breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(metrics.category_breakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b", color: "#fff", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {(metrics.category_breakdown || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5 truncate">
                  <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline & Agent Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Support Activity</CardTitle>
                <CardDescription>Live stream of ticket creation, status updates, and agent assignments</CardDescription>
              </div>
              <Link href="/dashboard/tickets">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  View All <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                  #1003
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                    <span>Webhook integration failing with HTTP 403 Forbidden</span>
                    <Badge variant="destructive">URGENT</Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Customer: Marcus Vance (Logistics Global) • Assigned to Youssef Manssouri</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  #1001
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                    <span>Unable to export monthly analytics report to CSV</span>
                    <Badge variant="warning">HIGH</Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Agent Sarah Jenkins added an internal investigation note.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  #1004
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                    <span>Requesting custom role permission matrix for auditors</span>
                    <Badge variant="success">RESOLVED</Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Ticket closed with 5-Star CSAT feedback rating from David Miller.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Workload Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Workload Distribution</CardTitle>
            <CardDescription>Assigned active tickets per team member</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(metrics.agent_workload || []).map((agent: any, idx: number) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-900 dark:text-slate-100">{agent.agent}</span>
                  <span className="text-slate-500">{agent.assigned_tickets} active tickets</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (agent.assigned_tickets / 20) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
