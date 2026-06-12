'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/admin/bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (booking_id, status) => {
    try {
      await axios.put('/api/admin/bookings', { booking_id, status });
      // Update local state to reflect change
      setBookings(bookings.map(b => b.booking_id === booking_id ? { ...b, status } : b));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading bookings...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
        <p className="mt-1 text-gray-600">View and manage all customer bookings.</p>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.booking_id} className="transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{booking.customer_name}</div>
                    <div className="text-xs text-gray-500">{booking.customer_email}</div>
                    {booking.phone && <div className="text-xs text-gray-400 mt-1">{booking.phone}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.tour_title}</div>
                    <div className="text-xs text-gray-500">{booking.seats} Seat{booking.seats > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(booking.tour_date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">TXN: {booking.transaction_id || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">${booking.total_price}</div>
                    {booking.separate_room && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                        + SEP. ROOM
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-400' : booking.status === 'cancelled' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateStatus(booking.booking_id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => updateStatus(booking.booking_id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => updateStatus(booking.booking_id, 'cancelled')}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No bookings found.
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
