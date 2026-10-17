import React, { useState } from 'react';
import { MailPlus, UserPlus, Loader2 } from 'lucide-react';
import { apiRequest } from '../api/client';

export default function MemberInvitations({ onShowToast = () => {} }) {
  const [memberType, setMemberType] = useState('student');
  const [form, setForm] = useState({ email: '', full_name: '', phone: '', expertise: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest(`/api/admin/invitations/${memberType}`, {
        method: 'POST',
        body: JSON.stringify({
          email: form.email.trim(),
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          ...(memberType === 'tutor' ? { expertise: form.expertise.trim() || null } : {}),
        }),
      });
      setForm({ email: '', full_name: '', phone: '', expertise: '' });
      onShowToast(`${memberType === 'student' ? 'Student' : 'Tutor'} invitation sent.`);
    } catch (error) {
      onShowToast(error.message || 'Invitation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <MailPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Invite institute members</h2>
              <p className="text-xs text-slate-500">Send a backend invitation to a student or tutor.</p>
            </div>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            {['student', 'tutor'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMemberType(type)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize ${memberType === type ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="full_name" value={form.full_name} onChange={updateField} required placeholder="Full name" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
          <input name="email" type="email" value={form.email} onChange={updateField} required placeholder="Email address" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
          <input name="phone" value={form.phone} onChange={updateField} required placeholder="Phone number" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
          {memberType === 'tutor' && (
            <input name="expertise" value={form.expertise} onChange={updateField} placeholder="Expertise (optional)" className="h-10 rounded-lg border border-slate-200 px-3 text-sm" />
          )}
          <button type="submit" disabled={isSubmitting} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-60 sm:col-span-2">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {isSubmitting ? 'Sending invitation...' : `Invite ${memberType}`}
          </button>
        </form>
      </section>
    </div>
  );
}
