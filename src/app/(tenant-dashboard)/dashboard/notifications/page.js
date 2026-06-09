'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import { useState } from 'react';

import { LoadingSpinner, ErrorMessage, EmptyState, StatusBadge } from '@/components/dashboard/ui';


export default function NotificationsPage() {
  
  const fetchUrl = '/api/dashboard/notifications';
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

  const [marking, setMarking] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />;

  const { notifications = [], unread = 0 } = data;

  const markAll = async () => {
    setMarking(true);
    await axios.patch('/api/dashboard/notifications', { mark_all: true });
    setMarking(false);
    refetch();
  };

  const markOne = async (id) => {
    await axios.patch('/api/dashboard/notifications', { notification_id: id });
    refetch();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          {unread > 0 && (
            <span className="text-sm text-text-3 mt-0.5 block">{unread} unread</span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAll}
            disabled={marking}
            className="text-sm text-primary-light hover:text-primary font-medium transition-colors disabled:opacity-50"
          >
            {marking ? 'Marking…' : 'Mark all as read'}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications"
          subtitle="You're all caught up! Notifications about bookings, payments and system events will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-150 ${
                n.is_read
                  ? 'bg-white/2 border-border'
                  : 'bg-primary/5 border-primary/20'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.is_read ? 'bg-border' : 'bg-primary'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className={`text-sm font-semibold ${n.is_read ? 'text-text-2' : 'text-text'}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-text-3 shrink-0 mt-0.5">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
                {n.message && (
                  <p className="text-sm text-text-3 mt-0.5 leading-relaxed">{n.message}</p>
                )}
              </div>
              {!n.is_read && (
                <button
                  onClick={() => markOne(n.notification_id)}
                  className="shrink-0 text-xs text-text-3 hover:text-text transition-colors mt-0.5"
                  title="Mark as read"
                >
                  ✓
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
