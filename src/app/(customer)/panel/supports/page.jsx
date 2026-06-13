'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function CustomerSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', priority: 'normal' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/customer/supports');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets', err);
      toast.error('Failed to load your support tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Subject and message are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/customer/supports', newTicket);
      setTickets([res.data.ticket, ...tickets]);
      setShowModal(false);
      setNewTicket({ subject: '', message: '', priority: 'normal' });
      toast.success('Support ticket created successfully');
    } catch (err) {
      console.error('Failed to create ticket', err);
      toast.error('Failed to create support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-1 text-gray-500">Get help with your bookings or account.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors"
        >
          New Ticket
        </button>
      </div>

      {loading ? (
        <div className="text-center p-12 text-gray-500">Loading your tickets...</div>
      ) : tickets.length > 0 ? (
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.ticket_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.ticket_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 rounded-md uppercase ${ticket.priority === 'urgent' ? 'bg-red-50 text-red-600' : ticket.priority === 'high' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 rounded-full capitalize ${ticket.status === 'open' ? 'bg-blue-50 text-blue-600' : ticket.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600' : ticket.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/panel/supports/${ticket.ticket_id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Thread
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Support Tickets</h3>
          <p className="text-gray-500 max-w-md mx-auto">You don't have any active support requests. If you need assistance, click the button above.</p>
        </div>
      )}

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Ticket</h3>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none"
                  placeholder="What do you need help with?"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows="4"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white outline-none resize-none"
                  placeholder="Please describe your issue in detail..."
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
