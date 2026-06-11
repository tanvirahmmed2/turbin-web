'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OwnerAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/admin/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading analytics...</div>;
  if (!data) return <div className="text-center p-12 text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
        <p className="mt-1 text-gray-400">High-level overview of your tour business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-6">
          <div className="text-gray-400 text-sm font-medium mb-2">Total Revenue</div>
          <div className="text-3xl font-bold text-green-400">${data.stats.total_revenue}</div>
        </div>
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-6">
          <div className="text-gray-400 text-sm font-medium mb-2">Total Bookings</div>
          <div className="text-3xl font-bold text-blue-400">{data.stats.total_bookings}</div>
        </div>
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-6">
          <div className="text-gray-400 text-sm font-medium mb-2">Active Customers</div>
          <div className="text-3xl font-bold text-white">{data.stats.total_customers}</div>
        </div>
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-6">
          <div className="text-gray-400 text-sm font-medium mb-2">Active Tours</div>
          <div className="text-3xl font-bold text-white">{data.stats.active_tours}</div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl border border-[#222] overflow-hidden">
        <div className="p-6 border-b border-[#222]">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#222]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {data.recentBookings.map((booking) => (
                <tr key={booking.booking_id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                    {booking.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {booking.tour_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize
                      ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400' : 
                        booking.status === 'cancelled' ? 'bg-red-900/50 text-red-400' : 
                        'bg-yellow-900/50 text-yellow-400'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    ${booking.total_price}
                  </td>
                </tr>
              ))}
              {data.recentBookings.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No recent bookings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
