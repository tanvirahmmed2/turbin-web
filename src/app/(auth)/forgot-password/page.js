'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Check your email</h2>
        <p className="text-muted text-sm mb-6">
          If an account exists for that email, we've sent instructions to reset your password.
        </p>
        <Link href="/login" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 w-full">Return to login</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-bold text-center mb-2">Reset Password</h2>
      <p className="text-center text-muted text-sm mb-6">
        Enter your email and we'll send you a link to reset your password.
      </p>
      
      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="form-group gap-md">
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-sm font-semibold text-text-2 mb-1" htmlFor="email">Email address</label>
          <input id="email" type="email" className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" required />
        </div>
        
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50 w-full mt-4">
          Send reset link
        </button>
      </form>
      
      <p className="text-center text-sm text-muted mt-6">
        Remember your password? <Link href="/login" className="text-primary font-medium">Sign in</Link>
      </p>
    </>
  );
}
