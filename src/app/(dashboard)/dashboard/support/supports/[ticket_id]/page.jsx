'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function TicketChat() {
  const { ticket_id } = useParams();
  const router = useRouter();
  
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchTicketAndReplies();
  }, [ticket_id]);

  useEffect(() => {
    scrollToBottom();
  }, [replies]);

  const fetchTicketAndReplies = async () => {
    try {
      const res = await axios.get(`/api/admin/supports/${ticket_id}/replies`);
      setTicket(res.data.ticket);
      setReplies(res.data.replies || []);
    } catch (err) {
      console.error('Failed to load ticket details', err);
      toast.error('Failed to load ticket details');
      router.push('/dashboard/support/supports');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const res = await axios.post(`/api/admin/supports/${ticket_id}/replies`, {
        message: newMessage
      });
      setReplies([...replies, res.data.reply]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send reply', err);
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading ticket...</div>;
  if (!ticket) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/support/supports" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ticket #{ticket.ticket_id} - {ticket.subject}</h1>
            <p className="text-sm text-gray-500">From: {ticket.customer_name} ({ticket.customer_email})</p>
          </div>
        </div>
        <div>
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${ticket.status === 'open' ? 'bg-blue-900/50 text-blue-400' : ticket.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' : ticket.status === 'resolved' ? 'bg-green-900/50 text-green-400' : ' text-gray-400'}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          
          {/* Original Ticket Message */}
          <div className="flex flex-col mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-sm text-gray-900">{ticket.customer_name}</span>
              <span className="text-xs text-gray-500">{new Date(ticket.created_at).toLocaleString()}</span>
            </div>
            <div className="text-gray-800">
              <p className="whitespace-pre-wrap text-sm">{ticket.message}</p>
            </div>
          </div>

          {/* Replies */}
          {replies.map((reply) => (
            <div key={reply.reply_id} className="flex flex-col mb-6 pb-6 border-b border-gray-200 last:border-0 last:pb-0 last:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-bold text-sm text-gray-900">{reply.is_staff ? (reply.staff_name || 'Support Staff') : ticket.customer_name}</span>
                {reply.staff_role && <span className="text-[10px] uppercase font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{reply.staff_role}</span>}
                <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
              </div>
              <div className="text-gray-800">
                <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input Box */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendReply} className="flex space-x-4">
            <textarea
              className="flex-1 p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows="2"
              placeholder="Type your reply here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {sending ? 'Sending...' : 'Reply'}
            </button>
          </form>
          <div className="text-xs text-gray-400 mt-2 ml-1">Press Enter to send, Shift + Enter for new line.</div>
        </div>
      </div>
    </div>
  );
}
