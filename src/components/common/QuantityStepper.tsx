import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: 'md' | 'lg';
  /** Let the number be typed directly (used for stock counts) */
  editable?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
  label,
  size = 'md',
  editable = false,
}) => {
  const btn = size === 'lg' ? 'h-11 w-11' : 'h-10 w-10';
  return (
    <div className="inline-flex items-center rounded-xl border border-line-strong bg-canvas" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btn} flex items-center justify-center rounded-l-xl text-ink hover:bg-soft disabled:text-faint disabled:hover:bg-transparent`}
        aria-label={`Decrease ${label}`}
      >
        <Minus size={16} />
      </button>
      {editable ? (
        <input
          type="number"
          inputMode="numeric"
          min={min}
          value={value}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
          }}
          className="tabular h-10 w-12 border-x border-line bg-transparent text-center text-base font-semibold text-ink outline-none focus:bg-soft"
          aria-label={label}
        />
      ) : (
        <span className="tabular min-w-[2.25rem] text-center text-base font-semibold" aria-live="polite">
          {value}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btn} flex items-center justify-center rounded-r-xl text-ink hover:bg-soft disabled:text-faint disabled:hover:bg-transparent`}
        aria-label={`Increase ${label}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
