'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageSupports() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/admin/supports');
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ticket_id, newStatus) => {
    try {
      await axios.put('/api/admin/supports', { ticket_id, status: newStatus });
      toast.success('Ticket updated');
      setTickets(tickets.map(t => t.ticket_id === ticket_id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update ticket status', err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading support tickets...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p className="mt-1 text-gray-600">Manage inquiries and support requests from your customers.</p>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.length > 0 ? tickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{ticket.customer_name}</div>
                    <div className="text-xs text-gray-500">{ticket.customer_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{ticket.subject}</div>
                    <div className="text-xs text-gray-600 max-w-xs truncate mt-1">{ticket.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md uppercase ${ticket.priority === 'urgent' ? 'bg-red-900/50 text-red-400 border border-red-500/20' : ticket.priority === 'high' ? 'bg-orange-900/50 text-orange-400 border border-orange-500/20' : ' text-gray-300'} bg-white`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${ticket.status === 'open' ? 'bg-blue-900/50 text-blue-400' : ticket.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' : ticket.status === 'resolved' ? 'bg-green-900/50 text-green-400' : ' text-gray-400'}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select 
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.ticket_id, e.target.value)}
                      className="border border-gray-200 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 bg-white"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No support tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
