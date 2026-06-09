'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, StatusBadge, EmptyState } from '@/components/dashboard/ui';

const STATUS_TICKET_COLORS = {
  open: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  in_progress: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-300 border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function CustomerProfilePage() {
  const { customerId } = useParams();
  
  const fetchUrl = `/api/dashboard/customers/${customerId}`;
  const [data, setData] = __useState(null);
  const [loading, setLoading] = __useState(true);
  const [error, setError] = __useState(null);

  const fetchData = __useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(fetchUrl, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  __useEffect(() => { fetchData(); }, [fetchData]);
  const refetch = fetchData;


  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;

  const { customer, bookings = [], support_tickets = [] } = data;
  const totalSpent = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((s, b) => s + Number(b.total_price || 0), 0);

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <Link href="/dashboard/customers" className="text-sm text-text-3 hover:text-text transition-colors self-start mt-1">
          ← Back
        </Link>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-extrabold text-2xl text-white shrink-0">
            {customer.name?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text tracking-tight">{customer.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-text-2">
              <span>{customer.email}</span>
              {customer.phone && <span>📞 {customer.phone}</span>}
            </div>
            <div className="text-xs text-text-3 mt-0.5">
              Customer since {new Date(customer.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-border rounded-2xl p-6 text-center">
          <div className="text-xs text-text-3 uppercase tracking-wider font-semibold mb-1">Total Bookings</div>
          <div className="text-3xl font-extrabold text-text">{bookings.length}</div>
        </div>
        <div className="bg-white/5 border border-border rounded-2xl p-6 text-center">
          <div className="text-xs text-text-3 uppercase tracking-wider font-semibold mb-1">Confirmed</div>
          <div className="text-3xl font-extrabold text-success">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
        </div>
        <div className="bg-white/5 border border-border rounded-2xl p-6 text-center">
          <div className="text-xs text-text-3 uppercase tracking-wider font-semibold mb-1">Total Spent</div>
          <div className="text-3xl font-extrabold text-text">${totalSpent.toFixed(2)}</div>
        </div>
      </div>

      {/* Bookings table */}
      <div className="bg-white/5 border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-3 mb-4">Booking History</h2>
        {bookings.length === 0 ? (
          <EmptyState icon="📝" title="No bookings yet" subtitle="This customer hasn't made a booking." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-custom">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Tour</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.booking_id}>
                    <td>
                      <Link
                        href={`/dashboard/bookings/${b.booking_id}`}
                        className="text-primary-light hover:underline text-sm font-mono"
                      >
                        {b.booking_reference || `#${b.booking_id}`}
                      </Link>
                    </td>
                    <td className="font-medium text-sm">{b.tour_title}</td>
                    <td className="text-sm text-text-2">{b.seats}</td>
                    <td className="font-bold text-sm">${Number(b.total_price || 0).toFixed(2)}</td>
                    <td className="text-sm text-text-3">{new Date(b.created_at).toLocaleDateString()}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Support tickets */}
      <div className="bg-white/5 border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-3">Support Tickets</h2>
          <Link href="/dashboard/support" className="text-xs text-primary-light hover:underline">
            Go to Support →
          </Link>
        </div>
        {support_tickets.length === 0 ? (
          <EmptyState icon="🎫" title="No support tickets" subtitle="This customer hasn't opened any support requests." />
        ) : (
          <div className="flex flex-col gap-2">
            {support_tickets.map(t => (
              <Link
                key={t.ticket_id}
                href={`/dashboard/support?tab=customer`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-white/4 hover:border-border-hover transition-all no-underline"
              >
                <div>
                  <div className="text-sm font-semibold text-text">{t.subject}</div>
                  <div className="text-xs text-text-3 mt-0.5">{new Date(t.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_TICKET_COLORS[t.status]}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
