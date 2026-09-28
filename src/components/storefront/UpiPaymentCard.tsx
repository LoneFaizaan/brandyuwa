import React, { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import qrcode from 'qrcode-generator';
import type { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/format';
import { paymentWhatsAppLink, upiPayLink } from '../../lib/orderMessages';
import { STORE_CONFIG } from '../../data/storeConfig';
import { WhatsAppIcon } from '../common/SocialIcons';

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

/** Shown after ordering for unpaid UPI orders: QR code, UPI app button, and "I've paid" on WhatsApp */
export const UpiPaymentCard: React.FC<{ order: Order }> = ({ order }) => {
  const { showToast } = useStore();
  const [reference, setReference] = useState('');
  const { upiId } = STORE_CONFIG.payments;

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      showToast('UPI ID copied');
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <section className="card p-5">
      <h2 className="text-[15px] font-semibold">Pay {formatPrice(order.total)} by UPI</h2>

      {upiId ? (
        <>
          <p className="mt-1 text-sm text-muted">
            Scan with GPay, PhonePe, Paytm or any UPI app. The amount and order number are filled in for you.
          </p>
          <div className="mx-auto mt-4 w-full max-w-[15rem] overflow-hidden rounded-xl border border-line">
            <QrCode value={upiPayLink(order)} label={`UPI QR code to pay ${formatPrice(order.total)} for order ${order.id}`} />
          </div>
          <a href={upiPayLink(order)} className="btn btn-primary mt-4 w-full md:hidden">
            Pay with UPI app
          </a>
          <button
            type="button"
            onClick={copyUpi}
            className="mx-auto mt-3 flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
          >
            <Copy size={15} />
            {upiId}
          </button>
        </>
      ) : (
        <p className="mt-1 text-sm text-muted">We'll send you our UPI details on WhatsApp when we confirm your order.</p>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="text-[15px] font-semibold">Paid? Send us the details</p>
        <label htmlFor={`utr-${order.id}`} className="label mt-3">
          UPI reference / UTR no. <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id={`utr-${order.id}`}
          inputMode="numeric"
          value={reference}
          onChange={(e) => setReference(e.target.value.replace(/[^\dA-Za-z]/g, '').slice(0, 22))}
          placeholder="12-digit number from your UPI app"
          className="field tabular"
        />
        <a
          href={paymentWhatsAppLink(order, reference)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-whatsapp mt-3 w-full"
        >
          <WhatsAppIcon size={18} />
          Send payment details on WhatsApp
        </a>
        <p className="hint">Attach the payment screenshot there. We'll mark your order as paid.</p>
      </div>
    </section>
  );
};
