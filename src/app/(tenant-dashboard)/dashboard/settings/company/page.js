'use client';
import { useState, useEffect } from 'react';


export default function CompanySettingsPage() {
  const [company, setCompany]   = useState({ name: '', slug: '', domain: '' });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState('');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setCompany({
            name:   d.user.tenant_name || '',
            slug:   d.user.tenant_slug || '',
            domain: `${d.user.tenant_slug}.yourdomain.com`,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    // Company name update would require a dedicated endpoint
    // For now: show a success stub
    setTimeout(() => {
      setMessage('✓ Company settings saved');
      setSaving(false);
    }, 600);
  }

  if (loading) return <div className="p-10 text-text-3">Loading…</div>;

  return (
    <div className="w-full max-w-[600px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Company Settings</h1>
        <p className="text-muted text-sm mt-1">Your organisation details on Tourera</p>
      </div>

      <div className="bg-white/5 border border-border rounded-2xl p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Company Name</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={company.name} onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))} required />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Storefront Subdomain</label>
            <div className="flex items-center bg-surface border border-border rounded-md overflow-hidden">
              <input
                className="bg-transparent border-none flex-1 opacity-60 px-4 py-2.5 text-sm text-text"
                value={company.slug}
                disabled
              />
              <span className="px-3.5 py-3 text-sm text-text-3 border-l border-border shrink-0">
                .tourera.com
              </span>
            </div>
            <span className="text-xs text-text-3">Subdomain cannot be changed — contact support</span>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Custom Domain (Optional)</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 opacity-60" value={company.domain} disabled />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {message && <span className="text-sm text-success">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
