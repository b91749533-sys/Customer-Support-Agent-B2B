"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      q: "Does SupportFlow use AI or LLM models?",
      a: "No. SupportFlow relies strictly on traditional software engineering best practices, deterministic workflow rules, real-time WebSockets, and structured relational database design. There are no AI hallucinations or unverified automated chatbot responses."
    },
    {
      q: "How does the real-time live chat widget work?",
      a: "Our widget connects directly to your support dashboard using standard HTML5 WebSockets and Redis pub/sub. When a customer sends a message on your site, agents see it instantly in their console with typing indicators."
    },
    {
      q: "Can I migrate my existing tickets from Freshdesk or Zendesk?",
      a: "Yes! SupportFlow provides REST APIs and bulk CSV import utilities to import your historical customer profiles, ticket histories, and knowledge base articles."
    },
    {
      q: "Is there a limit on attachment file sizes?",
      a: "Free plans support file attachments up to 10MB per ticket message. Pro and Enterprise plans support up to 50MB per file with direct S3-compatible cloud storage."
    },
    {
      q: "What role permissions are supported in Team Management?",
      a: "We support four core RBAC roles: Owner (full access & billing), Admin (tickets, team, settings), Agent (assigned tickets & internal notes), and Viewer (read-only analytics)."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex w-full items-center justify-between p-6 text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                    openIdx === idx ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
