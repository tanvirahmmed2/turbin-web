'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { downloadReceipt } from '@/lib/receipt';
import { useAppContext } from '@/components/helper/Context';

export default function VerifyTicket() {
  const { website } = useAppContext();
  const [bookingId, setBookingId] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      const res = await axios.get(`/api/verify-ticket?booking_id=${bookingId.trim()}`);
      setTicket(res.data.ticket);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to verify ticket. Please check the Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Verify Ticket</h1>
          <p className="mt-2 text-gray-600">Enter your Booking ID to check the status of your tour reservation.</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-gray-200 sm:px-10">
          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="bookingId" className="block text-sm font-medium text-gray-700">
                Booking ID
              </label>
              <div className="mt-1">
                <input
                  id="bookingId"
                  name="bookingId"
                  type="text"
                  required
                  placeholder="e.g. 1024"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !bookingId}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Verify Ticket'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {ticket && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Ticket Details</h3>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                  ticket.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  ticket.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.status.toUpperCase()}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Tour</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{ticket.tour_title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{new Date(ticket.tour_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Seats</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{ticket.seats}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Customer</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{ticket.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Total Price</p>
                    <p className="text-sm font-bold text-blue-600 mt-1">৳{ticket.total_price}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                 <button 
                   onClick={() => downloadReceipt(ticket, website)}
                   className="w-full sm:w-auto flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none transition-colors"
                 >
                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                   Download Receipt
                 </button>
                 <Link 
                   href={`/tours/${ticket.tour_slug}`}
                   className="w-full sm:w-auto flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                 >
                   View Tour Page &rarr;
                 </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
