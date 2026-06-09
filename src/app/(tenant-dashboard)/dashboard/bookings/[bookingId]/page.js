'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, StatusBadge } from '@/components/dashboard/ui';


export default function BookingDetailPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  
  const fetchUrl = `/api/dashboard/bookings/${bookingId}`;
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

  const [updating, setUpdating] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;

  const { booking, payments = [] } = data;

  const updateStatus = async (status) => {
    setUpdating(true);
    await axios.patch(`/api/dashboard/bookings/${bookingId}`, { status });
    setUpdating(false);
    refetch();
  };

  const totalPaid = payments.filter(p => p.status === 'success').reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link href="/dashboard/bookings" className="text-sm text-text-3 hover:text-text transition-colors mb-2 block">
            ← Back to Bookings
          </Link>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">
            {booking.booking_reference || `Booking #${booking.booking_id}`}
          </h1>
          <p className="text-sm text-text-2 mt-1">
            Created {new Date(booking.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={booking.status} />
          {booking.status !== 'cancelled' && (
            <div className="flex gap-2">
              {booking.status === 'pending' && (
                <button
                  onClick={() => updateStatus('confirmed')}
                  disabled={updating}
                  className="px-4 py-2 rounded-lg bg-success/20 border border-success/30 text-success text-sm font-semibold hover:bg-success/30 transition disabled:opacity-50"
                >
                  ✓ Confirm
                </button>
              )}
              <button
                onClick={() => updateStatus('cancelled')}
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm font-semibold hover:bg-danger/20 transition disabled:opacity-50"
              >
                ✕ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tour & Schedule */}
        <div className="bg-white/5 border border-border rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-3 mb-4">Tour Details</h2>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs text-text-3 mb-0.5">Tour</div>
              <Link href={`/dashboard/tours/${booking.tour_id}`} className="font-semibold text-primary-light hover:underline">
                {booking.tour_title}
              </Link>
            </div>
            {booking.location && (
              <div>
                <div className="text-xs text-text-3 mb-0.5">Location</div>
                <div className="text-sm text-text-2">📍 {booking.location}</div>
              </div>
            )}
            {booking.tour_date && (
              <div>
                <div className="text-xs text-text-3 mb-0.5">Schedule</div>
                <div className="text-sm text-text-2">
                  📅 {new Date(booking.tour_date).toLocaleDateString()}
                  {booking.start_time && ` · ${booking.start_time}`}
                  {booking.end_time && ` — ${booking.end_time}`}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-text-3 mb-0.5">Seats Booked</div>
              <div className="text-2xl font-extrabold text-text">{booking.seats}</div>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white/5 border border-border rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-3 mb-4">Customer</h2>
          {booking.customer_name ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary-light">
                  {booking.customer_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-text">{booking.customer_name}</div>
                  <div className="text-sm text-text-2">{booking.customer_email}</div>
                </div>
              </div>
              {booking.customer_phone && (
                <div className="text-sm text-text-3">📞 {booking.customer_phone}</div>
              )}
              {booking.customer_id && (
                <Link
                  href={`/dashboard/customers/${booking.customer_id}`}
                  className="text-sm text-primary-light hover:underline mt-1"
                >
                  View Customer Profile →
                </Link>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-3">No customer linked</p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-white/5 border border-border rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-3">Payment</h2>
            <div className="text-right">
              <div className="text-xs text-text-3">Total Charged</div>
              <div className="text-2xl font-extrabold text-text">${Number(booking.total_price || 0).toFixed(2)}</div>
            </div>
          </div>

          {payments.length === 0 ? (
            <p className="text-sm text-text-3">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-custom">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid At</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.payment_id}>
                      <td className="capitalize">{p.provider || '—'}</td>
                      <td>
                        <code className="text-xs text-primary-light">{p.transaction_id || '—'}</code>
                      </td>
                      <td className="font-bold">${Number(p.amount || 0).toFixed(2)}</td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-sm text-text-3">{p.paid_at ? new Date(p.paid_at).toLocaleString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPaid > 0 && (
                <div className="mt-3 text-right text-sm text-success font-semibold">
                  ✓ ${totalPaid.toFixed(2)} confirmed received
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
