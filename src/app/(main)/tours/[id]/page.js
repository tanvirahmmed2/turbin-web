'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function TourDetailsPage() {
  const { slug, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`/api/t/${slug}/tours/${id}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tour details');
    } finally {
      setLoading(false);
    }
  }, [slug, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-bold"><div className="text-4xl mb-4">😔</div>{error}<Link href={`/t/${slug}`} className="mt-4 text-primary underline">Go back</Link></div>;

  const { tour, schedules } = data;

  return (
    <div className="bg-bg-2 min-h-screen pb-24">
      {/* Hero */}
      <section className="bg-surface border-b border-border py-16 px-8">
        <div className="max-w-[1000px] mx-auto">
          <Link href={`/t/${slug}`} className="text-primary font-semibold hover:underline mb-6 inline-block">
            ← Back to Tours
          </Link>
          <div className="w-full h-[400px] bg-bg-3 rounded-3xl flex items-center justify-center text-7xl mb-10 shadow-sm border border-border">🗺️</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text tracking-tight mb-4">{tour.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-text-2 font-medium mb-8">
            <span className="flex items-center gap-2">📍 {tour.location || 'Flexible Location'}</span>
            <span className="flex items-center gap-2">💵 From ${tour.base_price}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1000px] mx-auto px-8 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-text">Overview</h2>
          <div className="prose prose-slate max-w-none text-text-2 leading-relaxed">
            {tour.description ? <p>{tour.description}</p> : <p>No description provided for this tour.</p>}
          </div>
          
          <h2 className="text-2xl font-bold mt-12 mb-6 text-text">Available Schedules</h2>
          {schedules.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h3 className="text-lg font-bold text-text mb-1">No schedules available</h3>
              <p className="text-text-2">Check back later for new dates.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {schedules.map(s => (
                <div key={s.schedule_id} className="bg-white border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg text-text">
                      {new Date(s.tour_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-text-2 text-sm">
                      {s.start_time ? s.start_time.substring(0, 5) : 'Flexible start'} 
                      {s.end_time ? ` - ${s.end_time.substring(0, 5)}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary-light">{s.available_seats} seats left</div>
                      <div className="text-xs text-text-3">out of {s.max_seats}</div>
                    </div>
                    {s.available_seats > 0 ? (
                      <Link href={`/t/${slug}/tours/${tour.tour_id}/book?schedule=${s.schedule_id}`} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 whitespace-nowrap">
                        Book Now
                      </Link>
                    ) : (
                      <button disabled className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm whitespace-nowrap">
                        Sold Out
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-3xl p-6 sticky top-24 shadow-sm shadow-slate-100/50">
            <h3 className="text-xl font-bold text-text mb-2">Book this tour</h3>
            <p className="text-text-2 text-sm mb-6">Select a schedule from the list to secure your spot.</p>
            <div className="text-3xl font-black text-primary-light mb-6 border-b border-slate-100 pb-6">
              ${Number(tour.base_price).toFixed(2)}
              <span className="text-base text-text-3 font-medium tracking-normal block mt-1">per person</span>
            </div>
            <ul className="text-sm text-text-2 flex flex-col gap-3">
              <li className="flex items-center gap-2">✅ Instant confirmation</li>
              <li className="flex items-center gap-2">✅ Secure payment</li>
              <li className="flex items-center gap-2">✅ Free cancellation (up to 24h)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
