'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';

import { LoadingSpinner, ErrorMessage, EmptyState } from '@/components/dashboard/ui';


export default function CustomersPage() {
  
  const fetchUrl = '/api/dashboard/customers';
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

  const customers = data?.customers || [];

  return (
    <div className={"w-full"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <span className="text-muted text-sm">{customers.length} registered</span>
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        {customers.length === 0 ? (
          <EmptyState icon="👥" title="No customers yet" subtitle="Customers register on your public site." />
        ) : (
          <div className={"overflow-x-auto"}>
            <table className={"w-full border-collapse table-custom"}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Bookings</th>
                  <th>Since</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.customer_id}>
                    <td>
                      <Link href={`/dashboard/customers/${c.customer_id}`} className="font-medium text-primary-light hover:underline">
                        {c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—'}
                      </Link>
                    </td>
                    <td className="text-text-2">{c.email}</td>
                    <td className="text-text-3">{c.phone || '—'}</td>
                    <td><span className="badge badge-primary">{c.booking_count}</span></td>
                    <td className="text-sm text-muted">{new Date(c.created_at).toLocaleDateString()}</td>
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
