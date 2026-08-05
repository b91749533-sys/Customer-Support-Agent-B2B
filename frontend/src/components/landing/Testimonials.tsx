"use client";

import React from "react";
import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      quote: "SupportFlow replaced three fragmented tools for us. Our agent response time dropped by 65% in the first month.",
      author: "Elena Rostova",
      role: "VP of Customer Experience",
      company: "CloudScale Tech",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80"
    },
    {
      quote: "The live chat widget is lightning fast. Converting live conversations into structured support tickets with one click is a game changer.",
      author: "Marcus Vance",
      role: "Head of Operations",
      company: "Logistics Global",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=128&q=80"
    },
    {
      quote: "The UI design is so polished and responsive. Our support agents actually enjoy spending their workday inside SupportFlow.",
      author: "Sarah Jenkins",
      role: "Support Operations Lead",
      company: "Nexus Corp",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=128&q=80"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Social Proof</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            Loved by Support Teams Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rev.author}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{rev.role}, {rev.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
