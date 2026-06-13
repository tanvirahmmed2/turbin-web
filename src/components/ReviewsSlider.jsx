'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReviewsSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/website/reviews');
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">What Our Travelers Say</h2>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Read the experiences of adventurers who have traveled with us.</p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Adds a fading gradient on the edges to signify more scrollable content */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none hidden md:block"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none hidden md:block"></div>
        
        <div className="flex overflow-x-auto gap-8 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide px-4 md:px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {reviews.map((review) => (
            <div key={review.review_id} className="snap-center shrink-0 w-[85vw] sm:w-96 bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">"{review.comment}"</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {review.customer_name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.customer_name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </section>
  );
}
