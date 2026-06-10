'use client';

import Link from 'next/link';

export default function StaffOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Staff Workspace</h1>
        <p className="mt-1 text-gray-400">Welcome. Manage your assigned operational tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/staff/task" className="block bg-gray-800 rounded-3xl border border-[#222] p-8 hover:bg-gray-750 hover:border-gray-600 transition-colors group">
          <div className="h-12 w-12 bg-pink-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">My Task Board</h2>
          <p className="text-gray-400 text-sm">Review your daily to-do list, operational tasks, and event preparation instructions.</p>
        </Link>
      </div>
    </div>
  );
}
