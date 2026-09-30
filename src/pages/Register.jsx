import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Field } from './Login';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function set(key) {
    return (value) => setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Fill in every field to continue.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, role);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-paper py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink mb-1.5">Create your account</h1>
          <p className="text-sm text-slate">Join your courses and start tracking assignments.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <span className="block text-sm font-medium text-ink mb-1.5">I am a</span>
            <div className="grid grid-cols-2 gap-2">
              {['student', 'professor'].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-md border py-2 text-sm font-medium capitalize transition-colors ${
                    role === r ? 'border-ink bg-ink text-paper' : 'border-line text-slate hover:border-ink/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <Field label="Full name" type="text" value={form.name} onChange={set('name')} placeholder="Jane Doe" autoComplete="name" />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@university.edu" autoComplete="email" />
          <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" autoComplete="new-password" />
          <Field label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat your password" autoComplete="new-password" />

          {error && (
            <p className="text-sm text-rust bg-rust-light rounded-md px-3 py-2" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper rounded-md py-2.5 text-sm font-semibold hover:bg-ink-light transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-slate mt-6">
          Already have an account? <Link to="/login" className="text-ink font-medium underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
