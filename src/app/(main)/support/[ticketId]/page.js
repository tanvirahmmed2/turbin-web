'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import axios from 'axios';

const STATUS_LABELS = { open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
const STATUS_COLORS = {
  open: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function TicketThreadPage() {
  const { slug, ticketId } = useParams();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [emailInput, setEmailInput] = useState(email);
  const [verified, setVerified] = useState(!!email);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const loadThread = useCallback(async (emailVal) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/public/support?slug=${slug}&ticketId=${ticketId}&email=${encodeURIComponent(emailVal)}`);
      setThread(res.data);
      setVerified(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Ticket not found');
      setVerified(false);
    }
    setLoading(false);
  }, [slug, ticketId]);

  useEffect(() => {
    if (email) loadThread(email);
  }, [email, loadThread]);

  const sendReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await axios.patch('/api/public/support', { ticket_id: Number(ticketId), email: emailInput, message: reply });
    setSending(false);
    setReply('');
    loadThread(emailInput);
  };

  if (!verified) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔒</div>
            <h1 className="text-xl font-bold text-text">Verify Your Email</h1>
            <p className="text-sm text-text-2 mt-1">Enter the email you used when submitting this ticket</p>
          </div>
          {error && <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">{error}</div>}
          <form onSubmit={e => { e.preventDefault(); loadThread(emailInput); }} className="flex flex-col gap-4">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'View My Ticket'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) return (
    <main className="min-h-screen bg-bg flex items-center justify-center text-text-3">Loading ticket…</main>
  );

  if (!thread) return null;

  const { ticket, replies } = thread;

  return (
    <main className="min-h-screen bg-bg pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-12">
        <a href={`/t/${slug}/support`} className="inline-flex items-center gap-1.5 text-sm text-text-2 hover:text-text mb-6 transition-colors">
          ← Submit another ticket
        </a>

        {/* Ticket header */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="text-xl font-bold text-text">{ticket.subject}</h1>
            <span className={`shrink-0 text-[0.7rem] font-bold uppercase px-2.5 py-1 rounded-full border ${STATUS_COLORS[ticket.status]}`}>
              {STATUS_LABELS[ticket.status]}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-3">
            <span>Ticket #{ticket.ticket_id}</span>
            <span>Submitted {new Date(ticket.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Thread */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Original message */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-base shrink-0">👤</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-text">{ticket.customer_name}</span>
                <span className="text-xs text-text-3">· {new Date(ticket.created_at).toLocaleString()}</span>
              </div>
              <div className="bg-white/4 border border-border rounded-xl p-4 text-sm text-text-2 whitespace-pre-wrap">
                {ticket.message}
              </div>
            </div>
          </div>

          {replies.map(r => (
            <div key={r.reply_id} className={`flex gap-3 ${!r.is_staff ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 border ${
                r.is_staff ? 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20' : 'bg-primary/10 border-primary/20'
              }`}>
                {r.is_staff ? '👨‍💼' : '👤'}
              </div>
              <div className={`flex-1 flex flex-col ${!r.is_staff ? 'items-end' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${!r.is_staff ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-semibold text-text">{r.sender_name}</span>
                  {r.is_staff && <span className="text-[0.65rem] font-bold uppercase px-1.5 py-0.5 rounded bg-[#8b5cf6]/15 text-[#c4b5fd]">Staff</span>}
                  <span className="text-xs text-text-3">{new Date(r.created_at).toLocaleString()}</span>
                </div>
                <div className={`max-w-[85%] rounded-xl p-4 text-sm whitespace-pre-wrap ${
                  r.is_staff
                    ? 'bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#e9d5ff]'
                    : 'bg-white/4 border border-border text-text-2 self-end'
                }`}>
                  {r.message}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        {ticket.status === 'closed' ? (
          <div className="bg-surface border border-border rounded-2xl p-5 text-center text-sm text-text-3">
            This ticket is closed. <a href={`/t/${slug}/support`} className="text-primary-light underline">Open a new ticket</a> if you need further assistance.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-5">
            <p className="text-xs font-semibold text-text-3 uppercase tracking-wider mb-3">Add a reply</p>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write your reply…"
              rows={4}
              className="w-full bg-white/5 border border-border rounded-xl px-4 py-3 text-sm text-text placeholder-text-3 resize-none focus:outline-none focus:border-primary/50 mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending…' : 'Send Reply'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
