'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/dashboard/ui';
import { BookingForm } from './BookingForm';

export default function BookingPage() {
  const { slug, id } = useParams();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('schedule');

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!scheduleId) {
      setError('Schedule required');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`/api/t/${slug}/tours/${id}/book?schedule=${scheduleId}`);
      setTour(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load booking details');
    } finally {
      setLoading(false);
    }
  }, [slug, id, scheduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-bold"><div className="text-4xl mb-4">😔</div>{error}<Link href={`/t/${slug}/tours/${id}`} className="mt-4 text-primary underline">Go back</Link></div>;

  if (tour.available_seats <= 0) {
    return (
      <div className="min-h-screen bg-bg-2 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-3xl max-w-md text-center shadow-sm">
          <div className="text-4xl mb-4">😔</div>
          <h1 className="text-xl font-bold mb-2 text-text">This schedule is sold out</h1>
          <p className="text-text-2 mb-6">Sorry, there are no seats available for this date.</p>
          <Link href={`/t/${slug}/tours/${id}`} className="btn-custom-primary inline-block">Back to schedules</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-2 min-h-screen pb-24 pt-12">
      <div className="max-w-[800px] mx-auto px-8">
        <Link href={`/t/${slug}/tours/${id}`} className="text-primary font-semibold hover:underline mb-8 inline-block">
          ← Back to Tour Details
        </Link>
        
        <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm shadow-slate-100/50">
          <div className="bg-slate-50 border-b border-border p-6 md:p-8">
            <h1 className="text-3xl font-extrabold text-text tracking-tight mb-2">Complete your booking</h1>
            <p className="text-text-2">You are booking <span className="font-bold text-text">{tour.title}</span>.</p>
          </div>
          
          <div className="p-6 md:p-8">
            <BookingForm tour={tour} slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
