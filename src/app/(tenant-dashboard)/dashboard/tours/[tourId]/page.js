'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from '@/components/dashboard/ui';


export default function EditTourPage() {
  const router   = useRouter();
  const { tourId } = useParams();

  const [form, setForm]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    axios.get(`/api/dashboard/tours/${tourId}`)
      .then((res) => {
        const d = res.data;
        if (d.tour) {
          setForm({
            title:        d.tour.title        || '',
            description:  d.tour.description  || '',
            location:     d.tour.location     || '',
            duration_days: d.tour.duration_days || '',
            base_price:   d.tour.price        || '',
            status:       d.tour.status       || 'draft',
          });
        } else {
          setError(d.error || 'Tour not found');
        }
      })
      .catch(() => setError('Failed to load tour'))
      .finally(() => setLoading(false));
  }, [tourId]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.patch(`/api/dashboard/tours/${tourId}`, form);
      router.push('/dashboard/tours');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update tour');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this tour? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/dashboard/tours/${tourId}`);
      router.push('/dashboard/tours');
    } catch {
      setError('Failed to delete tour.');
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (!form)   return <ErrorMessage message={error} onRetry={() => router.back()} />;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Edit Tour</h1>
          <p className="text-muted text-sm mt-1">Update tour details</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-xl bg-white/10 text-danger font-bold text-sm hover:bg-danger/20 transition disabled:opacity-50"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting…' : '🗑 Delete Tour'}
        </button>
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
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.title} onChange={set('title')} required />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Description</label>
            <textarea className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.description} onChange={set('description')} rows={4} style={{ resize: 'vertical' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Location</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={form.location} onChange={set('location')} />
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Duration (days)</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" type="number" min="1" value={form.duration_days} onChange={set('duration_days')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">Base Price (USD) *</label>
              <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" type="number" min="0" step="0.01" value={form.base_price} onChange={set('base_price')} required />
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

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="px-5 py-2.5 rounded-xl bg-white/10 text-text font-bold text-sm hover:bg-white/20 transition disabled:opacity-50" onClick={() => router.back()} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
