'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export default function CreateTourPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    duration_days: '', base_price: '', status: 'draft',
  });
  const [error, setError]     = useState('');
  const [saving, setSaving]   = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.post('/api/dashboard/tours', form);
      router.push('/dashboard/tours');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create tour');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-[640px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Tour</h1>
        <p className="text-muted text-sm mt-1">Add a new tour to your catalogue</p>
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Tour Title *</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.title} onChange={set('title')} required placeholder="e.g. Sunset Desert Safari" />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Description</label>
            <textarea className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 resize-y" value={form.description} onChange={set('description')} rows={4} placeholder="Describe the tour experience..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Location</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.location} onChange={set('location')} placeholder="e.g. Dubai, UAE" />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Duration (days)</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" type="number" min="1" value={form.duration_days} onChange={set('duration_days')} required placeholder="e.g. 3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Base Price (USD) *</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" type="number" min="0" step="0.01" value={form.base_price} onChange={set('base_price')} required placeholder="99.00" />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Status</label>
              <select className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.status} onChange={set('status')}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white/10 text-text font-bold text-sm hover:bg-white/20 transition disabled:opacity-50 btn-ghost" onClick={() => router.back()} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" disabled={saving}>
              {saving ? 'Creating…' : 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
