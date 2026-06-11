'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      await axios.patch('/api/admin/users', { user_id: userId, new_role: newRole });
      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      // Optionally could show a nice toast here, alert for simplicity
      alert('Role updated successfully');
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (loading) return <div className="text-center p-12 text-gray-500">Loading users...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">All Users</h1>
          <p className="mt-1 text-gray-400">View and manage all registered accounts on your platform.</p>
        </div>
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full bg-gray-800 border border-[#222] rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#222]">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-white">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      disabled={updatingRole === user.user_id}
                      className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none appearance-none ${
                        ['owner', 'manager'].includes(user.role) ? 'bg-purple-900/50 text-purple-400' : 
                        ['staff', 'guide', 'support'].includes(user.role) ? 'bg-blue-900/50 text-blue-400' : 
                        'bg-gray-700 text-gray-300'
                      }`}
                    >
                      <option value="owner" className="bg-gray-800 text-white">Owner</option>
                      <option value="manager" className="bg-gray-800 text-white">Manager</option>
                      <option value="staff" className="bg-gray-800 text-white">Staff</option>
                      <option value="guide" className="bg-gray-800 text-white">Guide</option>
                      <option value="support" className="bg-gray-800 text-white">Support</option>
                      <option value="customer" className="bg-gray-800 text-white">Customer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.is_verified ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
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
