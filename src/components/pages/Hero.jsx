'use client';

import Link from 'next/link';
import { useAppContext } from '@/components/helper/Context';

export default function Hero() {
  const { website } = useAppContext();
  
  if (!website) return null;

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
                  <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80" alt="Travel" className="w-full h-full object-cover" />
                </div>
                <div className="h-1/3 rounded-2xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80" alt="Travel" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-1/3 rounded-2xl overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&q=80" alt="Travel" className="w-full h-full object-cover" />
                </div>
                <div className="h-2/3 rounded-2xl overflow-hidden relative">
                   <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80" alt="Travel" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
