'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function TenantHomePage() {
  const { slug } = useParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = useCallback(async () => {
    try {
      const res = await axios.get(`/api/t/${slug}/tours`);
      setTours(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <>
      <section className="py-[100px] px-8 text-center bg-surface-2 border-b border-border">
        <h1 className="text-5xl font-extrabold mb-4 text-text">Discover Your Next Adventure</h1>
        <p className="text-xl text-text-2 max-w-[600px] mx-auto mb-8">
          Book unforgettable experiences and explore the world with us.
        </p>
        <Link href={`/t/${slug}/tours`} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 btn-lg">
          View All Tours
        </Link>
      </section>

      <section className="py-20 px-8 max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-center">Featured Tours</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 mt-10">
          {tours.length === 0 ? (
            <p className="text-muted text-center col-span-full">No tours published yet.</p>
          ) : (
            tours.map(tour => (
              <div key={tour.id} className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-border-hover">
                <div className="w-full h-[200px] bg-bg-3 flex items-center justify-center text-5xl">🗺️</div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                  <div className="text-lg font-extrabold text-primary-light mb-4">${Number(tour.price).toFixed(2)}</div>
                  <p className="text-muted text-sm mb-6 line-clamp-2">
                    {tour.description || 'Join us for this amazing tour.'}
                  </p>
                  <Link href={`/t/${slug}/tours/${tour.id}`} className="px-5 py-2.5 rounded-xl bg-transparent border border-border text-text font-bold text-sm hover:bg-white/5 transition disabled:opacity-50 w-full text-center inline-block">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
