"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Free Starter",
      description: "Perfect for early-stage startups testing customer support.",
      price: "$0",
      period: "forever",
      features: [
        "Up to 2 Agent Seats",
        "100 Tickets / month",
        "Basic Ticket Management",
        "Public Knowledge Base",
        "Standard Email Notifications",
        "Community Support"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Pro SaaS",
      description: "Designed for growing teams needing real-time live chat and CRM.",
      price: annual ? "$39" : "$49",
      period: "per seat / mo",
      features: [
        "Up to 10 Agent Seats",
        "Unlimited Tickets & Storage",
        "Real-Time WebSocket Live Chat",
        "Merge Tickets & Bulk Actions",
        "Full Customer CRM Profiles",
        "Advanced Analytics & CSAT",
        "Custom Branding & Logo Upload",
        "Priority Email & Chat Support"
      ],
      cta: "Start 14-Day Free Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      description: "For large enterprise organizations requiring custom SLAs and RBAC.",
      price: annual ? "$89" : "$99",
      period: "per seat / mo",
      features: [
        "Unlimited Agent Seats",
        "Unlimited Tickets & Knowledge Base",
        "Dedicated Account Manager",
        "Custom RBAC Permission Matrix",
        "Full Security Audit Logging",
        "99.99% Uptime Guarantee SLA",
        "Stripe Billing & Invoicing Integration",
        "24/7 Phone & Slack Support"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Predictable Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            Simple Plans for Every Stage of Growth
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            No hidden fees. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xs">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                !annual
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 ${
                annual
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Annual Billing <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">SAVE 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 ${
                plan.highlight
                  ? "border-2 border-blue-600 dark:border-blue-500 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 scale-105 z-10"
                  : "border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> MOST POPULAR
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 h-10">{plan.description}</p>
                <div className="mt-6 mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/{plan.period}</span>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link href="/signup">
                  <Button
                    variant={plan.highlight ? "primary" : "outline"}
                    className="w-full h-11 text-sm font-semibold"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
