'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('/api/admin/users?type=team');
        setTeam(res.data.users || []);
      } catch (err) {
        console.error('Failed to load team', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) return <div className="text-center p-12 text-gray-500">Loading team...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-1 text-gray-600">Manage your internal guides, managers, and support team.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
          + Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member.user_id} className="rounded-3xl border border-gray-200 p-6 flex flex-col items-center text-center bg-white">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {member.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{member.email}</p>
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize mb-6 ${['owner', 'manager'].includes(member.role) ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'}`}>
              {member.role}
            </span>
            <div className="w-full flex border-t border-gray-200 pt-4 justify-between text-sm">
              <span className="text-gray-500">Joined</span>
              <span className="text-gray-700">{new Date(member.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {team.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 rounded-3xl border border-gray-200 bg-white">
            No team members found.
          </div>
        )}
      </div>
    </div>
  );
}
