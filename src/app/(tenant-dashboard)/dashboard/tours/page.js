'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, EmptyState, StatCard, StatusBadge } from '@/components/dashboard/ui';


export default function ToursPage() {
  
  const fetchUrl = '/api/dashboard/tours';
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

  const tours = data?.tours || [];

  return (
    <div className={"w-full"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tours</h1>
        <Link href="/dashboard/tours/create" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 btn-sm">+ Create Tour</Link>
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        {tours.length === 0 ? (
          <EmptyState icon="🗺️" title="No tours yet" subtitle="Create your first tour to start accepting bookings." />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tours.map((t) => (
                  <tr key={t.id}>
                    <td className="font-medium">{t.title}</td>
                    <td className="text-text-2">{t.location || '—'}</td>
                    <td className="text-text-2">{t.duration_days ? `${t.duration_days}d` : '—'}</td>
                    <td className="font-bold">${Number(t.price).toFixed(0)}</td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <Link href={`/dashboard/tours/${t.id}`} className="text-primary-light text-xs mr-3 hover:underline">
                        Edit
                      </Link>
                    </td>
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
