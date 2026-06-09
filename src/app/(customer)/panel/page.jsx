'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function CustomerDashboard() {
  const { website } = useAppContext();
  const [data, setData] = useState({ stats: null, upcoming_bookings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/customer/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-gray-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-gray-200 rounded col-span-2"></div><div className="h-2 bg-gray-200 rounded col-span-1"></div></div><div className="h-2 bg-gray-200 rounded"></div></div></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back!</h1>
        <p className="mt-1 text-gray-500">Here is an overview of your recent activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-6">
          <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{data.stats?.total_bookings || 0}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center space-x-6">
          <div className="p-4 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">${data.stats?.total_spent || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Tours</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.upcoming_bookings?.length > 0 ? (
            data.upcoming_bookings.map(booking => (
              <div key={booking.booking_id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{booking.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {new Date(booking.tour_date).toLocaleDateString()} • {booking.seats} Seats
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No upcoming tours. Time to book an adventure!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
