'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/auth/register', formData);
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-bg relative">
      <div className="absolute inset-0 bg-gradient-primary opacity-5 blur-[100px] -z-10" />

      <div className="w-full max-w-[400px] mx-auto p-8 bg-surface rounded-2xl border border-border">
        <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-center text-muted text-sm mb-6">Get started with your tour business</p>
      
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="name">Your Name</label>
            <input id="name" type="text" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="email">Work Email</label>
            <input id="email" type="email" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required value={formData.email} onChange={handleChange} placeholder="john@acmetours.com" />
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required minLength={8} value={formData.password} onChange={handleChange} placeholder="At least 8 characters" />
          </div>
          
          <button type="submit" className="px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 w-full mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link href="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
