'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function TenantSupportPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ customer_name: '', customer_email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await axios.post('/api/public/support', { slug, ...form });
      const data = res.data;
      // Redirect to ticket view page
      router.push(`/t/${slug}/support/${data.ticket.ticket_id}?email=${encodeURIComponent(form.customer_email)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col">
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-3xl mb-4">🎫</div>
            <h1 className="text-3xl font-extrabold text-text mb-2">Contact Support</h1>
            <p className="text-text-2 text-sm">We typically respond within a few hours. Submit your question and we will get back to you.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-3 uppercase tracking-wider mb-1.5" htmlFor="customer_name">
                  Your Name
                </label>
                <input
                  id="customer_name"
                  name="customer_name"
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-3 uppercase tracking-wider mb-1.5" htmlFor="customer_email">
                  Email Address
                </label>
                <input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  required
                  value={form.customer_email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-3 uppercase tracking-wider mb-1.5" htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder="What can we help you with?"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-3 uppercase tracking-wider mb-1.5" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                placeholder="Please describe your issue in as much detail as possible…"
                className="w-full bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 resize-none focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Support Request'}
            </button>
          </form>

          <p className="text-center text-xs text-text-3 mt-6">
            Already submitted a ticket?{' '}
            <a href="#" className="text-primary-light underline" onClick={e => {
              e.preventDefault();
              const id = prompt('Enter your ticket ID:');
              const email = prompt('Enter your email:');
              if (id && email) router.push(`/t/${slug}/support/${id}?email=${encodeURIComponent(email)}`);
            }}>
              View your ticket
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
