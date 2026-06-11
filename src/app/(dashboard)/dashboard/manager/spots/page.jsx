'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSpots = async () => {
    try {
      const res = await axios.get('/api/admin/spots');
      setSpots(res.data.spots || []);
    } catch (err) {
      console.error('Failed to load spots', err);
      toast.error('Failed to load spots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleDelete = async (spotId) => {
    if (confirm('Are you sure you want to delete this spot?')) {
      try {
        await axios.delete(`/api/admin/spots/${spotId}`);
        toast.success('Spot deleted successfully');
        fetchSpots();
      } catch (error) {
        console.error('Error deleting spot', error);
        toast.error('Failed to delete spot');
      }
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading spots...</div>;

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Spots</h1>
          <p className="mt-1 text-gray-600">Create and manage your global pool of tour destinations.</p>
        </div>
        <Link 
          href="/dashboard/manager/spots/create"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Create New Spot
        </Link>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Spot Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {spots.length > 0 ? spots.map((spot) => (
                <tr key={spot.spot_id} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {spot.image ? (
                        <img src={spot.image} alt={spot.name} className="w-10 h-10 rounded-lg object-cover mr-4" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center text-gray-500 border border-gray-200">
                          No Img
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">{spot.name}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {spot.description ? spot.description.replace(/<[^>]+>/g, '') : 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {spot.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(spot.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/manager/spots/${spot.spot_id}/edit`} className="text-blue-500 hover:text-blue-400 mr-4">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(spot.spot_id)} className="text-red-500 hover:text-red-400">
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No spots found. Create one to get started.
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
