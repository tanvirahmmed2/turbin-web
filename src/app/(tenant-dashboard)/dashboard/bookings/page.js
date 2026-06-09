'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '@/components/dashboard/ui';


export default function BookingsPage() {
  
  const fetchUrl = '/api/dashboard/bookings';
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

  const { stats = {}, bookings = [] } = data;

  return (
    <div className={"w-full"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',     value: stats.total     || 0 },
          { label: 'Confirmed', value: stats.confirmed  || 0 },
          { label: 'Pending',   value: stats.pending    || 0 },
          { label: 'Today',     value: stats.today      || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-border rounded-2xl p-6">
            <div className={"text-[0.8125rem] text-text-2 mb-2 font-medium uppercase tracking-wider"}>{s.label}</div>
            <div className={"text-2xl font-extrabold text-text tracking-tight"}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        {bookings.length === 0 ? (
          <EmptyState icon="📝" title="No bookings yet" subtitle="Share your tours to start receiving bookings." />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Tour</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td>
                      <Link href={`/dashboard/bookings/${b.booking_id}`} className="text-primary-light hover:underline font-mono text-sm">
                        {b.booking_reference || `#${b.booking_id}`}
                      </Link>
                    </td>
                    <td className="font-medium">{b.tour_title}</td>
                    <td>
                      <div>{b.customer_name || '—'}</div>
                      <div className="text-xs text-text-3">{b.customer_email}</div>
                    </td>
                    <td className="font-bold">${Number(b.total_price || 0).toFixed(2)}</td>
                    <td className="text-sm text-muted">{new Date(b.created_at).toLocaleDateString()}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
