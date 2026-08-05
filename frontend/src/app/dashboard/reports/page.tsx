"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Clock, Star, Users, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const ticketVolumeData = [
    { day: "Mon", created: 24, resolved: 22, csat: 4.8 },
    { day: "Tue", created: 30, resolved: 28, csat: 4.9 },
    { day: "Wed", created: 45, resolved: 40, csat: 4.7 },
    { day: "Thu", created: 38, resolved: 36, csat: 5.0 },
    { day: "Fri", created: 52, resolved: 48, csat: 4.9 },
    { day: "Sat", created: 18, resolved: 20, csat: 4.8 },
    { day: "Sun", created: 14, resolved: 15, csat: 5.0 },
  ];

  const agentPerformance = [
    { name: "Youssef Manssouri", resolved: 68, avgTime: "12m", csat: 4.9 },
    { name: "Sarah Jenkins", resolved: 84, avgTime: "14m", csat: 4.8 },
    { name: "Alex Morgan", resolved: 52, avgTime: "16m", csat: 4.7 },
  ];

  const categoryDistribution = [
    { name: "Technical Issue", count: 120, color: "#3b82f6" },
    { name: "Billing & Account", count: 75, color: "#6366f1" },
    { name: "API Integration", count: 45, color: "#10b981" },
    { name: "Feature Request", count: 30, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-blue-600" /> Executive Analytics & SLA Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track daily volume, SLA resolution compliance, CSAT metrics, and team performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
          </select>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
            <Download className="h-4 w-4" /> Export CSV Report
          </Button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="text-xs font-semibold text-slate-400">Total Tickets Handled</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">271</div>
          <div className="text-xs text-emerald-500 font-semibold mt-1">↑ 18% vs last week</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold text-slate-400">First Response SLA</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">14.2 min</div>
          <div className="text-xs text-emerald-500 font-semibold mt-1">98.2% within SLA</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold text-slate-400">Average Resolution Time</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">2.4 hours</div>
          <div className="text-xs text-emerald-500 font-semibold mt-1">↓ 45 mins faster</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs font-semibold text-slate-400">Overall CSAT Rating</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">4.9 / 5.0</div>
          <div className="text-xs text-indigo-500 font-semibold mt-1">98.4% Positive</div>
        </Card>
      </div>

      {/* Ticket Volume & Resolution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tickets Per Day & Resolution Comparison</CardTitle>
          <CardDescription>Daily ticket creation vs. closed tickets</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ticketVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b", color: "#fff" }} />
              <Bar dataKey="created" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Created Tickets" />
              <Bar dataKey="resolved" fill="#10b981" radius={[4, 4, 0, 0]} name="Resolved Tickets" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Performance Table & Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Support Agent Performance Breakdown</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Agent Name</th>
                    <th className="p-3.5">Resolved Tickets</th>
                    <th className="p-3.5">Avg Response Time</th>
                    <th className="p-3.5">CSAT Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {agentPerformance.map((ag, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{ag.name}</td>
                      <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">{ag.resolved} tickets</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{ag.avgTime}</td>
                      <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">★ {ag.csat} / 5.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Support Request Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-64 flex flex-col justify-between">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count">
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                {categoryDistribution.map((cat, i) => (
                  <div key={i} className="flex items-center gap-1.5 truncate">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600 dark:text-slate-400 truncate">{cat.name} ({cat.count})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
