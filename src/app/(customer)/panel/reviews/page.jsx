'use client';

export default function CustomerReviews() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
        <p className="mt-1 text-gray-500">Manage feedback for tours you have attended.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-500 max-w-md mx-auto">You can leave a review after completing one of our tours. We'd love to hear about your experience!</p>
      </div>
    </div>
  );
}
