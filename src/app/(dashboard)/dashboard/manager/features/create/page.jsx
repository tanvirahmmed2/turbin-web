'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function CreateFeaturePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await axios.post('/api/admin/features', { name: name.trim() });
      toast.success('Feature created successfully');
      router.push('/dashboard/manager/features');
    } catch (err) {
      console.error('Failed to create feature', err);
      toast.error('Failed to create feature');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Feature</h1>
          <p className="mt-1 text-gray-600">Add a new feature to your global pool.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="p-8 rounded-3xl border border-gray-200 bg-white">
          <label className="block text-sm font-medium text-gray-600 mb-2">Feature Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
            placeholder="e.g. Free Wi-Fi, Guided Tour, All Meals Included"
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-transparent border border-gray-600 text-gray-900 font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Create Feature'}
          </button>
        </div>
      </form>
    </div>
  );
}
