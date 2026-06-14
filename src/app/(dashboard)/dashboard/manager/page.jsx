'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function ManagerDashboard() {
  const { website } = useAppContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load admin dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading operations...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Operations Overview</h1>
        <p className="mt-1 text-gray-600">Manage your tours, bookings, and customer interactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl border border-gray-200 shadow-sm bg-white">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${data?.metrics?.revenue || 0}</p>
        </div>
        <div className="p-6 rounded-3xl border border-gray-200 shadow-sm bg-white">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Bookings</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.metrics?.bookings || 0}</p>
        </div>
        <div className="p-6 rounded-3xl border border-gray-200 shadow-sm bg-white">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Customers</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.metrics?.customers || 0}</p>
        </div>
        <div className="p-6 rounded-3xl border border-gray-200 shadow-sm bg-white">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Active Tours</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.metrics?.active_tours || 0}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {data?.recentActivity?.length > 0 ? (
            data.recentActivity.map(activity => (
              <div key={activity.booking_id} className="p-6 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{activity.customer_name} booked {activity.tour_title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">৳{activity.total_price}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${activity.status === 'confirmed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No recent activity found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
