'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('/api/admin/payments');
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error('Failed to load payments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading payments...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Payments & Transactions</h1>
        <p className="mt-1 text-gray-400">Review all customer transactions and payment statuses.</p>
      </div>

      <div className="bg-gray-800 rounded-3xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#222]">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {payments.length > 0 ? payments.map((payment) => (
                <tr key={payment.payment_id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{payment.transaction_id || 'N/A'}</div>
                    <div className="text-xs text-gray-500">via {payment.provider || 'Stripe'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white">{payment.customer_name}</div>
                    <div className="text-xs text-gray-400">{payment.tour_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-400">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.payment_status === 'success' ? 'bg-green-900/50 text-green-400' : 
                        payment.payment_status === 'refunded' ? 'bg-gray-700 text-gray-300' : 
                        payment.payment_status === 'failed' ? 'bg-red-900/50 text-red-400' :
                        'bg-yellow-900/50 text-yellow-400'}`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {payment.paid_at ? new Date(payment.paid_at).toLocaleString() : 'Pending'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No transactions found.
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
