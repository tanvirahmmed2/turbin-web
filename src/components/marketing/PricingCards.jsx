'use client';
import axios from 'axios';
import { useState as __useState, useEffect as __useEffect, useCallback as __useCallback } from 'react';
import Link from 'next/link';


export function PricingCards({ showDescriptions = false }) {
  
  const fetchUrl = '/api/public/packages';
  const [data, setData] = __useState(null);
  const [loading, setLoading] = __useState(true);
  const [error, setError] = __useState(null);

  const fetchData = __useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(fetchUrl, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        window.location.href = '/login';
        return;
      }
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  __useEffect(() => { fetchData(); }, [fetchData]);
  


  if (loading) return <div className="text-center p-12 text-text-3 font-semibold">Loading packages...</div>;
  if (error || !data || data.length === 0) return <div className="text-center p-12 text-text-3 font-semibold">No packages found.</div>;

  const packages = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
      {packages.map((pkg) => (
        <div 
          key={pkg.package_id} 
          className={`relative border rounded-[2rem] p-10 bg-white transition-all duration-300 flex flex-col gap-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/50 ${
            pkg.popular 
              ? 'border-primary/50 bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(249,250,251,0.5)_100%)] shadow-[0_8px_30px_rgba(79,70,229,0.12)] ring-4 ring-primary/10' 
              : 'border-slate-200/80 shadow-sm'
          }`}
        >
          {pkg.popular && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-extrabold py-1 px-4.5 rounded-full whitespace-nowrap tracking-wider shadow-[0_4px_12px_rgba(99,102,241,0.35)]">
              Most Popular
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-black text-text mb-2 tracking-tight">{pkg.name}</h3>
            {showDescriptions && pkg.description && (
              <p className="text-text-2 text-xs leading-relaxed mt-1">{pkg.description}</p>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 py-1">
            <span className="text-lg font-bold text-text-3">$</span>
            <span className="text-5xl font-black tracking-tighter text-text">{pkg.monthly_price}</span>
            <span className="text-sm font-bold text-text-3">/mo</span>
          </div>

          <div className="w-full h-px bg-slate-100" />

          <ul className="list-none flex flex-col gap-3 flex-1 p-0 m-0">
            {(pkg.features || []).map((f) => (
              <li key={f} className="text-sm text-text-2 flex items-center gap-2.5">
                <span className="text-emerald-500 text-sm shrink-0">✓</span> 
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link 
            href="/register" 
            className={`w-full text-center py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              pkg.popular 
                ? 'btn-custom-primary' 
                : 'btn-custom-secondary'
            }`}
          >
            Register
          </Link>
        </div>
      ))}
    </div>
  );
}
