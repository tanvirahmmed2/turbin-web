'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function Hero() {
  const { website } = useAppContext();
  const [spotImages, setSpotImages] = useState([]);
  
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get('/api/spots');
        const spots = response.data.spots || [];
        // Extract images and take up to 4
        const images = spots.map(s => s.image).filter(Boolean);
        // If we don't have enough, pad with a fallback
        while (images.length < 4) {
          images.push(`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${images.length}`);
        }
        setSpotImages(images.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch spots for hero:', err);
      }
    };
    fetchSpots();
  }, []);

  if (!website || spotImages.length === 0) return null;

  const { hero_title, hero_subtitle, theme_color } = website;

  return (
    <div className="relative overflow-hidden bg-white min-h-[80vh] flex items-center pt-16">
      {/* Dynamic Theme Color Background Blob */}
      <div 
        className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ backgroundColor: theme_color || '#3b82f6' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {hero_title || 'Discover Your Next Great Adventure'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              {hero_subtitle || 'Explore breathtaking destinations, handpicked tours, and create memories that last a lifetime.'}
            </p>
            <div className="flex gap-4">
              <Link 
                href="/tours" 
                className="px-8 py-4 rounded-xl text-white font-semibold transition-transform hover:scale-105 shadow-lg shadow-blue-500/25"
                style={{ backgroundColor: theme_color || '#3b82f6' }}
              >
                Browse Tours
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-4 rounded-xl text-gray-900 font-semibold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block relative h-[600px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-2xl bg-white">
            {/* Bento-box style hero images grid */}
            <div className="grid grid-cols-2 gap-4 h-full p-4">
              <div className="space-y-4">
                <div className="h-2/3 rounded-2xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 to-transparent mix-blend-overlay"></div>
                  <img src={spotImages[0]} alt="Travel Destination 1" className="w-full h-full object-cover" />
                </div>
                <div className="h-1/3 rounded-2xl overflow-hidden relative">
                  <img src={spotImages[1]} alt="Travel Destination 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-1/3 rounded-2xl overflow-hidden relative">
                   <img src={spotImages[2]} alt="Travel Destination 3" className="w-full h-full object-cover" />
                </div>
                <div className="h-2/3 rounded-2xl overflow-hidden relative">
                   <img src={spotImages[3]} alt="Travel Destination 4" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
