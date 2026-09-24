import React, { useRef, useState } from 'react';
import { ChevronLeft, Info, MapPin } from 'lucide-react';
import type { Fulfilment, PaymentMethod } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Link, useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { cleanPhone, formatPrice, isValidPhone, plural } from '../../lib/format';
import { calcTotals } from '../../lib/pricing';
import { orderWhatsAppLink } from '../../lib/orderMessages';
import { STORE_CONFIG } from '../../data/storeConfig';
import { INDIAN_STATES } from '../../data/indianStates';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductImage } from '../../components/common/ProductImage';
import { WhatsAppIcon } from '../../components/common/SocialIcons';

type Field = 'name' | 'phone' | 'line1' | 'city' | 'pincode' | 'state';

export const CheckoutView: React.FC = () => {
  usePageTitle('Checkout');
  const { cart, cartCount, cartSubtotal, coupon, placeOrder, savedCustomer } = useStore();
  const { navigate } = useRouter();
  const placing = useRef(false);

  const saved = savedCustomer?.address;
  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery');
  const [name, setName] = useState(savedCustomer?.name ?? '');
  const [phone, setPhone] = useState(savedCustomer?.phone ?? '');
  const [line1, setLine1] = useState(saved?.line1 ?? '');
  const [landmark, setLandmark] = useState(saved?.landmark ?? '');
  const [city, setCity] = useState(saved?.city ?? '');
  const [pincode, setPincode] = useState(saved?.pincode ?? '');
  const [state, setState] = useState(saved?.state ?? STORE_CONFIG.address.state);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const paymentOptions = getPaymentOptions(fulfilment);
  const [paymentChoice, setPayment] = useState<PaymentMethod>(paymentOptions[0].value);
  const payment = paymentOptions.some((o) => o.value === paymentChoice) ? paymentChoice : paymentOptions[0].value;

  if (cart.length === 0) {
    if (placing.current) return null;
    return (
      <div className="page py-6">
        <EmptyState
          title="Your bag is empty"
          description="Add something to your bag before checking out."
          action={
            <Link to="/shop" className="btn btn-primary">
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  const totals = calcTotals(cartSubtotal, fulfilment, coupon);
  const hasProblem = cart.some((i) => i.quantity > i.available);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) e.name = 'Please enter your name';
    if (!isValidPhone(phone)) e.phone = 'Please enter a valid 10-digit mobile number';
    if (fulfilment === 'delivery') {
      if (line1.trim().length < 5) e.line1 = 'Please enter your house, street and area';
      if (!city.trim()) e.city = 'Please enter your town or city';
      if (!/^\d{6}$/.test(pincode)) e.pincode = 'Enter the 6-digit PIN code';
      if (!state) e.state = 'Please choose your state';
    }
    return e;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    const first = (['name', 'phone', 'line1', 'city', 'pincode', 'state'] as Field[]).find((f) => found[f]);
    if (first) {
      const el = document.getElementById(`checkout-${first}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }

    placing.current = true;
    const order = placeOrder({
      customer: { name: name.trim(), phone: cleanPhone(phone) },
      fulfilment,
      address:
        fulfilment === 'delivery'
          ? { line1: line1.trim(), landmark: landmark.trim() || undefined, city: city.trim(), state, pincode }
          : undefined,
      payment,
      note,
    });
    if (!order) {
      placing.current = false;
      return;
    }
    window.open(orderWhatsAppLink(order), '_blank', 'noopener');
    navigate(`/order-placed/${order.id}`, { replace: true });
  };

  const clearError = (field: Field) => errors[field] && setErrors((e) => ({ ...e, [field]: undefined }));

  return (
    <div className="animate-fade-in pb-8 md:pb-10">
      <div className="page max-w-5xl pt-4 md:pt-8">
        <Link to="/cart" className="-ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:text-ink">
          <ChevronLeft size={18} />
          Back to bag
        </Link>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">Checkout</h1>

        <form id="checkout-form" onSubmit={submit} noValidate className="mt-6 grid gap-8 md:grid-cols-[1fr_20rem] lg:grid-cols-[1fr_22rem]">
          <div className="space-y-8">
            {STORE_CONFIG.delivery.pickup && (
              <Section title="How would you like to get it?">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ChoiceCard
                    name="fulfilment"
                    checked={fulfilment === 'delivery'}
                    onChange={() => setFulfilment('delivery')}
                    title="Home delivery"
                    detail={`${calcTotals(cartSubtotal, 'delivery', null).deliveryFee === 0 ? 'Free' : formatPrice(STORE_CONFIG.delivery.fee)} · ${STORE_CONFIG.delivery.estimate}`}
                  />
                  <ChoiceCard
                    name="fulfilment"
                    checked={fulfilment === 'pickup'}
                    onChange={() => setFulfilment('pickup')}
                    title="Pick up from shop"
                    detail={`Free · ${STORE_CONFIG.address.locality}, ${STORE_CONFIG.address.city}`}
                  />
                </div>
              </Section>
            )}

            <Section title="Your details">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-name" className="label">
                    Full name
                  </label>
                  <input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError('name');
                    }}
                    autoComplete="name"
                    className={`field ${errors.name ? 'field-error' : ''}`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-phone" className="label">
                    Mobile number
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-muted">+91</span>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      value={phone}
                      onChange={(e) => {
                        // Allow "+91 98765 43210" and similar formats; cleaned up on submit
                        setPhone(e.target.value.replace(/[^\d\s+-]/g, '').slice(0, 18));
                        clearError('phone');
                      }}
                      className={`field pl-14 ${errors.phone ? 'field-error' : ''}`}
                      aria-invalid={!!errors.phone}
                    />
                  </div>
                  {errors.phone ? <p className="error-text">{errors.phone}</p> : <p className="hint">We'll call or WhatsApp you about the order.</p>}
                </div>
              </div>
            </Section>

            {fulfilment === 'delivery' ? (
              <Section title="Delivery address">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-line1" className="label">
                      House no., street and area
                    </label>
                    <textarea
                      id="checkout-line1"
                      rows={2}
                      value={line1}
                      onChange={(e) => {
                        setLine1(e.target.value);
                        clearError('line1');
                      }}
                      autoComplete="street-address"
                      className={`field resize-none ${errors.line1 ? 'field-error' : ''}`}
                      aria-invalid={!!errors.line1}
                    />
                    {errors.line1 && <p className="error-text">{errors.line1}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-landmark" className="label">
                      Landmark <span className="font-normal text-muted">(optional)</span>
                    </label>
                    <input
                      id="checkout-landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. near the masjid"
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-city" className="label">
                      Town / city
                    </label>
                    <input
                      id="checkout-city"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        clearError('city');
                      }}
                      autoComplete="address-level2"
                      className={`field ${errors.city ? 'field-error' : ''}`}
                      aria-invalid={!!errors.city}
                    />
                    {errors.city && <p className="error-text">{errors.city}</p>}
                  </div>
                  <div>
                    <label htmlFor="checkout-pincode" className="label">
                      PIN code
                    </label>
                    <input
                      id="checkout-pincode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        clearError('pincode');
                      }}
                      className={`field tabular ${errors.pincode ? 'field-error' : ''}`}
                      aria-invalid={!!errors.pincode}
                    />
                    {errors.pincode && <p className="error-text">{errors.pincode}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-state" className="label">
                      State
                    </label>
                    <select
                      id="checkout-state"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        clearError('state');
                      }}
                      autoComplete="address-level1"
                      className={`field ${errors.state ? 'field-error' : ''}`}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Section>
            ) : (
              <Section title="Pickup from">
                <div className="flex gap-3 rounded-xl bg-soft p-4 text-[15px]">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-muted" />
                  <p className="leading-relaxed">
                    <span className="font-semibold">{STORE_CONFIG.name}</span>
                    <br />
                    {STORE_CONFIG.address.line1}, {STORE_CONFIG.address.locality}, {STORE_CONFIG.address.city}
                    <br />
                    <span className="text-muted">We'll message you when your order is ready.</span>
                  </p>
                </div>
              </Section>
            )}

            <Section title="Payment">
              <div className="grid gap-3">
                {paymentOptions.map((o) => (
                  <ChoiceCard
                    key={o.value}
                    name="payment"
                    checked={payment === o.value}
                    onChange={() => setPayment(o.value)}
                    title={o.title}
                    detail={o.detail}
                  />
                ))}
              </div>
            </Section>

            <div>
              <label htmlFor="checkout-note" className="label">
                Note for the shop <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="checkout-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 300))}
                placeholder="e.g. please call before delivery"
                className="field resize-none"
              />
            </div>
          </div>

          {/* Summary */}
          <aside className="md:sticky md:top-20 md:self-start">
            <div className="card p-5">
              <h2 className="text-[15px] font-semibold">Your order · {plural(cartCount, 'item')}</h2>
              <ul className="mt-3 space-y-3">
                {cart.map((i) => (
                  <li key={i.key} className="flex gap-3">
                    <ProductImage src={i.product.images[0]} alt="" className="h-16 w-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="line-clamp-2 font-medium">{i.product.name}</p>
                      <p className="text-muted">
                        Size {i.size}
                        {i.color && ` · ${i.color}`} · Qty {i.quantity}
                      </p>
                    </div>
                    <p className="tabular shrink-0 text-sm font-medium">{formatPrice(i.product.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Items</dt>
                  <dd className="tabular">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-ok">
                    <dt>Discount ({coupon?.code})</dt>
                    <dd className="tabular">−{formatPrice(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">{fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
                  <dd className="tabular">{totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="tabular">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              {hasProblem && (
                <p className="mt-3 text-sm font-medium text-sale">
                  Some items in your bag are no longer available.{' '}
                  <Link to="/cart" className="underline">
                    Update bag
                  </Link>
                </p>
              )}
              <button type="submit" disabled={hasProblem} className="btn btn-whatsapp mt-5 hidden w-full md:flex">
                <WhatsAppIcon size={18} />
                Place order on WhatsApp
              </button>
              <p className="mt-3 flex gap-2 text-sm leading-relaxed text-muted">
                <Info size={15} className="mt-0.5 shrink-0" />
                WhatsApp will open with your order details. Tap Send there to confirm your order with us.
              </p>
            </div>
          </aside>
        </form>
      </div>

      {/* Phone order bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas md:hidden">
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="shrink-0">
            <p className="text-sm text-muted">Total</p>
            <p className="tabular text-lg font-bold leading-tight">{formatPrice(totals.total)}</p>
          </div>
          <button type="submit" form="checkout-form" disabled={hasProblem} className="btn btn-whatsapp flex-1 px-3">
            <WhatsAppIcon size={18} />
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};

function getPaymentOptions(fulfilment: Fulfilment) {
  const { cashOnDelivery, upiId } = STORE_CONFIG.payments;
  const options: { value: PaymentMethod; title: string; detail: string }[] = [];
  if (fulfilment === 'pickup') {
    options.push({ value: 'store', title: 'Pay at the shop', detail: 'Cash or UPI when you collect' });
  } else if (cashOnDelivery || !upiId) {
    options.push({ value: 'cod', title: 'Cash on delivery', detail: 'Pay by cash or UPI when it arrives' });
  }
  if (upiId) options.push({ value: 'upi', title: 'Pay now by UPI', detail: 'GPay, PhonePe, Paytm or any UPI app' });
  return options;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="mb-3 text-lg font-semibold">{title}</h2>
    {children}
  </section>
);

interface ChoiceCardProps {
  name: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  detail: string;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ name, checked, onChange, title, detail }) => (
  <label
    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
      checked ? 'border-ink bg-soft ring-1 ring-ink' : 'border-line-strong hover:border-ink'
    }`}
  >
    <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-ink' : 'border-line-strong'}`}
      aria-hidden="true"
    >
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
    <span>
      <span className="block text-[15px] font-semibold">{title}</span>
      <span className="block text-sm text-muted">{detail}</span>
    </span>
  </label>
);
