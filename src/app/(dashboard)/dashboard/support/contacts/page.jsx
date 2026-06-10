'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('/api/admin/contacts');
      setContacts(res.data.contacts || []);
    } catch (err) {
      console.error('Failed to load contacts', err);
      toast.error('Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contact_id, newStatus) => {
    try {
      await axios.put('/api/admin/contacts', { contact_id, status: newStatus });
      toast.success('Status updated');
      setContacts(contacts.map(c => c.contact_id === contact_id ? { ...c, status: newStatus } : c));
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading contact forms...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Contact Submissions</h1>
        <p className="mt-1 text-gray-400">Review inquiries sent from the public website's contact form.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contacts.length > 0 ? contacts.map((contact) => (
          <div key={contact.contact_id} className="bg-gray-800 rounded-3xl border border-[#222] p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-white font-bold text-lg">{contact.subject}</div>
                  <div className="text-xs text-gray-500 mt-1">From: {contact.name} ({contact.email})</div>
                </div>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border 
                  ${contact.status === 'unread' ? 'bg-red-900/30 text-red-400 border-red-500/20' : 
                    contact.status === 'read' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20' : 
                    'bg-green-900/30 text-green-400 border-green-500/20'}`}>
                  {contact.status}
                </span>
              </div>
              <div className="bg-[#1a1a1a] p-4 rounded-xl text-gray-300 text-sm mb-4 border border-[#333] min-h-[100px]">
                {contact.message}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-[#222]">
              <span className="text-xs text-gray-500">
                {new Date(contact.created_at).toLocaleDateString()}
              </span>
              <select 
                value={contact.status}
                onChange={(e) => updateStatus(contact.contact_id, e.target.value)}
                className="bg-[#1a1a1a] border border-[#222] text-white text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-12 text-center text-gray-500 bg-gray-800 rounded-3xl border border-[#222]">
            No contact submissions yet.
          </div>
        )}
      </div>
    </div>
  );
}
