import React, { useRef, useState } from 'react';
import { Download, LogOut, Upload } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../lib/router';
import { OPENING_HOURS, usePageTitle } from '../../lib/hooks';
import { formatPrice } from '../../lib/format';
import { STORAGE_LIMIT_BYTES, usedBytes } from '../../lib/storage';
import { STORE_ADDRESS_FULL, STORE_CONFIG, STORE_PHONE_DISPLAY } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';

export const AdminSettingsView: React.FC = () => {
  usePageTitle('Settings');
  const { products, orders, staffLogout, changeStaffPassword, restoreBackup, showToast } = useStore();
  const { navigate } = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const used = usedBytes();
  const usedPercent = Math.min(100, Math.round((used / STORAGE_LIMIT_BYTES) * 100));

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const err = changeStaffPassword(current, next);
    setPasswordError(err);
    if (!err) {
      setCurrent('');
      setNext('');
      showToast('Password changed');
    }
  };

  const downloadBackup = () => {
    const data = JSON.stringify({ exportedAt: new Date().toISOString(), products, orders });
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${STORE_CONFIG.name.toLowerCase()}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restore = async (file?: File) => {
    if (!file) return;
    if (!window.confirm('Replace all products and orders on this device with the backup?')) return;
    try {
      const err = restoreBackup(JSON.parse(await file.text()));
      if (err) showToast(err, 'error');
      else showToast('Backup restored');
    } catch {
      showToast('This file is not a shop backup.', 'error');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <AdminPage title="Settings" narrow>
      <div className="space-y-4">
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
          <p className="hint">At least 6 characters. This changes the password on this device only.</p>
          {passwordError && <p className="error-text">{passwordError}</p>}
          <button type="submit" className="btn btn-primary mt-4 w-full sm:w-auto" disabled={!current || !next}>
            Change password
          </button>
        </form>

        <section className="card p-5">
          <h2 className="text-[17px] font-semibold">Backup</h2>
          <p className="mt-1 text-[15px] text-muted">
            Your products and orders are saved in this browser. Download a backup now and then, so nothing is lost if the browser data is cleared.
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Space used</span>
              <span className="tabular font-medium">
                {(used / 1024 / 1024).toFixed(1)} MB of about {STORAGE_LIMIT_BYTES / 1024 / 1024} MB
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-soft">
              <div className={`h-full rounded-full ${usedPercent > 80 ? 'bg-sale' : 'bg-ink'}`} style={{ width: `${Math.max(2, usedPercent)}%` }} />
            </div>
            {usedPercent > 80 && <p className="mt-1.5 text-sm text-sale">Almost full. Remove old products or extra photos.</p>}
          </div>
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
          onClick={() => {
            staffLogout();
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
    <dd>{value}</dd>
  </div>
);
