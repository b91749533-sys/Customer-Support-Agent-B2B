"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, LifeBuoy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "agent", name: "SupportFlow Agent", text: "Hello! Welcome to SupportFlow. How can our team assist you today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: "customer", name: "You", text: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulate Agent reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          name: "Sarah Jenkins",
          text: "Thanks for reaching out! A support engineer has been assigned to your chat session."
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 shadow-2xl shadow-blue-500/40 font-bold text-xs transition-transform hover:scale-105"
        >
          <MessageSquare className="h-5 w-5" /> Chat with Support
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <LifeBuoy className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xs">SupportFlow Live Help</h4>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Agents Online • &lt; 2m response
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-white/10 text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  m.sender === "customer"
                    ? "bg-blue-600 text-white ml-auto rounded-br-none shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 mr-auto border border-slate-200/60 dark:border-slate-700 rounded-bl-none shadow-xs"
                }`}
              >
                <div className="text-[10px] font-bold opacity-75 mb-0.5">{m.name}</div>
                <div>{m.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border text-[11px] text-slate-500 w-28 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce delay-100" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce delay-200" />
                <span>Typing...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" variant="primary" size="icon" className="h-9 w-9 rounded-lg">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
