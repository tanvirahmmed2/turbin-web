'use client';
import { useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';
import Link from 'next/link';

export function BookingForm({ tour, slug }) {
  const [seats, setSeats] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingId, setBookingId] = useState(null);

  const maxSeats = Math.min(tour.available_seats, 10);
  const totalPrice = seats * parseFloat(tour.base_price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await axios.post(`/api/t/${slug}/tours/${tour.tour_id}/book`, {
        tenantId: tour.tenant_id,
        tourId: tour.tour_id,
        scheduleId: tour.schedule_id,
        seats,
        totalPrice,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      setBookingId(res.data.bookingId);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.error || 'Failed to complete booking.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto text-emerald-600">🎉</div>
        <h3 className="text-2xl font-bold text-emerald-900 mb-2">Booking Confirmed!</h3>
        <p className="text-emerald-700 mb-8 max-w-sm mx-auto">
          Your booking (ID: #{bookingId}) for {tour.title} has been successfully created. We've sent a confirmation to {formData.email}.
        </p>
        <Link href={`/t/${slug}`} className="btn-custom-primary inline-block">Return to Home</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {status === 'error' && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="bg-bg-2 rounded-2xl p-6 border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Reservation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-text-2 mb-1">Date</div>
            <div className="font-bold text-text">
              {new Date(tour.tour_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-sm text-text-2 mb-1">Number of Travelers</div>
            <select 
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value, 10))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {Array.from({ length: maxSeats }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 mt-2">Primary Traveler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-text-2 mb-2">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Jane Doe" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-2 mb-2">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="jane@example.com" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-text-2 mb-2">Phone Number</label>
            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6 mt-2">
        <div className="flex justify-between items-center mb-6">
          <div className="text-text-2">Total Amount</div>
          <div className="text-3xl font-black text-primary-light">${totalPrice.toFixed(2)}</div>
        </div>
        
        <button disabled={status === 'loading'} type="submit" className="btn-custom-primary w-full flex justify-center items-center h-14 text-lg">
          {status === 'loading' ? <LoadingSpinner /> : 'Confirm Booking'}
        </button>
        <p className="text-center text-xs text-text-3 mt-4">By confirming, you agree to our terms of service and cancellation policy.</p>
      </div>
    </form>
  );
}
