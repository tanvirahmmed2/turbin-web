'use client';

import { useState } from 'react';
import { useAppContext } from '@/components/helper/Context';

export default function CustomerSettings() {
  const { session } = useAppContext();
  const [name, setName] = useState(session?.name || '');
  const [email, setEmail] = useState(session?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    // In a real app, you would make an API call to update the user here
    setTimeout(() => {
      setMessage('Profile updated successfully.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-gray-500">Update your profile information.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-6">
        {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium">{message}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" required 
            value={name} onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" required disabled
            value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" disabled={loading}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
