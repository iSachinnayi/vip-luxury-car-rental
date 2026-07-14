"use client";

// ═══════════════════════════════════════════════
//  Admin Messages — Contact form submissions
// ═══════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { MailIcon, PhoneIcon, TrashIcon, InfoIcon } from "@/components/admin/Icons";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/messages");
      const data = await res.json();
      setMessages(data.messages || []);
      setStats({ total: data.total, unread: data.unread });
    } catch (err) { console.error("Fetch messages error:", err); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  async function markRead(id: string) {
    await fetch("/admin/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "read" }) });
    fetchMessages();
  }

  async function markUnread(id: string) {
    await fetch("/admin/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "unread" }) });
    fetchMessages();
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch("/admin/api/messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "delete" }) });
    setSelectedMsg(null);
    fetchMessages();
  }

  function viewMessage(msg: Message) {
    setSelectedMsg(msg);
    if (!msg.read) markRead(msg.id);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-serif">Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">{stats.unread > 0 ? `${stats.unread} unread` : "All caught up"}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-3.5 text-center">
          <p className="text-white text-lg font-bold font-serif">{stats.total}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">Total</p>
        </div>
        <div className="bg-dark-card/40 border border-dark-border/60 rounded-xl p-3.5 text-center">
          <p className="text-gold text-lg font-bold font-serif">{stats.unread}</p>
          <p className="text-gray-600 text-[10px] uppercase tracking-wider mt-0.5">Unread</p>
        </div>
      </div>

      {/* Split pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* List */}
        <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-600 text-sm">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-gray-600 text-sm">No messages yet.</div>
          ) : (
            messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => viewMessage(msg)}
                className={`w-full text-left px-4 py-3.5 border-b border-dark-border/30 hover:bg-white/[0.02] transition-colors ${
                  selectedMsg?.id === msg.id ? "bg-white/[0.03]" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {!msg.read && <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />}
                      <span className={`text-sm truncate ${msg.read ? "text-gray-400" : "text-white font-medium"}`}>{msg.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{msg.subject || msg.message?.slice(0, 60)}</p>
                  </div>
                  <span className="text-[10px] text-gray-700 whitespace-nowrap mt-0.5">
                    {new Date(msg.createdAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="bg-dark-card/60 border border-dark-border/60 rounded-xl p-5">
          {selectedMsg ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium text-sm">{selectedMsg.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><MailIcon size={11} /> {selectedMsg.email}</span>
                    {selectedMsg.phone && <span className="flex items-center gap-1 text-xs text-gray-500"><PhoneIcon size={11} /> {selectedMsg.phone}</span>}
                  </div>
                </div>
                <span className="text-[10px] text-gray-600">{new Date(selectedMsg.createdAt).toLocaleString("en-GB")}</span>
              </div>

              {selectedMsg.subject && (
                <div className="bg-dark/50 rounded-lg px-3 py-2 mb-4">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">Subject</p>
                  <p className="text-sm text-white">{selectedMsg.subject}</p>
                </div>
              )}

              <div className="bg-dark/50 rounded-lg p-3.5 mb-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">Message</p>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedMsg.message}</p>
              </div>

              <div className="flex gap-2">
                {selectedMsg.read ? (
                  <button onClick={() => markUnread(selectedMsg.id)} className="px-3 py-1.5 text-[11px] bg-dark/50 border border-dark-border/60 text-gray-400 rounded-lg hover:border-gray-600 transition-all">Mark Unread</button>
                ) : null}
                <button onClick={() => { if (selectedMsg.email) window.open(`mailto:${selectedMsg.email}`, "_blank"); }} className="px-3 py-1.5 text-[11px] bg-gold/10 border border-gold/20 text-gold rounded-lg hover:bg-gold/20 transition-all">Reply via Email</button>
                <button onClick={() => deleteMessage(selectedMsg.id)} className="px-3 py-1.5 text-[11px] bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all ml-auto flex items-center gap-1"><TrashIcon size={11} /> Delete</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-600 text-sm">Select a message to read</div>
          )}
        </div>
      </div>
    </div>
  );
}
