import React from 'react';
import { Clock, Copy, MapPin, Navigation, Phone } from 'lucide-react';
import {
  STORE_ADDRESS_FULL,
  STORE_CONFIG,
  STORE_PHONE_DISPLAY,
  STORE_TEL,
  whatsappLink,
} from '../../data/storeConfig';
import { isStoreOpenNow, OPENING_HOURS } from '../../lib/hooks';
import { useStore } from '../../context/StoreContext';
import { WhatsAppIcon } from '../common/SocialIcons';

/** Shop address, hours and one-tap actions. Used on the home and contact pages. */
export const StoreInfoCard: React.FC<{ title?: string }> = ({ title = 'Visit our shop' }) => {
  const { showToast } = useStore();
  const open = isStoreOpenNow();
  const { address } = STORE_CONFIG;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(STORE_ADDRESS_FULL);
      showToast('Address copied');
    } catch {
      showToast('Could not copy. Please long-press the address to copy it.', 'error');
    }
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className={`badge ${open ? 'bg-ok-soft text-ok' : 'bg-soft text-muted'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-ok' : 'bg-faint'}`} />
          {open ? 'Open now' : 'Closed now'}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-[15px]">
        <div className="flex gap-3">
          <MapPin size={20} className="mt-0.5 shrink-0 text-muted" />
          <p className="select-text leading-relaxed">
            {address.line1}, {address.locality}
            <br />
            {address.city} {address.pincode}, {address.state}
          </p>
        </div>
        <div className="flex gap-3">
          <Clock size={20} className="mt-0.5 shrink-0 text-muted" />
          <p>
            {OPENING_HOURS}
            <span className="text-muted"> · {STORE_CONFIG.hours.days}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Phone size={20} className="mt-0.5 shrink-0 text-muted" />
          <a href={STORE_TEL} className="link">
            {STORE_PHONE_DISPLAY}
          </a>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a href={address.mapsUrl} target="_blank" rel="noreferrer" className="btn btn-primary col-span-2">
          <Navigation size={18} />
          Get directions
        </a>
        <a href={STORE_TEL} className="btn btn-secondary">
          <Phone size={18} />
          Call
        </a>
        <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-secondary">
          <WhatsAppIcon size={18} className="text-whatsapp" />
          WhatsApp
        </a>
      </div>
      <button type="button" onClick={copyAddress} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <Copy size={15} />
        Copy address
      </button>
    </div>
  );
};
