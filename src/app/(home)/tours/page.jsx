'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Tour from '@/components/card/Tour';

export default function ToursPage() {
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
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">All Tours</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Browse our complete collection of adventures and find your perfect getaway.
          </p>
        </div>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
              <Tour key={tour.tour_id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">No tours available right now</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Please check back later for new adventures.</p>
          </div>
        )}
      </div>
    </main>
  );
}
