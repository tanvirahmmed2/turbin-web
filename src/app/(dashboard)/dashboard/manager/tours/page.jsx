'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ManageTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTours = async () => {
    try {
      const res = await axios.get('/api/admin/tours');
      setTours(res.data.tours || []);
    } catch (err) {
      console.error('Failed to load tours', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (tourId) => {
    if (confirm('Are you sure you want to delete this tour?')) {
      try {
        await axios.delete(`/api/admin/tours/${tourId}`);
        fetchTours();
      } catch (error) {
        console.error('Failed to delete tour', error);
        alert('Failed to delete tour');
      }
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading tours...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tours</h1>
          <p className="mt-1 text-gray-600">Create, edit, and manage your tour offerings.</p>
        </div>
        <Link 
          href="/dashboard/manager/tours/create"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Create New Tour
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tour Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tours.length > 0 ? tours.map((tour) => (
                <tr key={tour.tour_id} className="transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{tour.title}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {tour.tour_id} • {tour.spots_count || 0} spots</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="block">{tour.starting_location}</span>
                    {tour.finish_location && tour.finish_location !== tour.starting_location && (
                      <span className="block text-gray-400 text-xs mt-0.5">→ {tour.finish_location}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ৳{tour.base_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${tour.status === 'active' ? 'bg-green-900/50 text-green-400' : ' text-gray-400'}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/manager/tours/${tour.tour_id}/edit`} className="text-blue-500 hover:text-blue-400 mr-4">
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(tour.tour_id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No tours found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
