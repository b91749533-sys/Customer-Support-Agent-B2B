"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Ticket,
  FileText,
  Clock,
  ExternalLink,
  Edit2,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { fetchApi } from "@/lib/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([
    {
      id: "c1",
      name: "David Miller",
      email: "david@nexuscorp.com",
      phone: "+1 (555) 234-5678",
      company: "Nexus Corp",
      notes: "Enterprise account. VIP tier SLA support response guaranteed.",
      created_at: "2026-06-15T10:00:00Z",
      ticket_count: 5
    },
    {
      id: "c2",
      name: "Emily Chen",
      email: "emily.chen@cloudscale.io",
      phone: "+1 (555) 876-5432",
      company: "CloudScale Inc",
      notes: "Upgraded to Annual Enterprise tier last month.",
      created_at: "2026-07-01T14:30:00Z",
      ticket_count: 2
    },
    {
      id: "c3",
      name: "Marcus Vance",
      email: "marcus@logisticsglobal.net",
      phone: "+1 (555) 345-6789",
      company: "Logistics Global",
      notes: "Requires SAML SSO configuration assistance from dev team.",
      created_at: "2026-07-20T09:15:00Z",
      ticket_count: 3
    }
  ]);

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(customers[0]);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newCust, setNewCust] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: ""
  });

  const filteredCustomers = customers.filter(
    c => c.name.toLowerCase().includes(search.toLowerCase()) ||
         c.email.toLowerCase().includes(search.toLowerCase()) ||
         (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `c_${Date.now()}`,
      ...newCust,
      created_at: new Date().toISOString(),
      ticket_count: 0
    };
    setCustomers([created, ...customers]);
    setSelectedCustomer(created);
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-blue-600" /> Customer CRM Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unified customer database, touchpoint history, notes, and support ticket logs.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2 text-xs font-bold shadow-md shadow-blue-500/20">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Directory List */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search customer name, email, or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 text-xs"
                />
              </div>

              <div className="space-y-2">
                {filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;

                  return (
                    <div
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 shadow-sm"
                          : "bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{cust.name}</div>
                        <Badge variant="secondary" className="text-[10px]">
                          {cust.ticket_count} tickets
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                        <span className="truncate">{cust.email}</span>
                        {cust.company && <span className="font-semibold text-slate-700 dark:text-slate-300">• {cust.company}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Profile Details Panel */}
        {selectedCustomer && (
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{selectedCustomer.name}</CardTitle>
                    <div className="text-xs text-slate-500 mt-0.5">{selectedCustomer.company || "Independent Account"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active VIP Customer</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6 text-xs">
                {/* Contact Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                    <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
                      <Mail className="h-3.5 w-3.5 text-blue-500" /> {selectedCustomer.email}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Phone Number</span>
                    <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-500" /> {selectedCustomer.phone || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Company</span>
                    <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-purple-500" /> {selectedCustomer.company || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Internal Account Notes */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-2 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-amber-500" /> Account Context Notes
                  </h3>
                  <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
                    {selectedCustomer.notes || "No additional account notes recorded."}
                  </div>
                </div>

                {/* Ticket History Timeline */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-3 flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-blue-500" /> Ticket History Timeline ({selectedCustomer.ticket_count})
                  </h3>
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">#1001 - Unable to export monthly analytics report</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">Category: Technical Issue • Assigned: Sarah Jenkins</div>
                      </div>
                      <Badge variant="default">Open</Badge>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">#1004 - Custom role permission matrix request</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">Category: Feature Request • Resolved in 2 hours</div>
                      </div>
                      <Badge variant="success">Resolved</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Add New Customer Profile">
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Full Name</label>
            <Input
              required
              placeholder="e.g. Alex Rivera"
              value={newCust.name}
              onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <Input
                required
                type="email"
                placeholder="alex@company.com"
                value={newCust.email}
                onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <Input
                placeholder="+1 (555) 000-0000"
                value={newCust.phone}
                onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company</label>
            <Input
              placeholder="Company / Organization"
              value={newCust.company}
              onChange={(e) => setNewCust({ ...newCust, company: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Account Notes</label>
            <textarea
              rows={3}
              placeholder="SLA contract tier, key preferences..."
              value={newCust.notes}
              onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Customer Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
