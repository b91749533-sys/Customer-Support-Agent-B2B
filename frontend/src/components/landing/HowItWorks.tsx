"use client";

import React from "react";
import { UserPlus, Settings, CheckCircle } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Create Your Organization Workspace",
      description: "Sign up in 30 seconds. Set up your custom brand colors, logo, support email, and invite your support agents with defined RBAC roles."
    },
    {
      number: "02",
      icon: <Settings className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Embed Live Chat & Connect Channels",
      description: "Paste a single line of JavaScript onto your web app or site to launch our real-time WebSocket live chat widget instantly."
    },
    {
      number: "03",
      icon: <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Resolve Tickets & Measure CSAT",
      description: "Manage incoming tickets, write internal team notes, publish self-serve KB documentation, and watch your customer satisfaction scores soar."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Simple Onboarding</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            Get Up and Running in Minutes
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            No complex deployments or lengthy training required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-300 dark:text-slate-700 font-mono">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
