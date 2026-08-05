"use client";

import React, { useState } from "react";
import { UserCheck, Plus, ShieldCheck, Mail, Check, Trash2, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export default function TeamPage() {
  const [members, setMembers] = useState([
    {
      id: "u1",
      full_name: "Youssef Manssouri",
      email: "admin@supportflow.io",
      role: "Owner",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80",
      status: "Active"
    },
    {
      id: "u2",
      full_name: "Sarah Jenkins",
      email: "sarah.j@supportflow.io",
      role: "Admin",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&q=80",
      status: "Active"
    },
    {
      id: "u3",
      full_name: "Alex Morgan",
      email: "alex.m@supportflow.io",
      role: "Agent",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&q=80",
      status: "Active"
    }
  ]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newInvite, setNewInvite] = useState({ full_name: "", email: "", role: "Agent" });

  const rolePermissions: Record<string, string[]> = {
    Owner: ["Manage Tickets", "Manage Team & Roles", "View Analytics", "Billing Access", "System Settings"],
    Admin: ["Manage Tickets", "Manage Team & Roles", "View Analytics", "System Settings"],
    Agent: ["Manage Assigned Tickets", "View Analytics"],
    Viewer: ["View Analytics Only"]
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `u_${Date.now()}`,
      full_name: newInvite.full_name,
      email: newInvite.email,
      role: newInvite.role,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80",
      status: "Invited"
    };
    setMembers([...members, created]);
    setInviteModalOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Owner": return <Badge variant="destructive">Owner</Badge>;
      case "Admin": return <Badge variant="default">Admin</Badge>;
      case "Agent": return <Badge variant="info">Agent</Badge>;
      default: return <Badge variant="secondary">Viewer</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <UserCheck className="h-7 w-7 text-blue-600" /> Team & Role-Based Access Control (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Invite team members, assign RBAC permissions, and manage administrative credentials.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setInviteModalOpen(true)} className="gap-2 text-xs font-bold shadow-md shadow-blue-500/20">
          <Plus className="h-4 w-4" /> Invite Team Member
        </Button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Members Table */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold">Organization Roster ({members.length})</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">User Member</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Role Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={m.avatar} alt={m.full_name} className="h-9 w-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{m.full_name}</div>
                          <div className="text-[10px] text-slate-400">{m.email}</div>
                        </div>
                      </td>
                      <td className="p-3.5">{getRoleBadge(m.role)}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {m.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={m.role}
                          onChange={(e) => setMembers(members.map(mem => mem.id === m.id ? { ...mem, role: e.target.value } : mem))}
                          className="h-8 px-2 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold border-none"
                        >
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                          <option value="Agent">Agent</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RBAC Matrix Card */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" /> RBAC Permission Matrix
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              {Object.entries(rolePermissions).map(([role, perms]) => (
                <div key={role} className="p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 mb-2">
                    <span>{role}</span>
                    {getRoleBadge(role)}
                  </div>
                  <div className="space-y-1">
                    {perms.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <Check className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Team Member" maxWidth="sm">
        <form onSubmit={handleInvite} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <Input
              required
              placeholder="e.g. Jordan Lee"
              value={newInvite.full_name}
              onChange={(e) => setNewInvite({ ...newInvite, full_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
            <Input
              required
              type="email"
              placeholder="jordan@company.com"
              value={newInvite.email}
              onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Assign Role</label>
            <select
              value={newInvite.role}
              onChange={(e) => setNewInvite({ ...newInvite, role: e.target.value })}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
