import React from 'react';
import { Check } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { formatDateTime, statusLabel } from '../../lib/format';

const STEPS: OrderStatus[] = ['new', 'packed', 'shipped', 'delivered'];

export const statusTone = (status: OrderStatus) =>
  status === 'new'
    ? 'bg-warn-soft text-warn'
    : status === 'cancelled'
      ? 'bg-sale-soft text-sale'
      : status === 'delivered'
        ? 'bg-ok-soft text-ok'
        : 'bg-soft text-ink';

export const StatusBadge: React.FC<{ order: Order }> = ({ order }) => (
  <span className={`badge ${statusTone(order.status)}`}>
    {order.status === 'new' ? 'Placed' : statusLabel(order.status, order.fulfilment)}
  </span>
);

export const OrderProgress: React.FC<{ order: Order }> = ({ order }) => {
  if (order.status === 'cancelled') {
    return <p className="rounded-xl bg-sale-soft p-4 text-[15px] font-medium text-sale">This order was cancelled.</p>;
  }
  const currentIndex = STEPS.indexOf(order.status);

  return (
    <ol className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const at = [...order.history].reverse().find((h) => h.status === step)?.at;
        return (
          <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
            {i < STEPS.length - 1 && (
              <span className={`absolute left-[11px] top-6 h-[calc(100%-1.5rem)] w-0.5 ${i < currentIndex ? 'bg-ink' : 'bg-line'}`} aria-hidden="true" />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                done ? 'border-ink bg-ink text-white' : 'border-line-strong bg-canvas'
              }`}
            >
              {done && <Check size={14} strokeWidth={3} />}
            </span>
            <div className="-mt-0.5">
              <p className={`text-[15px] ${done ? 'font-semibold' : 'text-muted'}`}>
                {step === 'new' ? 'Order placed' : statusLabel(step, order.fulfilment)}
              </p>
              {done && at && <p className="text-sm text-muted">{formatDateTime(at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
};
