"use client";

import React, { useState } from "react";
import { Settings as SettingsIcon, Building, Palette, Mail, Shield, Save, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [orgSettings, setOrgSettings] = useState({
    name: "Acme SaaS Solutions",
    support_email: "support@acmesaas.io",
    brand_color: "#2563eb",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80",
    notify_on_assigned: true,
    notify_on_reply: true,
    notify_on_closed: true,
    session_timeout_hours: "24"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="h-7 w-7 text-blue-600" /> Organization Settings & Branding
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your workspace branding, email routing, notification policies, and security settings.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Organization settings updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" /> Company Profile
            </CardTitle>
            <CardDescription>Public organization information shown to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <Input
                  value={orgSettings.name}
                  onChange={(e) => setOrgSettings({ ...orgSettings, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Support Inbound Email</label>
                <Input
                  type="email"
                  value={orgSettings.support_email}
                  onChange={(e) => setOrgSettings({ ...orgSettings, support_email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding & Logo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-5 w-5 text-indigo-600" /> Branding & Theme Customization
            </CardTitle>
            <CardDescription>Custom primary color and organization logo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex items-center gap-4">
              <img src={orgSettings.logo_url} alt="Logo" className="h-16 w-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
              <div>
                <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
                  <Upload className="h-3.5 w-3.5" /> Upload New Logo
                </Button>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or SVG up to 2MB (recommended size 512x512)</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Primary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={orgSettings.brand_color}
                  onChange={(e) => setOrgSettings({ ...orgSettings, brand_color: e.target.value })}
                  className="h-10 w-14 rounded cursor-pointer border-none bg-transparent"
                />
                <Input
                  value={orgSettings.brand_color}
                  onChange={(e) => setOrgSettings({ ...orgSettings, brand_color: e.target.value })}
                  className="w-36 font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="h-5 w-5 text-emerald-600" /> Notification Dispatch Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={orgSettings.notify_on_assigned}
                onChange={(e) => setOrgSettings({ ...orgSettings, notify_on_assigned: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Email agent when a new ticket is assigned to them</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={orgSettings.notify_on_reply}
                onChange={(e) => setOrgSettings({ ...orgSettings, notify_on_reply: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Email agent when a customer sends a reply</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={orgSettings.notify_on_closed}
                onChange={(e) => setOrgSettings({ ...orgSettings, notify_on_closed: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Email customer when ticket is resolved or closed</span>
            </label>
          </CardContent>
        </Card>

        {/* Security & Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-rose-600" /> Security & Session Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Session Inactivity Timeout (Hours)</label>
              <select
                value={orgSettings.session_timeout_hours}
                onChange={(e) => setOrgSettings({ ...orgSettings, session_timeout_hours: e.target.value })}
                className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
              >
                <option value="12">12 Hours</option>
                <option value="24">24 Hours (Recommended)</option>
                <option value="72">72 Hours</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" className="gap-2 font-bold shadow-lg shadow-blue-500/25">
            <Save className="h-4 w-4" /> Save Settings Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
