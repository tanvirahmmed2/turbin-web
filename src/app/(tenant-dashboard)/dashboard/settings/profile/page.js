'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';


export default function ProfileSettingsPage() {
  const [profile, setProfile]   = useState({ name: '', email: '' });
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState('');
  const [pwForm, setPwForm]     = useState({ current: '', next: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg]       = useState('');

  useEffect(() => {
    axios.get('/api/auth/me')
      .then((res) => { if (res.data.user) setProfile({ name: res.data.user.name, email: res.data.user.email }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await axios.patch('/api/auth/me', { name: profile.name });
      setMessage(res.status === 200 ? '✓ Profile updated' : 'Update failed');
    } catch { setMessage('Network error'); }
    finally { setSaving(false); }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg('');
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match'); return; }
    if (pwForm.next.length < 8) { setPwMsg('Password must be at least 8 characters'); return; }
    setPwSaving(true);
    try {
      const res = await axios.post('/api/auth/change-password', {
        current_password: pwForm.current,
        new_password: pwForm.next
      });
      setPwMsg('✓ Password changed');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) { setPwMsg(err.response?.data?.error || 'Failed'); }
    finally { setPwSaving(false); }
  }

  if (loading) return <div className="p-10 text-text-3">Loading…</div>;

  return (
    <div className="w-full max-w-[600px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted text-sm mt-1">Update your personal information</p>
      </div>

      {/* Profile Form */}
      <div className="card mb-6">
        <h2 className="font-bold mb-4 text-base">Personal Info</h2>
        <form onSubmit={saveProfile} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Full Name</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm font-semibold text-text-2 mb-1">Email</label>
            <input className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50 opacity-60" value={profile.email} disabled />
            <span className="text-xs text-text-3">Email cannot be changed here</span>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {message && <span className={`text-sm ${message.startsWith('✓') ? 'text-success' : 'text-danger'}`}>{message}</span>}
          </div>
        </form>
      </div>

      {/* Password Form */}
      <div className="bg-white/5 border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-bold mb-4 text-base">Change Password</h2>
        <form onSubmit={changePassword} className="flex flex-col gap-4">
          {(['current', 'next', 'confirm']).map((f) => (
            <div key={f} className="flex flex-col gap-2 mb-4">
              <label className="text-sm font-semibold text-text-2 mb-1">
                {{ current: 'Current Password', next: 'New Password', confirm: 'Confirm New Password' }[f]}
              </label>
              <input
                className="bg-white/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:border-primary/50" type="password" value={pwForm[f]}
                onChange={(e) => setPwForm((p) => ({ ...p, [f]: e.target.value }))}
                required
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition disabled:opacity-50" disabled={pwSaving}>
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
            {pwMsg && <span className={`text-sm ${pwMsg.startsWith('✓') ? 'text-success' : 'text-danger'}`}>{pwMsg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
