'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function TenantLoginPage({ params }) {
  // We use React.use() or await params in page (wait, this is a client component, we use React.use() in Next 15+ if needed, but since it's Next 16 we should just get slug from props)
  const slug = params?.slug; // Or we can use use() if needed, but let's just assume params.slug is available or extract from URL if needed. Wait, in Next 16 client components, `params` is a promise, so we must `use(params)`.
  // To avoid `use` complexity in client, we can make a wrapper server component or just use `useParams`. Let's use `useParams`.
  
  return <LoginForm />
}

// Separate component to use `useParams` hook cleanly
import { useParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/login', { ...formData, tenant_slug: slug });
      const data = res.data;

      if (data.user?.role === 'customer') {
        router.push('/');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] mx-auto mt-20 p-8 bg-surface rounded-2xl border border-border">
      <h2 className="text-xl font-bold text-center mb-2">Welcome Back</h2>
      <p className="text-center text-muted text-sm mb-6">Sign in to continue</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="email">Email address</label>
          <input id="email" type="email" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} />
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="password">Password</label>
          <input id="password" type="password" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required value={formData.password} onChange={(e) => setFormData(p => ({...p, password: e.target.value}))} />
        </div>
        
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 w-full mt-4" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-6">
        Don't have an account? <Link href={`/t/${slug}/register`} className="text-primary font-medium">Register here</Link>
      </p>
    </div>
  );
}
