'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const data = res.data;

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        // Check role to redirect to proper dashboard
        const isSuperAdmin = !data.user?.tenant_id && (data.user?.role === 'owner' || data.user?.role === 'manager');
        if (isSuperAdmin) {
          router.push('/control');
        } else {
          router.push(redirectUrl);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-6">Welcome back</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="email">Work Email</label>
          <input 
            id="email" 
            type="email" 
            className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="password">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary">Forgot password?</Link>
          </div>
          <input 
            id="password" 
            type="password" 
            className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 w-full mt-4" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-6">
        Don't have an account? <Link href="/register" className="text-primary font-medium">Create an account</Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
