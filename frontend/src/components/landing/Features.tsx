"use client";

import React from "react";
import { Ticket, MessageSquare, BookOpen, BarChart3, Users, ShieldCheck, Zap, Layers } from "lucide-react";

export function Features() {
  const featuresList = [
    {
      icon: <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      title: "Omnichannel Ticket Engine",
      description: "Manage, filter, assign, reassign, and merge support tickets across your organization. Includes custom statuses, priorities, internal notes, and attachments."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Real-Time Live Chat Widget",
      description: "Embeddable website chat widget connected live to your support team via WebSockets. Instant typing indicators, agent transfer, and one-click convert chat to ticket."
    },
    {
      icon: <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Knowledge Base Publisher",
      description: "Publish public or internal help documentation. Organize articles into categorized trees, track views, and collect helpfulness feedback."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Actionable Analytics & CSAT",
      description: "Monitor SLA response times, daily ticket volumes, customer satisfaction (CSAT) scores, category distributions, and individual agent performance."
    },
    {
      icon: <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Customer CRM Timeline",
      description: "Complete 360-degree customer profile context. Track conversation histories, company details, internal account notes, and key touchpoints."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
      title: "Role-Based Access Control (RBAC)",
      description: "Granular permission security model with Owner, Admin, Agent, and Viewer roles. Comprehensive security audit logs and CSRF/XSS protection."
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            <Layers className="h-4 w-4" /> Comprehensive Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Built for High-Performing Customer Support Teams
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            SupportFlow provides everything your support engineers and customer success teams need to deliver world-class service.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className="group rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-200"
            >
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
