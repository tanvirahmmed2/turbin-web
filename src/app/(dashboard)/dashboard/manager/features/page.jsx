'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageFeatures() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const fetchFeatures = async () => {
    try {
      const res = await axios.get('/api/admin/features');
      setFeatures(res.data.features || []);
    } catch (err) {
      console.error('Failed to load features', err);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    try {
      await axios.post('/api/admin/features', { name: newFeatureName.trim() });
      toast.success('Feature created');
      setNewFeatureName('');
      fetchFeatures();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create feature');
    }
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    try {
      await axios.put(`/api/admin/features/${id}`, { name: editingName.trim() });
      toast.success('Feature updated');
      setEditingId(null);
      setEditingName('');
      fetchFeatures();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update feature');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this feature?')) {
      try {
        await axios.delete(`/api/admin/features/${id}`);
        toast.success('Feature deleted');
        fetchFeatures();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete feature');
      }
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading features...</div>;

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Tour Features</h1>
          <p className="mt-1 text-gray-600">Create and manage your global pool of tour features.</p>
        </div>
        <a 
          href="/dashboard/manager/features/create"
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Create New Feature
        </a>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Feature Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {features.length > 0 ? features.map((feature) => (
                <tr key={feature.feature_id} className="transition-colors">
                  <td className="px-6 py-4">
                    {editingId === feature.feature_id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdate(feature.feature_id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(feature.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === feature.feature_id ? (
                      <>
                        <button onClick={() => handleUpdate(feature.feature_id)} className="text-green-600 hover:text-green-700 mr-4">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-gray-700">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => {
                            setEditingId(feature.feature_id);
                            setEditingName(feature.name);
                          }} 
                          className="text-blue-500 hover:text-blue-400 mr-4"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(feature.feature_id)} className="text-red-500 hover:text-red-400">
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                    No features created yet.
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
