import React from 'react';
import { STORE_CONFIG } from '../../data/storeConfig';

export const Logo: React.FC<{ light?: boolean; suffix?: string }> = ({ light, suffix }) => (
  <span className="inline-flex items-center gap-2">
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-wide ${
        light ? 'bg-white text-ink' : 'bg-ink text-white'
      }`}
      aria-hidden="true"
    >
      {STORE_CONFIG.shortName}
    </span>
    <span className={`text-[17px] font-semibold tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
      {STORE_CONFIG.name}
      {suffix && <span className={`ml-1.5 font-medium ${light ? 'text-white/60' : 'text-muted'}`}>{suffix}</span>}
    </span>
  </span>
);
