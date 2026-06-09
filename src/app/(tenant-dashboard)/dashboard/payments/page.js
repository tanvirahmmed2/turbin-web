'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '@/components/dashboard/ui';


export default function PaymentsPage() {
  
  const fetchUrl = '/api/dashboard/payments';
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

  const { stats = {}, payments = [] } = data;

  return (
    <div className={"w-full"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue',  value: `$${Number(stats.total_revenue || 0).toLocaleString()}` },
          { label: 'Revenue (30d)',  value: `$${Number(stats.revenue_30d   || 0).toLocaleString()}` },
          { label: 'Pending',        value: stats.pending_count || 0 },
          { label: 'Transactions',   value: stats.total_count   || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-border rounded-2xl p-6">
            <div className={"text-[0.8125rem] text-text-2 mb-2 font-medium uppercase tracking-wider"}>{s.label}</div>
            <div className={"text-2xl font-extrabold text-text tracking-tight"}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        {payments.length === 0 ? (
          <EmptyState icon="💳" title="No payment records yet" />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr>
                  <th>Booking Ref</th><th>Customer</th><th>Amount</th>
                  <th>Method</th><th>Date</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.payment_id}>
                    <td>
                      <code className="text-xs text-primary-light">
                        {p.booking_reference || '—'}
                      </code>
                    </td>
                    <td className="font-medium">{p.customer_name || '—'}</td>
                    <td className={`font-bold ${p.status === 'paid' ? 'text-success' : ''}`}>
                      ${Number(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="text-muted text-sm">{p.payment_method || '—'}</td>
                    <td className="text-sm text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td><StatusBadge status={p.status} /></td>
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
