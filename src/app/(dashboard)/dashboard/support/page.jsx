'use client';

import Link from 'next/link';

export default function SupportOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Desk</h1>
        <p className="mt-1 text-gray-600">Welcome to your support workspace. Manage tickets and customer inquiries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/support/supports" className="block rounded-3xl border border-gray-200 p-8 hover:border-gray-600 transition-colors group bg-white">
          <div className="h-12 w-12 bg-blue-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Support Tickets</h2>
          <p className="text-gray-600 text-sm">Manage prioritized support tickets submitted by customers through the help portal.</p>
        </Link>
        
        <Link href="/dashboard/support/contacts" className="block rounded-3xl border border-gray-200 p-8 hover:border-gray-600 transition-colors group bg-white">
          <div className="h-12 w-12 bg-green-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Form Submissions</h2>
          <p className="text-gray-600 text-sm">Review general inquiries and messages sent via the public website contact form.</p>
        </Link>
      </div>
    </div>
  );
}
