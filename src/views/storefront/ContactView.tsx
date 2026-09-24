import React from 'react';
import { ChevronRight, Mail } from 'lucide-react';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { STORE_CONFIG } from '../../data/storeConfig';
import { StoreInfoCard } from '../../components/storefront/StoreInfoCard';
import { FacebookIcon, InstagramIcon } from '../../components/common/SocialIcons';

export const ContactView: React.FC = () => {
  usePageTitle('Contact & visit');
  const { socials, contact, address } = STORE_CONFIG;

  const channels = [
    { icon: <InstagramIcon size={20} />, label: 'Instagram', value: socials.instagram.handle, href: socials.instagram.url },
    { icon: <FacebookIcon size={20} />, label: 'Facebook', value: socials.facebook.handle, href: socials.facebook.url },
    contact.email && { icon: <Mail size={20} />, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string }[];

  return (
    <div className="page max-w-4xl animate-fade-in py-5 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight">Contact & visit us</h1>
      <p className="mt-1 text-[15px] text-muted">Call, WhatsApp or drop by the shop. We're happy to help with sizes and orders.</p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <StoreInfoCard title={STORE_CONFIG.name} />
        <div className="overflow-hidden rounded-2xl border border-line bg-soft">
          <iframe
            title={`Map showing ${STORE_CONFIG.name}`}
            src={address.mapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full md:h-full md:min-h-[22rem]"
          />
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Follow us</h2>
        <ul className="card mt-3 divide-y divide-line">
          {channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3.5 hover:bg-soft">
                <span className="text-muted">{c.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">{c.label}</span>
                  <span className="block truncate text-sm text-muted">{c.value}</span>
                </span>
                <ChevronRight size={18} className="text-faint" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-[15px] text-muted">
        Questions about delivery or exchanges? See the{' '}
        <Link to="/faq" className="link">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
};
