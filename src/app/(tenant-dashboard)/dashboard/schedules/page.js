'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '@/components/dashboard/ui';


export default function SchedulesPage() {
  
  const fetchUrl = '/api/dashboard/schedules';
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

  const schedules = data?.schedules || [];
  const now = new Date();
  const upcoming = schedules.filter((s) => new Date(s.start_date) >= now);
  const past     = schedules.filter((s) => new Date(s.start_date) <  now);

  return (
    <div className={"w-full"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedules</h1>
        <Link href="/dashboard/schedules/create" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 btn-sm">+ Add Schedule</Link>
      </div>

      <h2 className="font-bold mb-3 text-text-2 text-base">
        Upcoming ({upcoming.length})
      </h2>
      <div className="bg-white/5 border border-border rounded-2xl p-6 mb-6">
        {upcoming.length === 0 ? (
          <EmptyState icon="📅" title="No upcoming schedules" subtitle="Add schedules to start accepting bookings." />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr><th>Tour</th><th>Start Date</th><th>End Date</th><th>Seats</th><th>Price</th><th>Status</th></tr>
              </thead>
              <tbody>
                {upcoming.map((s) => (
                  <tr key={s.schedule_id}>
                    <td className="font-medium">{s.tour_title}</td>
                    <td>{new Date(s.start_date).toLocaleDateString()}</td>
                    <td>{s.end_date ? new Date(s.end_date).toLocaleDateString() : '—'}</td>
                    <td>{s.available_seats ?? '—'}</td>
                    <td className="font-bold">
                      ${Number(s.price_override || s.base_price || 0).toFixed(0)}
                    </td>
                    <td><StatusBadge status={s.status || 'open'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="font-bold mb-3 text-text-3 text-base">
            Past ({past.length})
          </h2>
          <div className="bg-white/5 border border-border rounded-2xl p-6 opacity-65">
            <div className={"overflow-x-auto"}>
              <table className={"w-full border-collapse table-custom"}>
                <thead>
                  <tr><th>Tour</th><th>Start Date</th><th>Seats</th></tr>
                </thead>
                <tbody>
                  {past.slice(0, 10).map((s) => (
                    <tr key={s.schedule_id}>
                      <td className="font-medium">{s.tour_title}</td>
                      <td>{new Date(s.start_date).toLocaleDateString()}</td>
                      <td>{s.available_seats ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
