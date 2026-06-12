'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function Hero() {
  const { website } = useAppContext();
  const [spots, setSpots] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get('/api/spots');
        const availableSpots = (response.data.spots || []).filter(s => s.image);
        setSpots(availableSpots);
      } catch (err) {
        console.error('Failed to fetch spots for hero:', err);
      }
    };
    fetchSpots();
  }, []);

  useEffect(() => {
    if (spots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % spots.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(interval);
  }, [spots.length]);

  if (!website) return null;

  const { hero_title, hero_subtitle, theme_color } = website;
  const primaryColor = theme_color || '#3b82f6';
  const hasImages = spots.length > 0;

  return (
    <div className="relative overflow-hidden min-h-[90vh] flex items-center justify-center pt-20 pb-12 bg-gray-900">
      {/* Dynamic Background Image Slider */}
      {hasImages ? (
        spots.map((spot, idx) => (
          <div 
            key={spot.spot_id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Gradient Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
            
            {/* Image with a subtle zoom effect when active */}
            <img 
              src={spot.image} 
              alt={spot.name} 
              className="w-full h-full object-cover"
              style={{
                transform: idx === currentIdx ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 8s ease-out'
              }}
            />
          </div>
        ))
      ) : (
        /* Fallback dark premium gradient if no spots are uploaded */
        <div 
          className="absolute inset-0 bg-gray-900 z-0"
          style={{ backgroundImage: `radial-gradient(circle at top right, ${primaryColor}30 0%, transparent 60%)` }}
        />
      )}

      {/* Cinematic Centered Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center w-full mt-10">
        
        {/* Spot Location Badge */}
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-semibold mb-8 shadow-2xl transition-all">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-3 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          {hasImages && spots[currentIdx] ? `Explore ${spots[currentIdx].name}` : 'Discover New Destinations'}
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8 drop-shadow-2xl">
          {hero_title || 'Discover Your Next Great Adventure'}
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 drop-shadow-lg font-medium leading-relaxed">
          {hero_subtitle || 'Explore breathtaking destinations, handpicked tours, and create memories that last a lifetime.'}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            href="/tours" 
            className="px-10 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] flex items-center justify-center w-full sm:w-auto min-w-[220px]"
            style={{ backgroundColor: primaryColor }}
          >
            Browse Tours
          </Link>
          <Link 
            href="/about" 
            className="px-10 py-4 rounded-full text-white font-bold text-lg bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-center w-full sm:w-auto min-w-[220px]"
          >
            Learn More
          </Link>
        </div>

        {/* Slider Navigation Indicators */}
        {hasImages && spots.length > 1 && (
          <div className="absolute -bottom-16 md:-bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-3 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
            {spots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`transition-all duration-500 rounded-full ${idx === currentIdx ? 'w-10 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
