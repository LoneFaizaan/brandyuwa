import React, { useMemo } from 'react';
import { Copy } from 'lucide-react';
import qrcode from 'qrcode-generator';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/format';
import { upiPayLink } from '../../lib/orderMessages';
import { STORE_CONFIG } from '../../data/storeConfig';

/** UTR (12 digits) or an app's transaction ID */
export const isValidPaymentRef = (ref: string) => /^[A-Za-z0-9]{10,35}$/.test(ref.trim());

/** QR code as one SVG path, drawn from the library's module grid */
const QrCode: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const { size, path } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + 4} ${r + 4}h1v1h-1z`;
    return { size: n + 8, path: d };
  }, [value]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label} className="h-auto w-full" shapeRendering="crispEdges">
      {/* Always black on white so every UPI app can scan it, also in dark mode */}
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
};

interface UpiPaymentCardProps {
  amount: number;
  reference: string;
  onReferenceChange: (value: string) => void;
  error?: string;
}

/** Checkout, "Pay now": QR code for the total, UPI app button, and the reference number box */
export const UpiPaymentCard: React.FC<UpiPaymentCardProps> = ({ amount, reference, onReferenceChange, error }) => {
  const { showToast } = useStore();
  const { upiId } = STORE_CONFIG.payments;
  const link = upiPayLink(amount);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      showToast('UPI ID copied');
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <div className="rounded-xl border border-line-strong p-4">
      <p className="text-[15px] font-semibold">
        1. Pay <span className="tabular">{formatPrice(amount)}</span>
      </p>
      <p className="mt-1 text-sm text-muted">Scan with GPay, PhonePe, Paytm or any UPI app. The amount is filled in for you.</p>
      <div className="mx-auto mt-4 w-full max-w-[14rem] overflow-hidden rounded-xl border border-line">
        <QrCode value={link} label={`UPI QR code to pay ${formatPrice(amount)} to ${upiId}`} />
      </div>
      <a href={link} className="btn btn-primary mt-4 w-full md:hidden">
        Pay with UPI app
      </a>
      <button type="button" onClick={copyUpi} className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Copy size={15} />
        {upiId}
      </button>

      <label htmlFor="checkout-utr" className="mt-5 block border-t border-line pt-4 text-[15px] font-semibold">
        2. Enter the UPI reference number
      </label>
      <input
        id="checkout-utr"
        value={reference}
        onChange={(e) => onReferenceChange(e.target.value.replace(/[^\dA-Za-z]/g, '').slice(0, 35))}
        placeholder="e.g. 412345678901"
        autoComplete="off"
        className={`field tabular mt-2 ${error ? 'field-error' : ''}`}
        aria-invalid={!!error}
        aria-describedby="checkout-utr-help"
      />
      {error ? (
        <p id="checkout-utr-help" className="error-text">
          {error}
        </p>
      ) : (
        <p id="checkout-utr-help" className="hint">
          Shown in your UPI app after paying, as "UPI Ref. No.", "UTR" or "Transaction ID".
        </p>
      )}
    </div>
  );
};
