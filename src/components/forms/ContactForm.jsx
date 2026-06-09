'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/components/helper/Context';

export default function ContactForm() {
  const { website } = useAppContext();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/contact', formData);
      toast.success('Your message has been sent!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
          <input 
            type="text" required name="name" value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow"
            style={{ '--tw-ring-color': website?.theme_color || '#3b82f6' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
          <input 
            type="email" required name="email" value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow"
            style={{ '--tw-ring-color': website?.theme_color || '#3b82f6' }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
          <input 
            type="tel" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow"
            style={{ '--tw-ring-color': website?.theme_color || '#3b82f6' }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
          <input 
            type="text" required name="subject" value={formData.subject} onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow"
            style={{ '--tw-ring-color': website?.theme_color || '#3b82f6' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
        <textarea 
          required rows="5" name="message" value={formData.message} onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-shadow resize-none"
          style={{ '--tw-ring-color': website?.theme_color || '#3b82f6' }}
        ></textarea>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full md:w-auto px-8 py-4 rounded-xl text-white font-bold transition-transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        style={{ backgroundColor: website?.theme_color || '#3b82f6' }}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
