import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { Logo } from '../../components/common/Logo';

const RESEND_AFTER_S = 60;
// Remembers the email a code was sent to, so the code step survives the page reloading
// while staff switch to their email app
const PENDING_KEY = 'by:staff-login-pending';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function loadPending(): { email: string; sentAt: number } | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    const pending = raw ? (JSON.parse(raw) as { email: string; sentAt: number }) : null;
    // Codes expire after 10 minutes
    return pending && Date.now() - pending.sentAt < 10 * 60_000 ? pending : null;
  } catch {
    return null;
  }
}

function savePending(pending: { email: string; sentAt: number } | null) {
  try {
    if (pending) sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable */
  }
}

export const AdminLoginView: React.FC = () => {
  usePageTitle('Staff login');
  const { requestStaffCode, verifyStaffCode } = useStore();
  const [pending] = useState(loadPending);
  const [email, setEmail] = useState(pending?.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(pending?.sentAt ?? null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  // Kept in memory only, so "Resend code" doesn't ask for the password again
  const passwordRef = useRef('');

  const step = sentAt === null ? 'password' : 'code';
  const resendIn = sentAt === null ? 0 : Math.max(0, Math.ceil((sentAt + RESEND_AFTER_S * 1000 - now) / 1000));

  useEffect(() => {
    if (resendIn === 0) return;
    const t = window.setTimeout(() => setNow(Date.now()), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn, now]);

  const sendCode = async (pw: string) => {
    setBusy(true);
    const err = await requestStaffCode(email, pw);
    setBusy(false);
    setError(err);
    if (err) return;
    passwordRef.current = pw;
    const at = Date.now();
    setSentAt(at);
    setNow(at);
    setCode('');
    setPassword('');
    savePending({ email: email.trim().toLowerCase(), sentAt: at });
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    sendCode(password);
  };

  const startOver = (message: string | null = null) => {
    setSentAt(null);
    setCode('');
    setError(message);
    savePending(null);
  };

  // After a page reload the password is gone, so ask for it again
  const resend = () => {
    if (passwordRef.current) sendCode(passwordRef.current);
    else startOver('Enter your password again to get a new code.');
  };

  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6,10}$/.test(code)) {
      setError('Enter the code from the email.');
      return;
    }
    setBusy(true);
    const err = await verifyStaffCode(email, code);
    setBusy(false);
    setError(err);
    if (err) setCode('');
    else savePending(null);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-soft px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo variant="banner" size="lg" />
        </div>

        {step === 'password' ? (
          <form onSubmit={submitPassword} className="card p-6" noValidate>
            <h1 className="text-xl font-bold">Staff login</h1>
            <p className="mt-1 text-[15px] text-muted">Enter your email and password. We'll then email you a code to finish logging in.</p>

            <label htmlFor="staff-email" className="label mt-6">
              Email
            </label>
            <input
              id="staff-email"
              type="email"
              inputMode="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              autoFocus={!email}
              className={`field ${error ? 'field-error' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? 'staff-login-error' : undefined}
            />

            <label htmlFor="staff-password" className="label mt-4">
              Password
            </label>
            <div className="relative">
              <input
                id="staff-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                autoComplete="current-password"
                autoFocus={!!email}
                className={`field pr-12 ${error ? 'field-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? 'staff-login-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {error && (
              <p id="staff-login-error" className="error-text" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary mt-5 w-full" disabled={busy}>
              {busy && <LoaderCircle size={18} className="animate-spin" />}
              {busy ? 'Checking…' : 'Continue'}
            </button>
            <p className="mt-4 text-sm text-muted">Forgot your password? Ask the person who set up this website to reset it.</p>
          </form>
        ) : (
          <form onSubmit={submitCode} className="card p-6" noValidate>
            <h1 className="text-xl font-bold">Check your email</h1>
            <p className="mt-1 text-[15px] text-muted">
              We sent a login code to <strong className="break-all font-semibold text-ink">{email}</strong>. It works for 10 minutes.
            </p>

            <label htmlFor="staff-code" className="label mt-6">
              Login code
            </label>
            <input
              id="staff-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''));
                setError(null);
              }}
              autoComplete="one-time-code"
              autoFocus
              className={`field text-center font-mono text-2xl tracking-[0.35em] ${error ? 'field-error' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? 'staff-login-error' : undefined}
            />
            {error && (
              <p id="staff-login-error" className="error-text" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary mt-5 w-full" disabled={busy}>
              {busy && <LoaderCircle size={18} className="animate-spin" />}
              {busy ? 'Checking…' : 'Log in'}
            </button>

            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <button type="button" onClick={() => startOver()} className="font-medium text-muted hover:text-ink">
                Start over
              </button>
              <button
                type="button"
                onClick={resend}
                disabled={busy || resendIn > 0}
                className="font-semibold text-ink hover:underline disabled:font-medium disabled:text-muted disabled:no-underline"
              >
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center">
          <Link to="/" className="text-[15px] font-medium text-muted hover:text-ink">
            ← Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
};
