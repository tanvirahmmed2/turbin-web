'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const STATUS_COLORS = {
  open: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function DashboardSupportPage() {
  const [tab, setTab] = useState('customer');
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // New SaaS ticket form
  const [showNewForm, setShowNewForm] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    setThread(null);
    try {
      const res = await axios.get(`/api/dashboard/support?tab=${tab}`);
      setTickets(res.data.tickets || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const openTicket = async (id) => {
    setSelected(id);
    setReply('');
    try {
      const res = await axios.get(`/api/dashboard/support?ticketId=${id}&type=${tab}`);
      setThread(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await axios.post('/api/dashboard/support', {
      type: tab,
      ticket_id: selected,
      message: reply,
    });
    setSending(false);
    setReply('');
    openTicket(selected);
  };

  const updateStatus = async (ticketId, status) => {
    await axios.patch('/api/dashboard/support', {
      ticket_id: ticketId,
      status,
      type: tab,
    });
    fetchTickets();
    if (selected === ticketId) openTicket(ticketId);
  };

  const submitNewTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;
    setSubmitting(true);
    await fetch('/api/dashboard/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'saas', subject: newSubject, message: newMessage }),
    });
    setSubmitting(false);
    setNewSubject('');
    setNewMessage('');
    setShowNewForm(false);
    fetchTickets();
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Support Tickets</h1>
          <p className="text-sm text-text-2 mt-1">Manage customer inquiries and contact SaaS support</p>
        </div>
        {tab === 'saas' && (
          <button
            onClick={() => setShowNewForm(true)}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all duration-300 hover:shadow-[0_4px_12px_rgba(99,102,241,0.25)] active:scale-[0.98]"
          >
            + New Ticket
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 bg-slate-50 p-1.5 rounded-xl w-fit border border-slate-200">
        {[
          { key: 'customer', label: '👥 Customer Tickets' },
          { key: 'saas', label: '🎫 SaaS Support' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
              tab === t.key
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-2 hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* New SaaS Ticket Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative z-10 animate-fade-up">
            <h2 className="text-xl font-bold text-text mb-6 tracking-tight">Open SaaS Support Ticket</h2>
            <form onSubmit={submitNewTicket} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Subject</label>
                <input
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  required
                  className="input-custom text-sm"
                  placeholder="Briefly describe your issue"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-text-3 uppercase tracking-wider">Message</label>
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  required
                  rows={5}
                  className="input-custom text-sm resize-none"
                  placeholder="Describe your issue in detail…"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setShowNewForm(false)} 
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-text-2 hover:bg-slate-5 hover:text-text transition-colors duration-250"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all duration-300 disabled:opacity-40"
                >
                  {submitting ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex gap-6 h-[calc(100vh-260px)]">
        {/* Ticket list */}
        <div className="w-[340px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
          {loading ? (
            <div className="text-text-3 text-sm text-center py-12 font-semibold">Loading…</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 text-text-3 flex flex-col items-center gap-3">
              <div className="text-5xl opacity-40 filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">🎫</div>
              <div>
                <p className="font-bold text-text-2 text-sm">No tickets yet</p>
                {tab === 'saas' && <p className="text-xs text-text-3 mt-1 leading-relaxed">Open a ticket to contact SaaS support</p>}
              </div>
            </div>
          ) : tickets.map(t => (
            <button
              key={t.ticket_id}
              onClick={() => openTicket(t.ticket_id)}
              className={`text-left w-full p-4.5 rounded-2xl border transition-all duration-200 ${
                selected === t.ticket_id
                  ? 'bg-indigo-50/50 border-primary/30 shadow-sm shadow-indigo-100/50'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50/50 hover:border-slate-350'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-sm font-bold text-text line-clamp-1 tracking-tight">{t.subject}</span>
                <span className={`shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[t.status]}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
              {tab === 'customer' && (
                <div className="text-xs text-primary font-bold mb-2">{t.customer_name} · <span className="text-text-3 font-normal">{t.customer_email}</span></div>
              )}
              <div className="flex items-center gap-3 text-[10px] font-semibold text-text-3">
                <span>💬 {t.reply_count} replies</span>
                <span>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Thread panel */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl flex flex-col overflow-hidden shadow-sm shadow-slate-100/50">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-text-3 gap-3">
              <div className="text-6xl opacity-30 filter drop-shadow-[0_4px_12px_rgba(99,102,241,0.08)]">💬</div>
              <p className="text-base font-bold text-text-2">Select a ticket to view conversation</p>
            </div>
          ) : !thread ? (
            <div className="flex-1 flex items-center justify-center text-text-3 text-sm font-semibold">Loading conversation thread…</div>
          ) : (
            <>
              <div className="p-5 px-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-text tracking-tight">{thread.ticket.subject}</h2>
                  <div className="text-[11px] font-semibold text-text-3 mt-1">
                    {tab === 'customer'
                      ? <><span className="text-primary font-bold">{thread.ticket.customer_name}</span> · {thread.ticket.customer_email}</>
                      : 'Your SaaS support ticket'
                    }
                    {' · '}{new Date(thread.ticket.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full border ${STATUS_COLORS[thread.ticket.status]}`}>
                    {thread.ticket.status.replace('_', ' ')}
                  </span>
                  {tab === 'customer' && (
                    <select
                      value={thread.ticket.status}
                      onChange={e => updateStatus(selected, e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-text focus:outline-none"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50/30">
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0 shadow-sm">
                    {tab === 'customer' ? '👤' : '🏢'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-text">
                        {tab === 'customer' ? thread.ticket.customer_name : 'You (Tenant)'}
                      </span>
                      <span className="text-[10px] font-bold text-text-3 uppercase tracking-wider">· Original</span>
                    </div>
                    <div className="bg-white border border-slate-150 rounded-2xl p-4 text-sm text-text-2 whitespace-pre-wrap leading-relaxed shadow-sm shadow-slate-100/50">{thread.ticket.message}</div>
                  </div>
                </div>

                {thread.replies.map(r => {
                  const isRight = tab === 'customer' ? r.is_staff : !r.is_admin;
                  return (
                    <div key={r.reply_id} className={`flex gap-4 ${isRight ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 border ${
                        isRight ? 'bg-primary/10 border-primary/20' : 'bg-slate-100 border-slate-200'
                      }`}>
                        {isRight ? (tab === 'customer' ? '👨‍💼' : '🏢') : (tab === 'customer' ? '👤' : '⚡')}
                      </div>
                      <div className={`flex-1 flex flex-col ${isRight ? 'items-end' : ''}`}>
                        <div className={`flex items-center gap-2.5 mb-1.5 ${isRight ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs font-bold text-text">
                            {tab === 'customer'
                              ? (r.is_staff ? (r.staff_name || 'Staff') : thread.ticket.customer_name)
                              : (r.is_admin ? 'SaaS Admin' : 'You')}
                          </span>
                          <span className="text-[10px] text-text-3 font-semibold">{new Date(r.created_at).toLocaleString()}</span>
                        </div>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-sm whitespace-pre-wrap leading-relaxed shadow-sm shadow-slate-100/50 ${
                          isRight
                            ? 'bg-indigo-50/70 border border-indigo-150 text-indigo-950 self-end'
                            : 'bg-white border border-slate-150 text-text-2'
                        }`}>
                          {r.message}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {thread.ticket.status !== 'closed' && (
                <div className="p-4 px-6 border-t border-slate-200 bg-white flex gap-4">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    placeholder="Type your reply…"
                    rows={2}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3/60 resize-none focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 font-sans"
                  />
                  <button
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                    className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed self-end duration-300 shadow-sm"
                  >
                    {sending ? 'Sending…' : 'Reply'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
