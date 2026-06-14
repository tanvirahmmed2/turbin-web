'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GuideManifest() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.scheduleId;
  
  const [job, setJob] = useState(null);
  const [manifest, setManifest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const response = await axios.get(`/api/guide/jobs/${scheduleId}`);
        setJob(response.data.job);
        setManifest(response.data.manifest || []);
      } catch (err) {
        console.error('Failed to load manifest', err);
        setError('Failed to load manifest data.');
      } finally {
        setLoading(false);
      }
    };
    if (scheduleId) {
      fetchManifest();
    }
  }, [scheduleId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading guest manifest...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!job) return <div className="p-8 text-center text-gray-500">Job not found.</div>;

  const totalSeats = manifest.reduce((acc, curr) => acc + curr.seats, 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4">
          <button onClick={() => router.back()} className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            &larr; Back to Schedule
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Guest Manifest</h1>
        <p className="mt-1 text-gray-600">Review guest details for your upcoming tour.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
            <div className="mt-2 space-x-4 flex flex-wrap text-sm text-gray-600">
               <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {new Date(job.tour_date).toLocaleDateString()}
               </span>
               <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {job.start_time ? job.start_time.substring(0, 5) : 'TBD'}
               </span>
               <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  Meeting: {job.starting_location}
               </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 text-blue-800 px-6 py-3 rounded-2xl flex flex-col items-center justify-center border border-blue-100">
             <span className="text-xs uppercase font-bold tracking-wider opacity-70">Total Guests</span>
             <span className="text-2xl font-black">{totalSeats}</span>
          </div>
        </div>

        {manifest.length === 0 ? (
          <div className="text-center py-12">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
             </div>
             <h3 className="text-lg font-medium text-gray-900">No Guests Yet</h3>
             <p className="mt-1 text-gray-500">There are currently no bookings for this schedule.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-900 text-sm bg-gray-50 rounded-tl-xl">Customer Name</th>
                  <th className="py-4 px-4 font-semibold text-gray-900 text-sm bg-gray-50">Contact Info</th>
                  <th className="py-4 px-4 font-semibold text-gray-900 text-sm bg-gray-50 text-center">Pax</th>
                  <th className="py-4 px-4 font-semibold text-gray-900 text-sm bg-gray-50">Requirements</th>
                  <th className="py-4 px-4 font-semibold text-gray-900 text-sm bg-gray-50 rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {manifest.map((booking, index) => (
                  <tr key={booking.booking_id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{booking.customer_name}</div>
                      <div className="text-xs text-gray-500 font-mono">ID: #{booking.booking_id}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{booking.contact_phone || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{booking.customer_email}</div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-gray-900">
                      {booking.seats}
                    </td>
                    <td className="py-4 px-4">
                      {booking.separate_room ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          Separate Room
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
