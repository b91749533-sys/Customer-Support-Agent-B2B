"use client";

import React, { useState, useEffect } from "react";
import {
  Ticket as TicketIcon,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  FileText,
  Paperclip,
  GitMerge,
  Trash2,
  X,
  Send,
  MoreVertical,
  CheckSquare,
  AlertTriangle,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { fetchApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([
    {
      id: "t1",
      ticket_number: 1001,
      subject: "Unable to export monthly analytics report to CSV",
      description: "When I click on 'Export CSV' in the reports dashboard, the spinner hangs indefinitely and times out after 30 seconds.",
      category: "Technical Issue",
      priority: "High",
      status: "Open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: { name: "David Miller", email: "david@nexuscorp.com", company: "Nexus Corp" },
      assigned_agent: { id: "u2", full_name: "Sarah Jenkins" },
      messages: [
        { id: "m1", sender_type: "customer", sender_name: "David Miller", message: "When I click on 'Export CSV' in the reports dashboard, the spinner hangs indefinitely.", created_at: new Date().toISOString() },
        { id: "m2", sender_type: "agent", sender_name: "Sarah Jenkins", message: "Hello David! I am investigating our export worker logs right now.", created_at: new Date().toISOString() }
      ],
      internal_notes: [
        { id: "in1", user_name: "Sarah Jenkins", note_text: "Worker timeout on 500k+ date range records. Engineering patch incoming.", created_at: new Date().toISOString() }
      ]
    },
    {
      id: "t2",
      ticket_number: 1002,
      subject: "Billing query: Update invoice tax identification number",
      description: "Could you please update invoice #INV-109281 with our EU VAT ID DE39201928?",
      category: "Billing & Account",
      priority: "Medium",
      status: "Waiting for Customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: { name: "Emily Chen", email: "emily.chen@cloudscale.io", company: "CloudScale Inc" },
      assigned_agent: { id: "u3", full_name: "Alex Morgan" },
      messages: [],
      internal_notes: []
    },
    {
      id: "t3",
      ticket_number: 1003,
      subject: "Webhook integration failing with HTTP 403 Forbidden error",
      description: "Our webhooks endpoints for ticket creation events are receiving 403 Forbidden responses.",
      category: "API Integration",
      priority: "Urgent",
      status: "Pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: { name: "Marcus Vance", email: "marcus@logisticsglobal.net", company: "Logistics Global" },
      assigned_agent: { id: "u1", full_name: "Youssef Manssouri" },
      messages: [],
      internal_notes: []
    },
    {
      id: "t4",
      ticket_number: 1004,
      subject: "Requesting custom role permission matrix for auditors",
      description: "We would like to grant read-only view access to our financial compliance team.",
      category: "Feature Request",
      priority: "Low",
      status: "Resolved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: { name: "David Miller", email: "david@nexuscorp.com", company: "Nexus Corp" },
      assigned_agent: { id: "u2", full_name: "Sarah Jenkins" },
      messages: [],
      internal_notes: []
    }
  ]);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Selection & Detail Drawer
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedTicketIds, setSelectedTicketIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"conversation" | "internal_notes">("conversation");

  // New Reply & Note inputs
  const [replyMessage, setReplyMessage] = useState("");
  const [noteText, setNoteText] = useState("");

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "Technical Issue",
    priority: "Medium",
    customer_name: "David Miller",
    customer_email: "david@nexuscorp.com"
  });

  const loadTickets = async () => {
    try {
      const data = await fetchApi<any[]>("/tickets/");
      if (data && data.length > 0) {
        setTickets(data);
      }
    } catch (e) {
      // Keep demo dataset if offline
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticket_number.toString().includes(search) ||
      t.customer?.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;
    const matchesPriority = selectedPriority === "ALL" || t.priority === selectedPriority;
    const matchesCategory = selectedCategory === "ALL" || t.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent": return <Badge variant="destructive">Urgent</Badge>;
      case "High": return <Badge variant="warning">High</Badge>;
      case "Medium": return <Badge variant="default">Medium</Badge>;
      case "Low": return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open": return <Badge variant="default">Open</Badge>;
      case "Pending": return <Badge variant="warning">Pending</Badge>;
      case "Waiting for Customer": return <Badge variant="info">Waiting Customer</Badge>;
      case "Resolved": return <Badge variant="success">Resolved</Badge>;
      case "Closed": return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Ticket Operations
  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleUpdatePriority = (ticketId: string, newPriority: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, priority: newPriority } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, priority: newPriority });
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      sender_type: "agent",
      sender_name: "Youssef Manssouri",
      message: replyMessage,
      created_at: new Date().toISOString()
    };
    const updatedMsgs = [...(selectedTicket.messages || []), newMsg];
    const updated = { ...selectedTicket, messages: updatedMsgs, status: "Waiting for Customer" };
    setSelectedTicket(updated);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setReplyMessage("");
  };

  const handleAddNote = () => {
    if (!noteText.trim() || !selectedTicket) return;
    const newNote = {
      id: `n_${Date.now()}`,
      user_name: "Youssef Manssouri",
      note_text: noteText,
      created_at: new Date().toISOString()
    };
    const updatedNotes = [...(selectedTicket.internal_notes || []), newNote];
    const updated = { ...selectedTicket, internal_notes: updatedNotes };
    setSelectedTicket(updated);
    setTickets(tickets.map(t => t.id === selectedTicket.id ? updated : t));
    setNoteText("");
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `t_${Date.now()}`,
      ticket_number: 1000 + tickets.length + 1,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "Open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: { name: newTicket.customer_name, email: newTicket.customer_email, company: "New Account" },
      assigned_agent: { id: "u1", full_name: "Youssef Manssouri" },
      messages: [{ id: `m_${Date.now()}`, sender_type: "customer", sender_name: newTicket.customer_name, message: newTicket.description, created_at: new Date().toISOString() }],
      internal_notes: []
    };
    setTickets([created, ...tickets]);
    setCreateModalOpen(false);
  };

  const handleBulkStatusChange = (status: string) => {
    setTickets(tickets.map(t => selectedTicketIds.includes(t.id) ? { ...t, status } : t));
    setSelectedTicketIds([]);
  };

  const handleBulkDelete = () => {
    setTickets(tickets.filter(t => !selectedTicketIds.includes(t.id)));
    setSelectedTicketIds([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <TicketIcon className="h-7 w-7 text-blue-600" /> Ticket Management System
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage, reassign, merge, and resolve customer support tickets across your team.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedTicketIds.length > 1 && (
            <Button variant="outline" size="sm" onClick={() => setMergeModalOpen(true)} className="gap-1.5 text-xs font-semibold">
              <GitMerge className="h-4 w-4 text-purple-600" /> Merge Tickets ({selectedTicketIds.length})
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2 text-xs font-bold shadow-md shadow-blue-500/20">
            <Plus className="h-4 w-4" /> Create Ticket
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by ticket #, subject, or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Waiting for Customer">Waiting Customer</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Billing & Account">Billing & Account</option>
              <option value="API Integration">API Integration</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Bar if items selected */}
      {selectedTicketIds.length > 0 && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-blue-600" /> {selectedTicketIds.length} tickets selected
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("Resolved")} className="h-8 text-xs">
              Mark Resolved
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("Closed")} className="h-8 text-xs">
              Mark Closed
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="h-8 text-xs gap-1">
              <Trash2 className="h-3.5 w-3.5" /> Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Ticket Board Table & Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket List Table */}
        <div className={selectedTicket ? "lg:col-span-7" : "lg:col-span-12"}>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 w-8">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) setSelectedTicketIds(filteredTickets.map(t => t.id));
                          else setSelectedTicketIds([]);
                        }}
                        checked={selectedTicketIds.length > 0 && selectedTicketIds.length === filteredTickets.length}
                        className="rounded border-slate-300 dark:border-slate-700"
                      />
                    </th>
                    <th className="p-3.5">Ticket #</th>
                    <th className="p-3.5">Subject & Category</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Assigned Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredTickets.map((ticket) => {
                    const isSelected = selectedTicket?.id === ticket.id;
                    const isChecked = selectedTicketIds.includes(ticket.id);

                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-blue-50/80 dark:bg-blue-950/40"
                            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedTicketIds([...selectedTicketIds, ticket.id]);
                              else setSelectedTicketIds(selectedTicketIds.filter(id => id !== ticket.id));
                            }}
                            className="rounded border-slate-300 dark:border-slate-700"
                          />
                        </td>
                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-slate-100">
                          #{ticket.ticket_number}
                        </td>
                        <td className="p-3.5 max-w-xs">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">{ticket.subject}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{ticket.category}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{ticket.customer?.name}</div>
                          <div className="text-[10px] text-slate-500">{ticket.customer?.company}</div>
                        </td>
                        <td className="p-3.5">{getPriorityBadge(ticket.priority)}</td>
                        <td className="p-3.5">{getStatusBadge(ticket.status)}</td>
                        <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                          {ticket.assigned_agent?.full_name || "Unassigned"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Ticket Detail Drawer (when a ticket is selected) */}
        {selectedTicket && (
          <div className="lg:col-span-5 sticky top-20">
            <Card className="border-2 border-blue-500/20 shadow-xl">
              <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600">#{selectedTicket.ticket_number}</span>
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  <CardTitle className="text-sm font-bold mt-1 line-clamp-1">{selectedTicket.subject}</CardTitle>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                {/* Control Panel: Status & Priority Shift */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                      className="w-full h-8 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Open">Open</option>
                      <option value="Pending">Pending</option>
                      <option value="Waiting for Customer">Waiting Customer</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Priority</label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => handleUpdatePriority(selectedTicket.id, e.target.value)}
                      className="w-full h-8 px-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Urgent">Urgent</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Customer Context Card */}
                <div className="p-3 rounded-lg border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{selectedTicket.customer?.name}</div>
                    <div className="text-slate-500">{selectedTicket.customer?.email} • {selectedTicket.customer?.company}</div>
                  </div>
                  <Badge variant="outline">VIP Client</Badge>
                </div>

                {/* Tabs: Public Thread vs Internal Notes */}
                <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab("conversation")}
                    className={`pb-2 font-bold text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
                      activeTab === "conversation"
                        ? "border-blue-600 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Customer Thread ({selectedTicket.messages?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("internal_notes")}
                    className={`pb-2 font-bold text-xs flex items-center gap-1.5 transition-colors border-b-2 ${
                      activeTab === "internal_notes"
                        ? "border-amber-500 text-amber-600 dark:text-amber-400"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Internal Notes ({selectedTicket.internal_notes?.length || 0})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === "conversation" ? (
                  <div className="space-y-3">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {selectedTicket.messages?.map((msg: any) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl border text-xs ${
                            msg.sender_type === "agent"
                              ? "bg-blue-50/70 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/50 ml-4"
                              : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 mr-4"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 mb-1">
                            <span>{msg.sender_name}</span>
                            <span className="text-[10px] text-slate-400">{formatDate(msg.created_at)}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{msg.message}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input Box */}
                    <div className="pt-2">
                      <textarea
                        rows={3}
                        placeholder="Write a reply to the customer..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button className="text-slate-400 hover:text-slate-600 p-1">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <Button size="sm" variant="primary" onClick={handleSendReply} className="gap-1.5 text-xs font-semibold">
                          <Send className="h-3.5 w-3.5" /> Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                      {selectedTicket.internal_notes?.map((note: any) => (
                        <div key={note.id} className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
                          <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200 mb-1">
                            <span>🔒 Note by {note.user_name}</span>
                            <span className="text-[10px] text-amber-600 dark:text-amber-400">{formatDate(note.created_at)}</span>
                          </div>
                          <p className="text-amber-950 dark:text-amber-100">{note.note_text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Internal Note Input */}
                    <div className="pt-2">
                      <textarea
                        rows={3}
                        placeholder="Add private note (visible only to team agents)..."
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="primary" onClick={handleAddNote} className="gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700">
                          Add Internal Note
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Support Ticket" maxWidth="lg">
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <Input
              required
              placeholder="e.g. Cannot process credit card payment at checkout"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing & Account">Billing & Account</option>
                <option value="API Integration">API Integration</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name & Email</label>
            <Input
              required
              placeholder="David Miller (david@nexuscorp.com)"
              value={newTicket.customer_name}
              onChange={(e) => setNewTicket({ ...newTicket, customer_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Detailed Problem Description</label>
            <textarea
              required
              rows={4}
              placeholder="Explain the technical issue or inquiry in detail..."
              value={newTicket.description}
              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Support Ticket
            </Button>
          </div>
        </form>
      </Modal>

      {/* Merge Ticket Confirmation Modal */}
      <Modal isOpen={mergeModalOpen} onClose={() => setMergeModalOpen(false)} title="Merge Selected Tickets" maxWidth="md">
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            You are about to merge <span className="font-bold text-blue-600">{selectedTicketIds.length} tickets</span> into a single primary ticket thread. All messages and internal notes will be consolidated.
          </p>

          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200">
            <div className="font-bold mb-1">Primary Target Ticket:</div>
            <div className="font-mono">#1001 - Unable to export monthly analytics report</div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setMergeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setMergeModalOpen(false)} className="bg-purple-600 hover:bg-purple-700">
              Confirm Ticket Merge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
