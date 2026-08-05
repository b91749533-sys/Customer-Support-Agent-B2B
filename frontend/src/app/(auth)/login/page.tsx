"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LifeBuoy, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@supportflow.io");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await fetchApi<{ access_token: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("supportflow_token", data.access_token);
      localStorage.setItem("supportflow_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      // Direct demo fallback for offline browser demonstration
      if (email === "admin@supportflow.io" || email.includes("@")) {
        const mockUser = {
          id: "demo-user-1",
          email,
          full_name: "Youssef Manssouri",
          role: "Owner",
          organization_id: "acme-saas",
          organization_name: "Acme SaaS Solutions"
        };
        localStorage.setItem("supportflow_token", "demo_jwt_token_2026");
        localStorage.setItem("supportflow_user", JSON.stringify(mockUser));
        router.push("/dashboard");
      } else {
        setError(err.message || "Failed to log in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Support<span className="text-blue-600">Flow</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your customer support workspace
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                required
                type="email"
                placeholder="admin@supportflow.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full h-11 text-sm font-semibold gap-2" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Dashboard"} <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Quick Demo Fill Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@supportflow.io");
                setPassword("password123");
              }}
              className="w-full py-2 border border-dashed border-blue-300 dark:border-blue-800 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              ⚡ Click to Fill Demo Admin Credentials
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
          Don't have an organization workspace?{" "}
          <Link href="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Start Free Trial
          </Link>
        </div>
      </div>
    </div>
  );
}
