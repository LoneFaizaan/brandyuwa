import React from 'react';
import { Link } from '../../lib/router';
import { STORE_CONFIG, STORE_PHONE_DISPLAY, STORE_TEL, whatsappLink } from '../../data/storeConfig';
import { OPENING_HOURS } from '../../lib/hooks';
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from './SocialIcons';
import { Logo } from './Logo';

const SHOP_LINKS = [
  { label: 'All products', to: '/shop' },
  { label: 'Saved items', to: '/saved' },
  { label: 'My orders', to: '/orders' },
  { label: 'Bag', to: '/cart' },
];

const HELP_LINKS = [
  { label: 'Contact & visit', to: '/contact' },
  { label: 'Delivery', to: '/shipping' },
  { label: 'Exchanges & returns', to: '/returns' },
  { label: 'FAQ', to: '/faq' },
  { label: 'About us', to: '/about' },
];

export const Footer: React.FC = () => {
  const { address, socials } = STORE_CONFIG;
  const social = 'icon-btn border border-line-strong bg-canvas';

  return (
    <footer className="border-t border-line bg-soft">
      <div className="page grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-4 sm:col-span-2">
          <Logo />
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">
            {address.line1}, {address.locality}, {address.city} {address.pincode}
            <br />
            {OPENING_HOURS} · {STORE_CONFIG.hours.days}
            <br />
            <a href={STORE_TEL} className="link">
              {STORE_PHONE_DISPLAY}
            </a>
          </p>
          <div className="flex gap-2">
            <a href={socials.instagram.url} target="_blank" rel="noreferrer" className={social} aria-label="Instagram">
              <InstagramIcon size={20} />
            </a>
            <a href={socials.facebook.url} target="_blank" rel="noreferrer" className={social} aria-label="Facebook">
              <FacebookIcon size={20} />
            </a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={social} aria-label="WhatsApp">
              <WhatsAppIcon size={20} />
            </a>
          </div>
        </div>

        <FooterLinks title="Shop" links={SHOP_LINKS} />
        <FooterLinks title="Help" links={HELP_LINKS} />
      </div>

      <div className="border-t border-line">
        <div className="page flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-5 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {STORE_CONFIG.name}
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-ink">
              Terms
            </Link>
            <Link to="/admin" className="hover:text-ink">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLinks: React.FC<{ title: string; links: { label: string; to: string }[] }> = ({ title, links }) => (
  <div>
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2>
    <ul className="mt-3 space-y-1">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to} className="inline-block py-1.5 text-[15px] text-ink hover:underline">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
