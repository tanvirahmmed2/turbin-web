'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function TourDetailsPage() {
  const { tourId } = useParams();
  const { website } = useAppContext();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`/api/tours/${tourId}`);
        setTour(response.data.tour);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [tourId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tour not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
              {tour.location}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              {tour.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {tour.description}
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div>
                <span className="block text-sm text-gray-500">Starting from</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${tour.base_price}
                </span>
              </div>
              <button 
                className="px-8 py-4 rounded-xl text-white font-semibold transition-transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: website?.theme_color || '#3b82f6', boxShadow: `0 10px 15px -3px ${website?.theme_color}40` }}
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl relative">
            <img 
              src={`https://source.unsplash.com/random/800x600/?${encodeURIComponent(tour.location || 'travel')}`} 
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Itinerary</h2>
            
            {tour.activities?.length > 0 ? (
              <div className="space-y-6">
                {tour.activities.map((activity, idx) => (
                  <div key={activity.activity_id} className="relative pl-8 pb-8 border-l border-gray-200 dark:border-gray-800 last:border-0 last:pb-0">
                    <div 
                      className="absolute left-[-9px] top-0 w-4 h-4 rounded-full"
                      style={{ backgroundColor: website?.theme_color || '#3b82f6' }}
                    />
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Day {activity.day_number}: {activity.title}</h3>
                        <span className="text-sm text-gray-500 bg-white dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800">
                          {activity.start_time?.slice(0, 5)} - {activity.end_time?.slice(0, 5)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{activity.description}</p>
                      {activity.location && (
                        <p className="text-sm font-medium text-gray-500 mt-4 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {activity.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No itinerary details available.</p>
            )}
          </div>

          {/* Schedules */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Schedules</h2>
            
            {tour.schedules?.length > 0 ? (
              <div className="space-y-4">
                {tour.schedules.map(schedule => {
                  const date = new Date(schedule.tour_date);
                  return (
                    <div key={schedule.schedule_id} className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-md font-medium ${schedule.available_seats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {schedule.available_seats} seats left
                        </span>
                      </div>
                      <button 
                        className="w-full py-2 rounded-lg font-medium transition-colors"
                        style={{ 
                          backgroundColor: schedule.available_seats > 0 ? (website?.theme_color || '#3b82f6') : '#d1d5db',
                          color: schedule.available_seats > 0 ? '#fff' : '#4b5563',
                          cursor: schedule.available_seats > 0 ? 'pointer' : 'not-allowed'
                        }}
                        disabled={schedule.available_seats === 0}
                      >
                        {schedule.available_seats > 0 ? 'Select Date' : 'Sold Out'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                <p className="text-gray-500 dark:text-gray-400">No upcoming schedules available.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
