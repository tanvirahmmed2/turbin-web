'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function WebsiteSettings() {
  const [formData, setFormData] = useState({
    hero_title: '',
    hero_subtitle: '',
    theme_color: '#3B82F6',
    logo_url: '',
    name: '',
    address: '',
    tagline: '',
    sociallink: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchWebsite = async () => {
      try {
        const res = await axios.get('/api/website');
        if (res.data.website) {
          setFormData({
            hero_title: res.data.website.hero_title || '',
            hero_subtitle: res.data.website.hero_subtitle || '',
            theme_color: res.data.website.theme_color || '#3B82F6',
            logo_url: res.data.website.logo_url || '',
            name: res.data.website.name || '',
            address: res.data.website.address || '',
            tagline: res.data.website.tagline || '',
            sociallink: res.data.website.sociallink || '',
            email: res.data.website.email || '',
            phone: res.data.website.phone || ''
          });
        }
      } catch (err) {
        console.error('Failed to load website settings', err);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchWebsite();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/website', formData);
      toast.success('Website settings updated! Reload page to see changes globally.');
    } catch (err) {
      console.error('Failed to update website', err);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Website Configuration</h1>
        <p className="mt-1 text-gray-400">Manage your brand identity, SEO, and public contact information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Branding Section */}
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-8">
          <h2 className="text-xl font-bold text-white mb-6">Core Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Website/Hero Title</label>
              <input type="text" name="hero_title" value={formData.hero_title} onChange={handleChange} required className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" placeholder="e.g. Dream Travel" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Hero Subtitle</label>
              <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} rows="2" className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" placeholder="A short description for the hero section." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tagline (Used in Footer & SEO)</label>
              <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
              <input type="url" name="logo_url" value={formData.logo_url} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme Color</label>
              <input type="color" name="theme_color" value={formData.theme_color} onChange={handleChange} className="h-12 w-full bg-[#1a1a1a] border border-[#222] rounded-xl cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-gray-800 rounded-3xl border border-[#222] p-8">
          <h2 className="text-xl font-bold text-white mb-6">Contact & Legal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Legal Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Support Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Support Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Social Link (e.g. Instagram)</label>
              <input type="url" name="sociallink" value={formData.sociallink} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Physical Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full bg-[#1a1a1a] border border-[#222] text-white rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}
