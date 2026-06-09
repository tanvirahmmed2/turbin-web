'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '@/components/dashboard/ui';

export default function DomainsSettingsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchDomains = useCallback(async () => {
    try {
      const res = await axios.get('/api/dashboard/settings/domains', { withCredentials: true });
      setDomains(res.data);
    } catch (err) {
      if (err.response?.status === 401) window.location.href = '/login';
      setError(err.response?.data?.error || 'Failed to load domains');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  const handleAddDomain = async (e) => {
    e.preventDefault();
    if (!newDomain) return;
    setAdding(true);
    setError(null);
    try {
      await axios.post('/api/dashboard/settings/domains', { domain: newDomain }, { withCredentials: true });
      setNewDomain('');
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add domain');
    } finally {
      setAdding(false);
    }
  };

  const handleSetPrimary = async (domainId) => {
    try {
      await axios.put('/api/dashboard/settings/domains', { domainId }, { withCredentials: true });
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update primary domain');
    }
  };

  const handleDelete = async (domainId) => {
    if (!confirm('Are you sure you want to remove this domain?')) return;
    try {
      await axios.delete(`/api/dashboard/settings/domains?id=${domainId}`, { withCredentials: true });
      fetchDomains();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete domain');
    }
  };

  if (loading) return <div className="flex h-[400px] items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Domains</h1>
        <p className="text-text-2">Manage the web addresses where your customers can access your tour website.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-10">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-text">Your Domains</h2>
        </div>
        <div className="p-0">
          {domains.map(d => (
            <div key={d.domain_id} className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 last:border-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-text text-lg">{d.domain}</span>
                  {d.is_primary && (
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Primary</span>
                  )}
                  {d.verified ? (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Verified</span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded">Pending Setup</span>
                  )}
                </div>
                {!d.verified && (
                  <p className="text-sm text-text-3 mt-2">
                    To verify, add a CNAME record in your DNS settings pointing to <strong>cname.tourera.com</strong>.
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!d.is_primary && d.verified && (
                  <button onClick={() => handleSetPrimary(d.domain_id)} className="text-sm font-semibold text-primary hover:underline">
                    Make Primary
                  </button>
                )}
                {!d.domain.endsWith('.tourera.com') && (
                  <button onClick={() => handleDelete(d.domain_id)} className="text-sm font-semibold text-red-500 hover:underline">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text mb-4">Add Custom Domain</h2>
        <p className="text-sm text-text-2 mb-6">Enter the custom domain you want to use (e.g. www.mytours.com).</p>
        <form onSubmit={handleAddDomain} className="flex gap-4">
          <input 
            type="text" 
            value={newDomain} 
            onChange={e => setNewDomain(e.target.value.toLowerCase())} 
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
            placeholder="www.yourdomain.com" 
          />
          <button disabled={adding || !newDomain} type="submit" className="btn-custom-primary whitespace-nowrap min-w-[120px]">
            {adding ? <LoadingSpinner /> : 'Add Domain'}
          </button>
        </form>
      </div>
    </div>
  );
}
