"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Play, ShieldCheck, CheckCircle2, MessageSquare, Ticket, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/15 dark:bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/60 bg-blue-50/80 dark:bg-blue-950/40 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-md mb-8">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>SupportFlow B2B SaaS Platform 2.0</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          Customer Support Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">Simple.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          The modern support management workspace for high-growth businesses. Unify support tickets, live chat, customer CRM, and knowledge bases in one seamless interface.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-13 px-8 text-base font-semibold shadow-lg shadow-blue-500/25 gap-2">
              Start Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-13 px-8 text-base font-semibold gap-2 border-slate-300 dark:border-slate-700">
              <Play className="h-4 w-4 fill-current" /> Request Demo
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-blue-500" /> Enterprise SLA & RBAC</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 14-day free trial</span>
        </div>

        {/* Hero Interactive App Mockup Graphic */}
        <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-950 p-4 sm:p-6 text-left shadow-inner overflow-hidden">
            
            {/* Window bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-mono text-slate-400">app.supportflow.io/dashboard</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Server Online
                </span>
              </div>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Open Tickets</span>
                  <Ticket className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">42</div>
                <div className="text-xs text-emerald-400 mt-1">↓ 12% from yesterday</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Avg Response Time</span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">14.5 mins</div>
                <div className="text-xs text-emerald-400 mt-1">SLA target met (&lt; 30m)</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Customer Satisfaction</span>
                  <Users className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">98.4%</div>
                <div className="text-xs text-emerald-400 mt-1">4.9 / 5.0 rating (420 reviews)</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
                  <span>Live Chat Sessions</span>
                  <MessageSquare className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">8 Active</div>
                <div className="text-xs text-blue-400 mt-1">Real-time WebSocket stream</div>
              </div>
            </div>

            {/* Ticket Board Preview */}
            <div className="mt-4 bg-slate-900 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                <span>Recent Priority Tickets</span>
                <span className="text-blue-400 cursor-pointer hover:underline">View All Tickets →</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">#1003</span>
                    <span className="text-white font-medium">Webhook integration failing with HTTP 403 Forbidden</span>
                    <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">URGENT</span>
                  </div>
                  <span className="text-slate-400">Assigned: Youssef Manssouri</span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400">#1001</span>
                    <span className="text-white font-medium">Unable to export monthly analytics report to CSV</span>
                    <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">HIGH</span>
                  </div>
                  <span className="text-slate-400">Assigned: Sarah Jenkins</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
