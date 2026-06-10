'use client';

import Link from 'next/link';

export default function GuideOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Guide Portal</h1>
        <p className="mt-1 text-gray-400">Welcome. View your upcoming assignments and browse tour itineraries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/guide/job" className="block bg-gray-800 rounded-3xl border border-[#222] p-8 hover:bg-gray-750 hover:border-gray-600 transition-colors group">
          <div className="h-12 w-12 bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">My Schedule & Jobs</h2>
          <p className="text-gray-400 text-sm">Check your assigned upcoming tours, locations, and guest manifests.</p>
        </Link>
        
        <Link href="/dashboard/guide/tours" className="block bg-gray-800 rounded-3xl border border-[#222] p-8 hover:bg-gray-750 hover:border-gray-600 transition-colors group">
          <div className="h-12 w-12 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Tour Directory</h2>
          <p className="text-gray-400 text-sm">Review full itineraries, spots, and standard procedures for all active company tours.</p>
        </Link>
      </div>
    </div>
  );
}
