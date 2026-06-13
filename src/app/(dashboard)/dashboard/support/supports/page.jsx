'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

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

      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length > 0 ? tickets.map((ticket) => (
                <tr key={ticket.ticket_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ticket.customer_name}</div>
                    <div className="text-xs text-gray-500">{ticket.customer_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ticket.subject}</div>
                    <div className="text-xs text-gray-500 max-w-xs truncate mt-1">{ticket.message}</div>
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
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-3">
                    <select 
                      value={ticket.status}
                      onChange={(e) => updateStatus(ticket.ticket_id, e.target.value)}
                      className="border-gray-200 text-gray-600 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-1.5 bg-white cursor-pointer hover:border-gray-300"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <Link
                      href={`/dashboard/support/supports/${ticket.ticket_id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                    >
                      View Thread
                    </Link>
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
