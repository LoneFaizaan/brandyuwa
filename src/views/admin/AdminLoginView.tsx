import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { Logo } from '../../components/common/Logo';

export const AdminLoginView: React.FC = () => {
  usePageTitle('Staff login');
  const { staffLogin } = useStore();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the password.');
      return;
    }
    const err = staffLogin(password);
    setError(err);
    if (err) setPassword('');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-soft px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={submit} className="card p-6" noValidate>
          <h1 className="text-xl font-bold">Staff login</h1>
          <p className="mt-1 text-[15px] text-muted">Manage products, stock and orders.</p>

          <label htmlFor="staff-password" className="label mt-6">
            Password
          </label>
          <div className="relative">
            <input
              id="staff-password"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              autoComplete="current-password"
              autoFocus
              className={`field pr-12 ${error ? 'field-error' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? 'staff-password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink"
              aria-label={show ? 'Hide password' : 'Show password'}
            >
              {show ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {error && (
            <p id="staff-password-error" className="error-text" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary mt-5 w-full">
            Log in
          </button>
          <p className="mt-4 text-sm text-muted">Forgot the password? Ask the person who set up this website to reset it.</p>
        </form>
        <p className="mt-6 text-center">
          <Link to="/" className="text-[15px] font-medium text-muted hover:text-ink">
            ← Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
};
