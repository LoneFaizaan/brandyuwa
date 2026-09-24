import React, { useState } from 'react';
import type { SizeChart } from '../../data/catalog';
import { whatsappLink } from '../../data/storeConfig';
import { Modal } from './Modal';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  chart: SizeChart;
}

// Approximate body measurements in inches
const TOPS = [
  { size: 'S', chest: 38, shoulder: 17 },
  { size: 'M', chest: 40, shoulder: 17.5 },
  { size: 'L', chest: 42, shoulder: 18 },
  { size: 'XL', chest: 44, shoulder: 18.5 },
  { size: 'XXL', chest: 46, shoulder: 19 },
  { size: '3XL', chest: 48, shoulder: 19.5 },
];

const WAIST = [28, 30, 32, 34, 36, 38, 40].map((w) => ({ size: String(w), waist: w, hip: w + 8 }));

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ open, onClose, chart }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const fmt = (inches: number) => (unit === 'in' ? String(inches) : String(Math.round(inches * 2.54)));

  const columns = chart === 'waist' ? ['Size', 'Waist', 'Hip'] : ['Size', 'Chest', 'Shoulder'];
  const rows =
    chart === 'waist'
      ? WAIST.map((r) => [r.size, fmt(r.waist), fmt(r.hip)])
      : TOPS.map((r) => [r.size, fmt(r.chest), fmt(r.shoulder)]);

  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Body measurements</p>
          <div className="inline-flex rounded-full bg-soft p-1" role="group" aria-label="Units">
            {(['in', 'cm'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                aria-pressed={unit === u}
                className={`h-8 rounded-full px-4 text-sm font-semibold ${unit === u ? 'bg-canvas text-ink shadow-sm' : 'text-muted'}`}
              >
                {u === 'in' ? 'Inches' : 'Cm'}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full overflow-hidden rounded-xl text-left text-[15px]">
          <thead className="bg-soft text-sm text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-4 py-2.5 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r[0]}>
                {r.map((cell, i) => (
                  <td key={i} className={`tabular px-4 py-2.5 ${i === 0 ? 'font-semibold' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-sm leading-relaxed text-muted">
          {chart === 'waist'
            ? 'Measure around your waist where you normally wear your trousers.'
            : 'Measure around the fullest part of your chest, under the arms.'}{' '}
          Sizes can vary a little between styles.{' '}
          <a href={whatsappLink('Hello, I need help choosing a size.')} target="_blank" rel="noreferrer" className="link">
            Ask us on WhatsApp
          </a>{' '}
          if you are unsure.
        </p>
      </div>
    </Modal>
  );
};
