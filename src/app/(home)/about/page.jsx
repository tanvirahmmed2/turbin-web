'use client';

import { useAppContext } from '@/components/helper/Context';
import Link from 'next/link';

export default function AboutPage() {
  const { website } = useAppContext();

  return (
    <main className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Our Mission is to Inspire Your Next Adventure
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            {website?.tagline || 'We believe that traveling is more than just visiting places. It\'s about experiencing the world in a way that changes you.'}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="h-80 rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" alt="Travelers" className="w-full h-full object-cover" />
          </div>
          <div className="h-80 md:mt-12 rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80" alt="Mountain View" className="w-full h-full object-cover" />
          </div>
          <div className="h-80 rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80" alt="Beach" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                What started as a small group of passionate travelers has grown into a premier tour booking platform. We've dedicated ourselves to curating the most unforgettable experiences across the globe.
              </p>
              <p>
                Our expert guides aren't just knowledgeable—they are locals who love their home and want to share its hidden gems with you. From the bustling streets of Tokyo to the serene landscapes of the Swiss Alps, every tour is designed with you in mind.
              </p>
            </div>
            <div className="mt-8">
              <Link 
                href="/tours" 
                className="inline-block px-8 py-4 rounded-xl text-gray-900 font-semibold transition-transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: website?.theme_color || '#3b82f6' }}
              >
                Explore Our Tours
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl border border-gray-200 text-center bg-white">
              <span className="block text-4xl font-extrabold text-gray-900 mb-2">10+</span>
              <span className="text-gray-600">Years of Experience</span>
            </div>
            <div className="p-8 rounded-3xl border border-gray-200 text-center bg-white">
              <span className="block text-4xl font-extrabold text-gray-900 mb-2">50+</span>
              <span className="text-gray-600">Destinations</span>
            </div>
            <div className="p-8 rounded-3xl border border-gray-200 text-center bg-white">
              <span className="block text-4xl font-extrabold text-gray-900 mb-2">5k+</span>
              <span className="text-gray-600">Happy Travelers</span>
            </div>
            <div className="p-8 rounded-3xl border border-gray-200 text-center bg-white">
              <span className="block text-4xl font-extrabold text-gray-900 mb-2">24/7</span>
              <span className="text-gray-600">Customer Support</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
