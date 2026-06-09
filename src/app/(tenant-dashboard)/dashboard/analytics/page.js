'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/dashboard/ui';


export default function AnalyticsPage() {
  
  const fetchUrl = '/api/dashboard/analytics';
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

  const { metrics = {}, topTours = [] } = data;

  const CARDS = [
    { label: 'Total Revenue',    value: `$${Number(metrics.total_revenue  || 0).toLocaleString()}` },
    { label: 'Revenue (30d)',    value: `$${Number(metrics.revenue_30d     || 0).toLocaleString()}` },
    { label: 'Total Bookings',   value: metrics.total_bookings  || 0 },
    { label: 'Bookings (30d)',   value: metrics.bookings_30d    || 0 },
    { label: 'Active Tours',     value: metrics.total_tours     || 0 },
    { label: 'Total Customers',  value: metrics.total_customers || 0 },
  ];

  const maxBookings = Math.max(...topTours.map((t) => parseInt(t.booking_count) || 0), 1);

  return (
    <div className={"w-full"}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {CARDS.map((c) => (
          <div key={c.label} className="bg-white/5 border border-border rounded-2xl p-6">
            <div className={"text-[0.8125rem] text-text-2 mb-2 font-medium uppercase tracking-wider"}>{c.label}</div>
            <div className={"text-2xl font-extrabold text-text tracking-tight"}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Top Performing Tours</h3>
        {topTours.length === 0 ? (
          <EmptyState icon="📈" title="No tour data yet" />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr><th>Tour</th><th>Bookings</th><th>Revenue</th><th>Performance</th></tr>
              </thead>
              <tbody>
                {topTours.map((t, i) => {
                  const pct = (parseInt(t.booking_count) / maxBookings) * 100;
                  return (
                    <tr key={i}>
                      <td className="font-medium">{t.title}</td>
                      <td className="font-bold">{t.booking_count}</td>
                      <td className="font-bold text-success">
                        ${Number(t.revenue || 0).toFixed(0)}
                      </td>
                      <td className="min-w-[120px]">
                        <div className="h-2 bg-surface rounded overflow-hidden">
                          <div
                            className="h-full rounded bg-gradient-primary"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
