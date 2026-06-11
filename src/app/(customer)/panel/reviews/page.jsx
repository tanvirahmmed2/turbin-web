'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/customer/reviews');
        setReviews(res.data.reviews || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="mt-1 text-gray-500">Your feedback on previous tours.</p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div key={review.review_id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative">
              <div className="absolute top-6 right-6">
                 <span className={`px-2 py-1 text-xs font-semibold rounded-md ${review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                 </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{review.tour_title}</h3>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 italic">"{review.comment}"</p>
              <div className="mt-4 text-xs text-gray-600">
                Posted on {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center">
          <p className="text-gray-500">You haven't left any reviews yet.</p>
        </div>
      )}
    </div>
  );
}
