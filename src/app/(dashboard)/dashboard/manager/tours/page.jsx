'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchTours();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading tours...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage Tours</h1>
          <p className="mt-1 text-gray-400">Create, edit, and manage your tour offerings.</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
          + Create New Tour
        </button>
      </div>

      <div className="bg-[#111] rounded-3xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#222]">
            <thead className="bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tour Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Base Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {tours.length > 0 ? tours.map((tour) => (
                <tr key={tour.tour_id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white">{tour.title}</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {tour.tour_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {tour.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    ${tour.base_price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tour.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-400 mr-4">Edit</button>
                    <button className="text-red-500 hover:text-red-400">Delete</button>
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
