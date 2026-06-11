'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GuideTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await axios.get('/api/admin/tours');
        setTours(res.data.tours || []);
      } catch (err) {
        console.error('Failed to load tours', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading tours...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tour Catalog</h1>
        <p className="mt-1 text-gray-600">Review all active tour itineraries and details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour.tour_id} className="rounded-3xl border border-gray-200 p-6 hover:border-gray-600 transition-colors bg-white">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{tour.title}</h3>
              <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${tour.status === 'active' ? 'bg-green-100 text-green-700 border border-green-500/20' : ' text-gray-500 bg-gray-100'} bg-white`}>
                {tour.status}
              </span>
            </div>
            <div className="space-y-2 mb-6">
              <div className="flex text-sm text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span className="truncate">
                  {tour.starting_location} 
                  {tour.finish_location && tour.finish_location !== tour.starting_location && ` → ${tour.finish_location}`}
                </span>
              </div>
              <div className="flex text-sm text-gray-600">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {tour.spots_count} activities/spots
              </div>
            </div>
          </div>
        ))}
        {tours.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 rounded-3xl border border-gray-200 bg-white">
            No tours found in the system.
          </div>
        )}
      </div>
    </div>
  );
}
