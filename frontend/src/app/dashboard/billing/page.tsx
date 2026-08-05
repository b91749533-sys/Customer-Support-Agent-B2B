"use client";

import React, { useState } from "react";
import { CreditCard, Check, Sparkles, Download, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState("Pro");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const invoices = [
    { id: "INV-109281", date: "Aug 01, 2026", amount: "$49.00", status: "Paid", plan: "Pro Plan (Monthly)", pdf: "#" },
    { id: "INV-108172", date: "Jul 01, 2026", amount: "$49.00", status: "Paid", plan: "Pro Plan (Monthly)", pdf: "#" },
    { id: "INV-107455", date: "Jun 01, 2026", amount: "$49.00", status: "Paid", plan: "Pro Plan (Monthly)", pdf: "#" }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="h-7 w-7 text-blue-600" /> Billing & Subscription Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your subscription tier, agent seat allocations, Stripe integration, and invoice history.
          </p>
        </div>
        <Badge variant="success" className="h-8 px-3 text-xs font-bold gap-1.5">
          <ShieldCheck className="h-4 w-4" /> Stripe Integration Connected
        </Badge>
      </div>

      {/* Current Plan Overview & Usage Limits Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-2 border-blue-500/20">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Active Subscription: Pro SaaS Plan</CardTitle>
                <CardDescription>Billed {billingCycle} • Renews on Sep 01, 2026</CardDescription>
              </div>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">$49<span className="text-xs text-slate-400 font-normal">/mo</span></span>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6 text-xs">
            {/* Usage Progress bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Agent Seat Allocation</span>
                  <span>3 / 10 Seats Used</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[30%] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Monthly Support Tickets</span>
                  <span>420 / 5,000 Tickets</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[8.4%] rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between p-6">
          <div>
            <div className="text-xs font-bold uppercase text-slate-400">Payment Method</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-10 w-14 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-xs font-mono">
                VISA
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">•••• •••• •••• 4242</div>
                <div className="text-[10px] text-slate-400">Expires 12/28</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
              Update Credit Card
            </Button>
          </div>
        </Card>
      </div>

      {/* Invoice History Table */}
      <Card>
        <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold">Stripe Invoice History</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Billing Date</th>
                <th className="p-3.5">Plan Tier</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">PDF Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">{inv.id}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{inv.date}</td>
                  <td className="p-3.5 font-medium">{inv.plan}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">{inv.amount}</td>
                  <td className="p-3.5"><Badge variant="success">{inv.status}</Badge></td>
                  <td className="p-3.5 text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-[11px]">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
