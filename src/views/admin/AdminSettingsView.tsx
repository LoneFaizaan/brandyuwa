import React, { useRef, useState } from 'react';
import { CheckCircle2, Database, Download, LogOut, RefreshCw, Upload, Wifi, WifiOff } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../lib/router';
import { OPENING_HOURS, usePageTitle } from '../../lib/hooks';
import { formatPrice } from '../../lib/format';
import { STORAGE_LIMIT_BYTES, usedBytes } from '../../lib/storage';
import { STORE_ADDRESS_FULL, STORE_CONFIG, STORE_PHONE_DISPLAY } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';

export const AdminSettingsView: React.FC = () => {
  usePageTitle('Settings');
  const {
    products,
    orders,
    staffEmail,
    changeStaffPassword,
    staffLogout,
    restoreBackup,
    backendStatus,
    isBackendConnected,
    refreshBackendData,
    showToast,
  } = useStore();
  const { navigate } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [syncing, setSyncing] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const used = usedBytes();
  const usedPercent = Math.min(100, Math.round((used / STORAGE_LIMIT_BYTES) * 100));

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    const err = await changeStaffPassword(current, next);
    setSavingPassword(false);
    setPasswordError(err);
    if (!err) {
      setCurrent('');
      setNext('');
      showToast('Password changed');
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    await refreshBackendData();
    setSyncing(false);
    showToast('Database synchronized with Supabase');
  };

  const downloadBackup = () => {
    const data = JSON.stringify({ exportedAt: new Date().toISOString(), products, orders }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${STORE_CONFIG.name.toLowerCase()}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restore = async (file?: File) => {
    if (!file) return;
    if (!window.confirm('Replace all products and orders with the backup? This will also update the Supabase database.')) return;
    try {
      const err = restoreBackup(JSON.parse(await file.text()));
      if (err) showToast(err, 'error');
      else showToast('Backup restored and synced to Supabase');
    } catch {
      showToast('This file is not a shop backup.', 'error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <AdminPage title="Settings" narrow>
      <div className="space-y-4">
        {/* Backend Database Status */}
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
                <Database size={18} />
              </span>
              <div>
                <h2 className="text-[17px] font-semibold leading-tight">Backend & Database</h2>
                <p className="text-xs text-muted">Supabase Project: <code className="rounded bg-soft px-1 font-mono">qypufzpwfixkhkofojaz</code></p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isBackendConnected ? 'bg-emerald-50 text-emerald-700' : backendStatus === 'connecting' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isBackendConnected ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Connected
                </>
              ) : backendStatus === 'connecting' ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <WifiOff size={12} />
                  Offline Mode
                </>
              )}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-soft/50 p-3 text-sm">
            <div>
              <dt className="text-xs text-muted">Products in Cloud</dt>
              <dd className="mt-0.5 text-base font-bold text-ink">{products.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Orders in Cloud</dt>
              <dd className="mt-0.5 text-base font-bold text-ink">{orders.length}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="text-xs text-muted">Real-time sync active</span>
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-soft disabled:opacity-50"
            >
              <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing…' : 'Sync Now'}
            </button>
          </div>
        </section>

        {/* Shop details */}
        <section className="card p-5">
          <h2 className="text-[17px] font-semibold">Shop details</h2>
          <dl className="mt-3 space-y-2 text-[15px]">
            <Row label="Name" value={STORE_CONFIG.name} />
            <Row label="Phone & WhatsApp" value={STORE_PHONE_DISPLAY} />
            <Row label="Address" value={STORE_ADDRESS_FULL} />
            <Row label="Hours" value={`${OPENING_HOURS}, ${STORE_CONFIG.hours.days.toLowerCase()}`} />
            <Row
              label="Delivery"
              value={`Free above ${formatPrice(STORE_CONFIG.delivery.freeAbove)}, otherwise ${formatPrice(STORE_CONFIG.delivery.fee)}`}
            />
            <Row label="UPI" value={STORE_CONFIG.payments.upiId || 'Not set up'} />
          </dl>
          <p className="hint">To change these, ask the person who set up this website.</p>
        </section>

        {/* Staff account */}
        <section className="card p-5">
          <h2 className="text-[17px] font-semibold">Staff account</h2>
          <p className="mt-2 text-[15px] text-muted">
            Logged in as <strong className="break-all font-semibold text-ink">{staffEmail}</strong>
          </p>
          <p className="hint">
            Staff log in with their password and then a code sent to their email. To give someone access or take it away, ask the
            person who set up this website to update the staff list in Supabase.
          </p>
        </section>

        {/* Change password */}
        <form onSubmit={changePassword} className="card p-5" noValidate>
          <h2 className="text-[17px] font-semibold">Change password</h2>
          <label htmlFor="current-password" className="label mt-4">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="field"
          />

          <label htmlFor="new-password" className="label mt-4">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="field"
          />
          <p className="hint">At least 8 characters. Only changes your own password.</p>
          {passwordError && <p className="error-text">{passwordError}</p>}
          <button type="submit" className="btn btn-primary mt-4 w-full sm:w-auto" disabled={!current || !next || savingPassword}>
            {savingPassword ? 'Saving…' : 'Change password'}
          </button>
        </form>

        {/* Backup & Export */}
        <section className="card p-5">
          <h2 className="text-[17px] font-semibold">Data Backup</h2>
          <p className="mt-1 text-[15px] text-muted">
            All data is saved in Supabase cloud database. You can also export a standalone JSON snapshot file for safe offline keeping.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={downloadBackup} className="btn btn-secondary">
              <Download size={18} />
              Download backup
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary">
              <Upload size={18} />
              Restore backup
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => restore(e.target.files?.[0])}
          />
        </section>

        <button
          type="button"
          onClick={async () => {
            await staffLogout();
            navigate('/', { replace: true });
          }}
          className="btn btn-secondary w-full"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </AdminPage>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
    <dt className="w-40 shrink-0 text-muted">{label}</dt>
    <dd className="font-medium text-ink">{value}</dd>
  </div>
);
