'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, StatusBadge } from '@/components/dashboard/ui';

export default function TenantDashboardHome() {
  
  const fetchUrl = '/api/dashboard/overview';
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

  const { stats, recentBookings = [], upcomingTours = [] } = data;

  const STATS_CONFIG = [
    { label: 'Bookings Today', value: stats.bookingsToday, icon: '📝' },
    { label: 'Revenue Today', value: `$${Number(stats.revenueToday).toFixed(2)}`, icon: '💰' },
    { label: 'Active Tours', value: stats.activeTours, icon: '🗺️' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: '👥' },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight">Overview</h1>
          <p className="text-xs text-text-3 mt-1.5 uppercase tracking-wider font-bold">Operation Center</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {STATS_CONFIG.map((s) => (
          <div 
            key={s.label} 
            className="relative border border-slate-100 rounded-2xl p-6 bg-white shadow-sm shadow-slate-100/50 transition-all duration-300 hover:border-slate-200 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-center gap-4 mb-4">
              <div className="text-[10px] text-text-3 font-bold uppercase tracking-wider">{s.label}</div>
              <div className="text-xl filter drop-shadow-[0_4px_8px_rgba(99,102,241,0.08)]">{s.icon}</div>
            </div>
            <div className="text-3xl font-black text-text tracking-tight leading-none">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-text tracking-tight">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="text-xs text-primary hover:underline font-bold">
              View all →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-text-3 text-sm py-8 text-center font-semibold">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-custom">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Tour</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td className="text-sm font-bold text-text">{b.customer_name || '—'}</td>
                      <td className="text-sm text-text-2">{b.tour_title}</td>
                      <td><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Tours */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm shadow-slate-100/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-text tracking-tight">Upcoming Schedules</h3>
            <Link href="/dashboard/schedules" className="text-xs text-primary hover:underline font-bold">
              View all →
            </Link>
          </div>
          {upcomingTours.length === 0 ? (
            <p className="text-text-3 text-sm py-8 text-center font-semibold">No upcoming schedules.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-custom">
                <thead>
                  <tr>
                    <th>Tour</th>
                    <th>Date</th>
                    <th>Seats Available</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTours.map((t) => (
                    <tr key={t.schedule_id}>
                      <td className="text-sm font-bold text-text">{t.tour_title}</td>
                      <td className="text-xs text-text-2">
                        {new Date(t.start_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="text-sm text-text font-bold">{t.available_seats ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
