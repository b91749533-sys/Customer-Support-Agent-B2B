"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  UserCheck,
  ArrowRightLeft,
  Ticket,
  CheckCircle2,
  Phone,
  Clock,
  Sparkles,
  Paperclip,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { FloatingWidget } from "@/components/chat-widget/FloatingWidget";

export default function LiveChatConsolePage() {
  const [sessions, setSessions] = useState([
    {
      id: "s1",
      customer_name: "David Miller",
      customer_email: "david@nexuscorp.com",
      status: "active",
      time: "2m ago",
      assigned_agent: "Sarah Jenkins",
      unread: true,
      messages: [
        { id: "m1", sender_type: "customer", sender_name: "David Miller", message: "Hi! We need help setting up our webhook endpoints.", time: "10:42 AM" },
        { id: "m2", sender_type: "agent", sender_name: "Sarah Jenkins", message: "Hello David! I can guide you through our webhook setup steps.", time: "10:43 AM" },
        { id: "m3", sender_type: "customer", sender_name: "David Miller", message: "Great! Where do I generate the HMAC signing secret?", time: "10:44 AM" }
      ]
    },
    {
      id: "s2",
      customer_name: "Emily Chen",
      customer_email: "emily.chen@cloudscale.io",
      status: "active",
      time: "15m ago",
      assigned_agent: "Alex Morgan",
      unread: false,
      messages: [
        { id: "m4", sender_type: "customer", sender_name: "Emily Chen", message: "Is there a discount for annual billing upgrades?", time: "10:30 AM" },
        { id: "m5", sender_type: "agent", sender_name: "Alex Morgan", message: "Yes! Annual billing includes a 20% discount across all seat tiers.", time: "10:32 AM" }
      ]
    }
  ]);

  const [activeSession, setActiveSession] = useState<any>(sessions[0]);
  const [messageInput, setMessageInput] = useState("");
  const [showWidgetPreview, setShowWidgetPreview] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [targetAgent, setTargetAgent] = useState("Alex Morgan");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeSession) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender_type: "agent",
      sender_name: "Youssef Manssouri",
      message: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...activeSession.messages, newMsg];
    const updatedSession = { ...activeSession, messages: updatedMsgs };
    setActiveSession(updatedSession);
    setSessions(sessions.map(s => s.id === activeSession.id ? updatedSession : s));
    setMessageInput("");
  };

  const handleConvertToTicket = () => {
    alert(`Live chat session with ${activeSession.customer_name} has been converted into Ticket #1005!`);
  };

  const handleTransferSession = () => {
    const updated = { ...activeSession, assigned_agent: targetAgent };
    setActiveSession(updated);
    setSessions(sessions.map(s => s.id === activeSession.id ? updated : s));
    setTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="h-7 w-7 text-blue-600" /> Live Chat Agent Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time WebSocket customer messaging stream, chat transfers, and instant ticket conversion.
          </p>
        </div>

        <Button
          variant={showWidgetPreview ? "primary" : "outline"}
          size="sm"
          onClick={() => setShowWidgetPreview(!showWidgetPreview)}
          className="gap-2 text-xs font-bold"
        >
          <Eye className="h-4 w-4" /> {showWidgetPreview ? "Hide Live Widget Preview" : "Preview Customer Chat Widget"}
        </Button>
      </div>

      {/* Floating Widget Embedded Toggle */}
      {showWidgetPreview && <FloatingWidget />}

      {/* Live Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] items-stretch">
        {/* Active Chat Sessions Sidebar */}
        <div className="lg:col-span-4 h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Conversations</CardTitle>
                <Badge variant="success" className="gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> 2 Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 flex-1 overflow-y-auto space-y-2">
              {sessions.map((sess) => {
                const isSelected = activeSession?.id === sess.id;

                return (
                  <div
                    key={sess.id}
                    onClick={() => setActiveSession(sess)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800"
                        : "bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-slate-100">
                      <span>{sess.customer_name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{sess.time}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-1">
                      {sess.messages[sess.messages.length - 1]?.message}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Agent: {sess.assigned_agent}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">• Active WebSocket</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Real-time Message Stream Console */}
        <div className="lg:col-span-8 h-full">
          {activeSession ? (
            <Card className="h-full flex flex-col border-2 border-blue-500/20 shadow-xl">
              {/* Session Top Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100">
                    <span>{activeSession.customer_name}</span>
                    <span className="text-slate-400 font-normal">({activeSession.customer_email})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Assigned Agent: <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSession.assigned_agent}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTransferModalOpen(true)} className="gap-1.5 text-xs font-semibold">
                    <ArrowRightLeft className="h-3.5 w-3.5" /> Transfer Chat
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleConvertToTicket} className="gap-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700">
                    <Ticket className="h-3.5 w-3.5" /> Convert to Ticket
                  </Button>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                {activeSession.messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`max-w-[75%] p-3 rounded-xl text-xs ${
                      msg.sender_type === "agent"
                        ? "bg-blue-600 text-white ml-auto rounded-br-none shadow-xs"
                        : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 mr-auto rounded-bl-none shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold opacity-80 mb-1">
                      <span>{msg.sender_name}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div>{msg.message}</div>
                  </div>
                ))}
              </div>

              {/* Console Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a real-time response to customer..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" variant="primary" size="icon" className="h-10 w-10">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select an active conversation to begin live messaging.
            </Card>
          )}
        </div>
      </div>

      {/* Transfer Agent Modal */}
      <Modal isOpen={transferModalOpen} onClose={() => setTransferModalOpen(false)} title="Transfer Chat Session" maxWidth="sm">
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-400">
            Reassign live session with <span className="font-bold text-slate-900 dark:text-white">{activeSession?.customer_name}</span> to another agent:
          </p>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Target Agent</label>
            <select
              value={targetAgent}
              onChange={(e) => setTargetAgent(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="Alex Morgan">Alex Morgan (Agent)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Admin)</option>
              <option value="Youssef Manssouri">Youssef Manssouri (Owner)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setTransferModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleTransferSession}>
              Confirm Transfer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
