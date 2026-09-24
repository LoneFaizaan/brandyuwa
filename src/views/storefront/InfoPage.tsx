import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from '../../lib/router';
import { OPENING_HOURS, usePageTitle } from '../../lib/hooks';
import { formatPrice } from '../../lib/format';
import { STORE_ADDRESS_FULL, STORE_CONFIG, STORE_PHONE_DISPLAY, whatsappLink } from '../../data/storeConfig';
import { WhatsAppIcon } from '../../components/common/SocialIcons';

export type InfoPageName = 'about' | 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms';

const { name, delivery, exchangeDays, payments } = STORE_CONFIG;
const freeAbove = formatPrice(delivery.freeAbove);
const fee = formatPrice(delivery.fee);

interface Block {
  heading?: string;
  body: React.ReactNode;
}

const PAGES: Record<InfoPageName, { title: string; intro?: string; blocks: Block[]; faq?: boolean }> = {
  about: {
    title: `About ${name}`,
    intro: `${name} is a men's clothing shop in ${STORE_CONFIG.address.locality}, ${STORE_CONFIG.address.city}.`,
    blocks: [
      {
        body: 'We keep everyday shirts, t-shirts, jeans, trousers, jackets and winterwear in regular sizes. Shop online and get it delivered, order on WhatsApp, or come to the shop to see and try things before you buy.',
      },
      {
        heading: 'Find us',
        body: (
          <>
            {STORE_ADDRESS_FULL}. Open {OPENING_HOURS}, {STORE_CONFIG.hours.days.toLowerCase()}.{' '}
            <Link to="/contact" className="link">
              Get directions
            </Link>
          </>
        ),
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    faq: true,
    blocks: [
      {
        heading: 'How do I place an order?',
        body: 'Choose your size, add items to your bag and go to checkout. When you place the order, WhatsApp opens with your order details — tap Send and we will confirm it with you.',
      },
      {
        heading: 'How much is delivery?',
        body: `Delivery is free on orders above ${freeAbove}. Smaller orders have a ${fee} delivery charge.${
          delivery.pickup ? ' Picking up from the shop is always free.' : ''
        }`,
      },
      {
        heading: 'How long does delivery take?',
        body: `Most orders arrive in ${delivery.estimate}. We will tell you the expected date on WhatsApp when your order is packed.`,
      },
      {
        heading: 'Can I pay cash on delivery?',
        body: payments.cashOnDelivery
          ? `Yes. You can pay by cash or UPI when your order arrives.${payments.upiId ? ' You can also pay by UPI right after ordering.' : ''}`
          : 'You can pay by UPI after placing your order.',
      },
      {
        heading: "What if the size doesn't fit?",
        body: `You can exchange for another size within ${exchangeDays} days of delivery. The item must be unworn and unwashed, with its tags on. Message us on WhatsApp with your order number, or bring it to the shop.`,
      },
      {
        heading: 'Can I try clothes before buying?',
        body: `Yes — visit our shop in ${STORE_CONFIG.address.locality}, ${STORE_CONFIG.address.city}. We're open ${OPENING_HOURS}, ${STORE_CONFIG.hours.days.toLowerCase()}.`,
      },
      {
        heading: 'Where can I see my order?',
        body: (
          <>
            Orders placed on this phone appear in{' '}
            <Link to="/orders" className="link">
              My orders
            </Link>
            . For the latest update, message us on WhatsApp.
          </>
        ),
      },
    ],
  },

  shipping: {
    title: 'Delivery',
    blocks: [
      {
        heading: 'Charges',
        body: `Free delivery on orders above ${freeAbove}. Orders below that have a ${fee} delivery charge, shown at checkout before you order.`,
      },
      { heading: 'Delivery time', body: `Most orders arrive in ${delivery.estimate} after we confirm them.` },
      ...(delivery.pickup
        ? [{ heading: 'Pick up from the shop', body: `Choose "Pick up from shop" at checkout. It's free, and we'll message you when your order is ready.` }]
        : []),
      ...(payments.cashOnDelivery ? [{ heading: 'Cash on delivery', body: 'Pay by cash or UPI when your order arrives.' }] : []),
      { heading: 'Updates', body: `We keep you updated on WhatsApp at the number you give at checkout.` },
    ],
  },

  returns: {
    title: 'Exchanges & returns',
    blocks: [
      {
        heading: `${exchangeDays}-day size exchange`,
        body: `If something doesn't fit, you can exchange it for another size within ${exchangeDays} days of delivery or pickup.`,
      },
      { heading: 'Condition', body: 'Items must be unworn and unwashed, with the original tags still attached.' },
      {
        heading: 'How to exchange',
        body: `Message us on WhatsApp at ${STORE_PHONE_DISPLAY} with your order number and the size you need, or bring the item to our shop.`,
      },
      {
        heading: 'Damaged or wrong item',
        body: 'If you receive a damaged or wrong item, send us a photo on WhatsApp and we will sort it out with you.',
      },
    ],
  },

  privacy: {
    title: 'Privacy',
    blocks: [
      {
        heading: 'What we collect',
        body: 'When you order, we ask for your name, mobile number and (for delivery) your address. We use these only to deliver your order and to contact you about it.',
      },
      {
        heading: 'Where it goes',
        body: 'Your order details are sent to us through WhatsApp when you tap Send. A copy is also kept on your own device so you can see your orders and check out faster next time.',
      },
      { heading: 'What we never do', body: 'We do not sell or share your details with anyone for advertising.' },
      {
        heading: 'Removing your details',
        body: "Clearing your browser's site data removes everything saved on your device. To remove your details from our records, message us on WhatsApp.",
      },
    ],
  },

  terms: {
    title: 'Terms',
    blocks: [
      { heading: 'Prices', body: 'All prices are in Indian Rupees and include taxes. Delivery charges, if any, are shown at checkout.' },
      {
        heading: 'Orders',
        body: 'Your order is confirmed when we reply on WhatsApp. If an item runs out before we confirm, we will let you know and you will not be charged for it.',
      },
      { heading: 'Colours', body: 'Photos are as close to the real product as possible, but colours can look slightly different on some screens.' },
      {
        heading: 'Exchanges',
        body: (
          <>
            See our{' '}
            <Link to="/returns" className="link">
              exchange policy
            </Link>
            .
          </>
        ),
      },
    ],
  },
};

export const InfoPage: React.FC<{ page: InfoPageName }> = ({ page }) => {
  const content = PAGES[page];
  usePageTitle(content.title);

  return (
    <div className="page max-w-2xl animate-fade-in py-5 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight">{content.title}</h1>
      {content.intro && <p className="mt-3 text-lg leading-relaxed">{content.intro}</p>}

      {content.faq ? (
        <div className="card mt-6 divide-y divide-line">
          {content.blocks.map((b, i) => (
            <details key={i} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[15px] font-semibold">
                {b.heading}
                <ChevronDown size={20} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4 text-[15px] leading-relaxed text-ink-2">{b.body}</div>
            </details>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {content.blocks.map((b, i) => (
            <section key={i}>
              {b.heading && <h2 className="text-lg font-semibold">{b.heading}</h2>}
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{b.body}</p>
            </section>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-2xl bg-soft p-5">
        <p className="text-[15px] font-semibold">Still have a question?</p>
        <p className="mt-1 text-sm text-muted">We usually reply during shop hours ({OPENING_HOURS}).</p>
        <a href={whatsappLink()} target="_blank" rel="noreferrer" className="btn btn-whatsapp mt-4">
          <WhatsAppIcon size={18} />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};
