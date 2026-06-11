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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tour not found</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
              <span>{tour.starting_location}</span>
              {tour.finish_location && tour.finish_location !== tour.starting_location && (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  <span>{tour.finish_location}</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              {tour.title}
            </h1>
            <p className="text-lg text-gray-600">
              {tour.description}
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div>
                <span className="block text-sm text-gray-500">Starting from</span>
                <span className="text-3xl font-bold text-gray-900">
                  ${tour.base_price}
                </span>
                {tour.separate_room_available && (
                  <div className="mt-2 text-sm font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-md border border-blue-100">
                    + ${tour.separate_room_charge} for Separate Room
                  </div>
                )}
              </div>
              <button 
                className="px-8 py-4 rounded-xl text-white font-semibold transition-transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: website?.theme_color || '#3b82f6', boxShadow: `0 10px 15px -3px ${website?.theme_color}40` }}
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-xl relative bg-white">
            <img 
              src={`https://source.unsplash.com/random/800x600/?${encodeURIComponent(tour.finish_location || tour.starting_location || 'travel')}`} 
              alt={tour.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Features */}
            {tour.features?.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Tour Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.features.map(feature => (
                    <div key={feature.feature_id} className="flex items-center space-x-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Schedules */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Schedules</h2>
            
            {tour.schedules?.length > 0 ? (
              <div className="space-y-4">
                {tour.schedules.map(schedule => {
                  const date = new Date(schedule.tour_date);
                  return (
                    <div key={schedule.schedule_id} className="p-5 bg-white rounded-2xl border border-gray-200 flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
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
              <div className="p-6 rounded-2xl border border-gray-200 text-center bg-white">
                <p className="text-gray-500">No upcoming schedules available.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
