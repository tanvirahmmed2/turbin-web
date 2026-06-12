'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Tour from '@/components/card/Tour';
import { useAppContext } from '@/components/helper/Context';

export default function SpotDetailsPage() {
  const { spotId } = useParams();
  const router = useRouter();
  const { website } = useAppContext();
  const themeColor = website?.theme_color || '#3b82f6';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpotData = async () => {
      try {
        const response = await axios.get(`/api/spots/${spotId}`);
        setData(response.data.spot);
      } catch (err) {
        console.error('Error fetching spot:', err);
        setError('Failed to load spot details.');
      } finally {
        setLoading(false);
      }
    };

    if (spotId) {
      fetchSpotData();
    }
  }, [spotId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-24 pb-24">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Spot Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The spot you are looking for does not exist or has been removed.'}</p>
          <button 
            onClick={() => router.push('/spots')}
            className="px-6 py-3 rounded-xl text-white font-medium transition-colors"
            style={{ backgroundColor: themeColor }}
          >
            Back to Spots
          </button>
        </div>
      </main>
    );
  }

  const { tours = [] } = data;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/spots')}
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to all spots
        </button>

        {/* Spot Header Section */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Side */}
            <div className="h-[400px] lg:h-auto relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10 lg:hidden" />
              <img 
                src={data.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${data.spot_id}`} 
                alt={data.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center relative">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 text-sm font-semibold mb-6 w-max border border-blue-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{data.location}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                {data.name}
              </h1>
              
              <div 
                className="prose prose-lg text-gray-600 mb-8 max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
              
              {tours.length > 0 && (
                <div className="flex items-center space-x-4 border-t border-gray-100 pt-8 mt-auto">
                  <div className="flex -space-x-4">
                    {/* Just visual placeholders to show activity */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm">1</div>
                    <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-green-600 font-bold text-xs shadow-sm">2</div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 font-bold text-xs shadow-sm">3</div>
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Included in <strong className="text-gray-900">{tours.length} {tours.length === 1 ? 'tour' : 'tours'}</strong>
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Tours Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Tours Visiting This Spot</h2>
              <p className="text-gray-500 mt-2 text-lg">Explore our packages that include a visit to {data.name}.</p>
            </div>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map(tour => (
                <Tour key={tour.tour_id} tour={tour} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 shadow-sm">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No active tours</h3>
              <p className="text-gray-500 text-lg">There are currently no active tours that visit this spot.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
