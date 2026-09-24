import React from 'react';
import { STORE_CONFIG } from '../../data/storeConfig';

export interface LogoProps {
  /** If true, styles the logo with white and gold for dark backgrounds (e.g. Admin bar) */
  light?: boolean;
  /** Optional suffix text, e.g. "Staff" */
  suffix?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the cursive "Run for fashion" tagline */
  showTagline?: boolean;
  /** Whether to show the circular/rounded monogram icon badge */
  withBadge?: boolean;
  /** Rendering mode: 'standard' (vector text+badge), 'image' (transparent PNG), 'badge-only' */
  variant?: 'standard' | 'image' | 'badge-only';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  light = false,
  suffix,
  size = 'md',
  showTagline = true,
  withBadge = true,
  variant = 'standard',
  className = '',
}) => {
  // Image mode: renders the high-res transparent PNG asset
  if (variant === 'image') {
    const src = light
      ? '/brand-logo-wordmark-white.png'
      : '/brand-logo-wordmark.png';
    const heightClass =
      size === 'sm' ? 'h-7' : size === 'lg' ? 'h-11' : 'h-9';

    return (
      <span className={`inline-flex items-center gap-2 select-none ${className}`}>
        <img
          src={src}
          alt={`${STORE_CONFIG.name} — ${STORE_CONFIG.tagline}`}
          className={`${heightClass} w-auto object-contain`}
        />
        {suffix && (
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              light
                ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                : 'bg-ink text-white'
            }`}
          >
            {suffix}
          </span>
        )}
      </span>
    );
  }

  // Sizing definitions
  const badgeSize =
    size === 'sm'
      ? 'h-8 w-8 text-xs'
      : size === 'lg'
      ? 'h-11 w-11 text-base'
      : 'h-9 w-9 text-xs sm:text-sm';

  const titleSize =
    size === 'sm'
      ? 'text-[15px]'
      : size === 'lg'
      ? 'text-[22px]'
      : 'text-[17px] sm:text-[18px]';

  const taglineSize =
    size === 'sm'
      ? 'text-[10px]'
      : size === 'lg'
      ? 'text-[13px]'
      : 'text-[11px] sm:text-[12px]';

  // Badge-only variant
  if (variant === 'badge-only') {
    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl font-bold tracking-tight shadow-sm select-none ${
          light
            ? 'bg-gradient-to-br from-[#102754] via-[#091b3d] to-[#040e24] ring-1 ring-amber-400/40'
            : 'bg-gradient-to-br from-[#0c224e] via-[#081836] to-[#040c1c] ring-1 ring-[#cca038]/30 shadow-brand-navy/10'
        } ${badgeSize} ${className}`}
        aria-label={`${STORE_CONFIG.name} logo`}
      >
        <span className="text-white">B</span>
        <span className="text-[#cca038]">Y</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      aria-label={`${STORE_CONFIG.name} — ${STORE_CONFIG.tagline}`}
    >
      {withBadge && (
        <span
          className={`relative flex shrink-0 items-center justify-center rounded-xl font-black tracking-tight shadow-sm transition-transform ${
            light
              ? 'bg-gradient-to-br from-[#102754] via-[#091b3d] to-[#040e24] ring-1 ring-amber-400/40 text-white'
              : 'bg-gradient-to-br from-[#0c224e] via-[#081836] to-[#040c1c] ring-1 ring-[#cca038]/30 text-white shadow-brand-navy/15'
          } ${badgeSize}`}
          aria-hidden="true"
        >
          <span className="text-white">B</span>
          <span className="text-[#cca038] ml-0.5">Y</span>
        </span>
      )}

      <div className="flex flex-col justify-center leading-none text-left">
        <div
          className={`flex items-baseline font-extrabold tracking-[0.06em] uppercase font-sans ${titleSize}`}
        >
          <span className={light ? 'text-white' : 'text-[#0b2158]'}>
            BRAND&nbsp;
          </span>
          <span className={light ? 'text-[#e5b842]' : 'text-[#cca038]'}>
            Y
          </span>
          <span className={light ? 'text-white' : 'text-[#0b2158]'}>
            UVA
          </span>

          {suffix && (
            <span
              className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                light
                  ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40'
                  : 'bg-ink text-white'
              }`}
            >
              {suffix}
            </span>
          )}
        </div>

        {showTagline && (
          <span
            className={`font-script italic tracking-wider mt-0.5 ${taglineSize} ${
              light ? 'text-slate-300/90' : 'text-[#143160]'
            }`}
          >
            {STORE_CONFIG.tagline}
          </span>
        )}
      </div>
    </span>
  );
};
