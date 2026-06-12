'use client';

export default function CustomerSupport() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="mt-1 text-gray-500">Get help with your bookings or account.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center">
        <div className="w-16 h-16 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Support Tickets</h3>
        <p className="text-gray-500 max-w-md mx-auto">You don't have any active support requests. If you need assistance, click the button above.</p>
      </div>
    </div>
  );
}
