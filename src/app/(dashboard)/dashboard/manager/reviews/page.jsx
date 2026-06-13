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

  const deleteReview = async (review_id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/admin/reviews?review_id=${review_id}`);
      toast.success('Review deleted');
      setReviews(reviews.filter(r => r.review_id !== review_id));
    } catch (err) {
      console.error('Failed to delete review', err);
      toast.error('Failed to delete review');
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
        <p className="mt-1 text-gray-600">Moderate and approve reviews before they appear on your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.review_id} className="rounded-3xl border border-gray-200 p-6 flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-gray-900 font-bold">{review.customer_name}</div>
                  <div className="mt-1">
                    {review.is_approved ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4 italic">"{review.comment}"</p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => deleteReview(review.review_id)}
                  className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Review"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <button
                  onClick={() => toggleApproval(review.review_id, review.is_approved)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${ review.is_approved ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700' }`}
                >
                  {review.is_approved ? 'Hide' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-12 text-center text-gray-500 rounded-3xl border border-gray-200 bg-white">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
