import React from 'react';
import { STORE_CONFIG } from '../../data/storeConfig';

export interface LogoProps {
  /** White and gold text for dark backgrounds (e.g. the staff bar) */
  light?: boolean;
  /** Optional label after the name, e.g. "Staff" */
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Show the "Run for fashion" tagline under the name */
  showTagline?: boolean;
  /** Show the round logo badge before the name */
  withBadge?: boolean;
  /**
   * 'standard'   round badge + name as text (sharp at any size)
   * 'banner'     the wide logo image (brand-logo-cropped.png)
   * 'badge-only' just the round badge
   */
  variant?: 'standard' | 'banner' | 'badge-only';
  className?: string;
}

const BADGE_SIZE = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-12 w-12' };
const BANNER_HEIGHT = { sm: 'h-10', md: 'h-14', lg: 'h-20' };
const TITLE_SIZE = { sm: 'text-[15px]', md: 'text-[17px] sm:text-[18px]', lg: 'text-[22px]' };
const TAGLINE_SIZE = { sm: 'text-[10px]', md: 'text-[11px] sm:text-[12px]', lg: 'text-[13px]' };

const Badge: React.FC<{ size: 'sm' | 'md' | 'lg'; light: boolean; className?: string }> = ({ size, light, className = '' }) => (
  <img
    src={STORE_CONFIG.logos.round}
    alt=""
    width={48}
    height={48}
    className={`shrink-0 rounded-full object-cover ${light ? 'ring-1 ring-amber-400/50' : 'shadow-sm'} ${BADGE_SIZE[size]} ${className}`}
  />
);

const SuffixTag: React.FC<{ light: boolean; children: React.ReactNode }> = ({ light, children }) => (
  <span
    className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
      light ? 'bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/40' : 'bg-ink text-white'
    }`}
  >
    {children}
  </span>
);

export const Logo: React.FC<LogoProps> = ({
  light = false,
  suffix,
  size = 'md',
  showTagline = true,
  withBadge = true,
  variant = 'standard',
  className = '',
}) => {
  const label = `${STORE_CONFIG.name} — ${STORE_CONFIG.tagline}`;

  if (variant === 'banner') {
    return (
      <img
        src={STORE_CONFIG.logos.banner}
        alt={label}
        width={824}
        height={360}
        className={`w-auto select-none rounded-xl object-contain ${BANNER_HEIGHT[size]} ${className}`}
      />
    );
  }

  if (variant === 'badge-only') {
    return (
      <span className={`inline-flex ${className}`} role="img" aria-label={label}>
        <Badge size={size} light={light} />
      </span>
    );
  }

  return (
    <span className={`inline-flex select-none items-center gap-2.5 ${className}`} role="img" aria-label={label}>
      {withBadge && <Badge size={size} light={light} />}
      <span className="flex flex-col justify-center text-left leading-none">
        <span className={`flex items-baseline font-sans font-extrabold uppercase tracking-[0.06em] ${TITLE_SIZE[size]}`}>
          <span className={light ? 'text-white' : 'text-brand-navy'}>BRAND&nbsp;</span>
          <span className={light ? 'text-brand-gold-light' : 'text-brand-gold'}>Y</span>
          <span className={light ? 'text-white' : 'text-brand-navy'}>UVA</span>
          {suffix && <SuffixTag light={light}>{suffix}</SuffixTag>}
        </span>
        {showTagline && (
          <span className={`mt-0.5 font-script italic tracking-wider ${TAGLINE_SIZE[size]} ${light ? 'text-slate-300/90' : 'text-[#143160]'}`}>
            {STORE_CONFIG.tagline}
          </span>
        )}
      </span>
    </span>
  );
};
