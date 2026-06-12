'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAppContext } from '@/components/helper/Context';

export default function SpotsPage() {
  const { website } = useAppContext();
  const themeColor = website?.theme_color || '#3b82f6';
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get('/api/spots');
        setSpots(response.data.spots || []);
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Explore Tourist Spots
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Discover breathtaking locations and iconic landmarks.
          </p>
        </div>

        {/* Spots Grid */}
        {spots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spots.map((spot) => (
              <Link 
                href={`/spots/${spot.spot_id}`} 
                key={spot.spot_id}
                className="group relative flex flex-col justify-between bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <img 
                    src={spot.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${spot.spot_id}`} 
                    alt={spot.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-4 left-4 z-20 flex items-center text-white text-sm font-medium">
                    <svg className="w-4 h-4 mr-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="truncate max-w-[200px] drop-shadow-md">{spot.location}</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors" style={{ '--tw-hover-text-color': themeColor } }>
                    {spot.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                    {spot.description?.replace(/<[^>]*>?/gm, '') || ''}
                  </p>
                  
                  <div className="flex items-center text-sm font-semibold" style={{ color: themeColor }}>
                    Explore Details
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900">No spots found</h3>
            <p className="text-gray-500 mt-2">Check back later for new amazing destinations.</p>
          </div>
        )}

      </div>
    </main>
  );
}
