import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
   <div className="min-h-screen flex items-center justify-center px-6 bg-[#0B1F3A]">
  <div className="w-full max-w-sm">
    <div className="mb-8">
          <h1 className="font-display text-3xl text-white mb-1.5">Welcome back</h1>
          <p className="text-sm text-slate">Sign in to your coursework dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Email"  type="email" value={email} onChange={setEmail} placeholder="you@university.edu" autoComplete="email" />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />

          {error && (
            <p className="text-sm text-rust bg-rust-light rounded-md px-3 py-2" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-paper rounded-md py-2.5 text-sm font-semibold hover:bg-ink-light transition-colors disabled:opacity-0"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

       <p className="text-sm text-yellow-300 mt-6">
  New here?{' '}
  <Link
    to="/register"
    className="text-yellow-300 font-medium underline underline-offset-2"
  >
    Create an account
  </Link>
</p>

        {/* <div className="mt-10 border-t border-line pt-5 text-xs text-slate space-y-1">
          <p className="font-medium text-ink/70">Try a demo account</p>
          <p>Professor — meera.nair@university.edu / password123</p>
          <p>Student — ananya.rao@university.edu / password123</p>
        </div> */}
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-white mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ink transition-colors"
      />
    </label>
  );
}

export { Field };
