'use client';

export default function GuideJobs() {
  // Mock data representing assigned schedules since there is no tour_jobs table
  const jobs = [
    { id: 1, title: 'Mount Fuji Explorer', date: 'Oct 24, 2026', time: '08:00 AM', pax: 12, location: 'Tokyo Station', status: 'upcoming' },
    { id: 2, title: 'Kyoto Heritage Walk', date: 'Oct 28, 2026', time: '09:00 AM', pax: 8, location: 'Kyoto West', status: 'upcoming' },
    { id: 3, title: 'Tokyo Night Food Tour', date: 'Oct 31, 2026', time: '06:30 PM', pax: 5, location: 'Shinjuku', status: 'assigned' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Schedule & Jobs</h1>
        <p className="mt-1 text-gray-600">View your assigned upcoming tours and guest manifests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="rounded-3xl border border-gray-200 overflow-hidden flex flex-col justify-between bg-white">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                  <p className="text-blue-400 font-semibold mt-1">{job.date} at {job.time}</p>
                </div>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-bold uppercase rounded-full border border-blue-500/20">
                  {job.status}
                </span>
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  {job.pax} Guests
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Meeting Point: {job.location}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button className="text-sm font-semibold text-blue-400 hover:text-blue-300">View Manifest &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
