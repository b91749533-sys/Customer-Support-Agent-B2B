"use client";

import React from "react";
import Link from "next/link";
import { LifeBuoy, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <LifeBuoy className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Support<span className="text-blue-600 dark:text-blue-400">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Production-ready B2B customer support management platform for businesses. Unifying support tickets, real-time live chat, KB docs, and CRM.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="#features" className="hover:text-blue-600">Ticket Engine</Link></li>
              <li><Link href="#features" className="hover:text-blue-600">Live Chat Widget</Link></li>
              <li><Link href="#features" className="hover:text-blue-600">Knowledge Base</Link></li>
              <li><Link href="#features" className="hover:text-blue-600">Reports & CSAT</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="#faq" className="hover:text-blue-600">Documentation</Link></li>
              <li><Link href="#faq" className="hover:text-blue-600">REST API Specs</Link></li>
              <li><Link href="#faq" className="hover:text-blue-600">System Status</Link></li>
              <li><Link href="#faq" className="hover:text-blue-600">Security Audit</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="#contact" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Footer Attribution */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} SupportFlow Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
            <span>Built by</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">Youssef Manssouri</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
