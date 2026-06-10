'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/admin/reviews');
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review_id, currentStatus) => {
    try {
      await axios.put('/api/admin/reviews', { review_id, is_approved: !currentStatus });
      toast.success(!currentStatus ? 'Review approved' : 'Review hidden');
      setReviews(reviews.map(r => r.review_id === review_id ? { ...r, is_approved: !currentStatus } : r));
    } catch (err) {
      console.error('Failed to update review status', err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Customer Reviews</h1>
        <p className="mt-1 text-gray-400">Moderate and approve reviews before they appear on your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.review_id} className="bg-gray-800 rounded-3xl border border-[#222] p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-white font-bold">{review.customer_name}</div>
                  <div className="text-xs text-gray-500">{review.tour_title}</div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600 fill-current'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4 italic">"{review.comment}"</p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-[#222]">
              <span className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
              <button
                onClick={() => toggleApproval(review.review_id, review.is_approved)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  review.is_approved 
                    ? 'bg-green-900/50 text-green-400 hover:bg-green-900' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {review.is_approved ? 'Approved' : 'Hidden'}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-12 text-center text-gray-500 bg-gray-800 rounded-3xl border border-[#222]">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
