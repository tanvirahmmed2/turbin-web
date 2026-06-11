'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Tour from '@/components/card/Tour';

export default function UpcomingTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/api/tours');
        setTours(response.data.tours || []);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Tours</h2>
          <p className="mt-2 text-gray-600">Handpicked destinations for your next adventure.</p>
        </div>
      </div>

      {tours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map(tour => (
            <Tour key={tour.tour_id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-3xl border border-gray-200 bg-white">
          <h3 className="text-xl font-medium text-gray-900">No tours available right now</h3>
          <p className="mt-2 text-gray-500">Please check back later for new adventures.</p>
        </div>
      )}
    </section>
  );
}
