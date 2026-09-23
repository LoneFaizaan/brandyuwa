import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress } from '../../types';
import { DEFAULT_SHIPPING_ADDRESS } from '../../data/mockData';

export const CheckoutView: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal, 
    activeCoupon,
    applyCoupon,
    removeCoupon,
    placeOrder, 
    setStorefrontPage,
    setSelectedOrderId,
    showToast 
  } = useStore();

  // Checkout form states
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.s@gmail.com');
  const [phone, setPhone] = useState('+91 98450 12345');
  
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    DEFAULT_SHIPPING_ADDRESS,
    {
      fullName: 'Aarav Sharma',
      phone: '+91 98450 12345',
      addressLine: 'Atelier Architecture Studio, 12th Main Road, HAL 2nd Stage',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560008',
      type: 'Work'
    }
  ]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form state
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newType, setNewType] = useState<'Home' | 'Work'>('Home');

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('aaravsharma@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('884');

  // Coupon input
  const [couponCode, setCouponCode] = useState('');

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine || !newCity || !newPincode) {
      showToast('Please fill out all address fields', 'error');
      return;
    }
    const created: ShippingAddress = {
      fullName: newFullName || customerName,
      phone: newPhone || phone,
      addressLine: newAddressLine,
      city: newCity,
      state: newState || 'Karnataka',
      pincode: newPincode,
      type: newType
    };
    setAddresses(prev => [...prev, created]);
    setSelectedAddressIndex(addresses.length);
    setShowNewAddressForm(false);
    showToast('New delivery address saved', 'success');
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) {
      showToast('Your bag is empty', 'error');
      setStorefrontPage('shop');
      return;
    }

    const order = placeOrder({
      customerName,
      email,
      phone,
      shippingAddress: addresses[selectedAddressIndex],
      paymentMethod
    });

    setSelectedOrderId(order.id);
    setStorefrontPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-text-muted">shopping_bag</span>
        <h2 className="text-xl font-bold text-text-primary uppercase">Your Bag is Empty</h2>
        <p className="text-xs text-secondary">Select pieces from our catalog before checking out.</p>
        <button
          onClick={() => setStorefrontPage('shop')}
          className="bg-primary text-surface text-xs font-bold px-6 py-2.5 rounded-full uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* 1. Transactional Focused Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setStorefrontPage('shop')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-secondary hover:text-text-primary uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Bag</span>
          </button>
          <div className="text-center">
            <span className="font-bold text-sm tracking-widest uppercase text-text-primary">
              ATELIER CHECKOUT
            </span>
          </div>
          <div className="flex items-center space-x-1 text-text-muted text-xs">
            <span className="material-symbols-outlined text-[16px] text-emerald-700">lock</span>
            <span className="hidden sm:inline">256-Bit Encrypted</span>
          </div>
        </div>
      </header>

      {/* 2. Main Checkout Layout */}
      <main className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: 4 Checkout Steps */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-surface border border-border divide-y divide-border rounded-xs">
            
            {/* Step 1: Contact */}
            <section className="p-4 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  1. Contact Information
                </h2>
                <span className="text-[11px] text-text-muted">Verified</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-10 px-3 border border-border bg-surface-container-lowest text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 px-3 border border-border bg-surface-container-lowest text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Email for Delivery Updates</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 border border-border bg-surface-container-lowest text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </section>

            {/* Step 2: Delivery Address */}
            <section className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  2. Delivery Address
                </h2>
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-semibold text-text-primary hover:underline flex items-center space-x-1"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Add New</span>
                </button>
              </div>

              {/* Saved Address Radios */}
              <div className="space-y-3">
                {addresses.map((addr, idx) => {
                  const isChecked = selectedAddressIndex === idx;
                  return (
                    <label
                      key={idx}
                      className={`flex items-start space-x-3 p-3.5 border rounded-xs cursor-pointer transition ${
                        isChecked 
                          ? 'border-primary bg-surface-container-lowest shadow-sm' 
                          : 'border-border bg-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address_choice"
                        checked={isChecked}
                        onChange={() => setSelectedAddressIndex(idx)}
                        className="mt-1 text-primary focus:ring-0"
                      />
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-text-primary">
                            {addr.fullName} <span className="font-normal text-text-muted">({addr.type})</span>
                          </span>
                          {isChecked && (
                            <span className="text-[10px] uppercase font-bold text-primary bg-neutral-200 px-1.5 py-0.2 rounded-xs">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-secondary mt-1 leading-relaxed">{addr.addressLine}</p>
                        <p className="text-secondary">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-[11px] text-text-muted mt-1 font-mono">Mobile: {addr.phone}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Add Address Form */}
              {showNewAddressForm && (
                <form onSubmit={handleSaveNewAddress} className="mt-4 pt-4 border-t border-border space-y-3 bg-surface-container-low p-4 rounded-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-primary block">
                    Add New Delivery Address
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="h-9 px-3 border border-border bg-white text-xs"
                    />
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="h-9 px-3 border border-border bg-white text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Flat / Building / Street Address"
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    className="w-full h-9 px-3 border border-border bg-white text-xs"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="h-9 px-3 border border-border bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="h-9 px-3 border border-border bg-white text-xs"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="h-9 px-3 border border-border bg-white text-xs"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-3 py-1.5 text-xs text-secondary hover:text-text-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-primary text-surface text-xs font-bold uppercase rounded-xs"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Step 3: Delivery Method */}
            <section className="p-4 sm:p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                3. Delivery Method
              </h2>
              <div className="space-y-2">
                <label 
                  onClick={() => setDeliveryMethod('standard')}
                  className={`flex items-start space-x-3 p-3.5 border rounded-xs cursor-pointer ${
                    deliveryMethod === 'standard' ? 'border-primary bg-surface-container-lowest' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery_method"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="mt-1 text-primary focus:ring-0"
                  />
                  <div className="flex-1 flex justify-between text-xs">
                    <div>
                      <p className="font-bold text-text-primary">Standard BlueDart Express (2–4 days)</p>
                      <p className="text-secondary text-[11px] mt-0.5">Dispatched within 24 hours from Bengaluru studio</p>
                    </div>
                    <span className="font-bold text-emerald-700">FREE</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Step 4: Payment */}
            <section className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  4. Payment Method
                </h2>
                <span className="text-[11px] text-text-muted">Instant or COD</span>
              </div>

              <div className="space-y-3">
                {/* UPI Option */}
                <div className="border border-border rounded-xs overflow-hidden">
                  <label 
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'UPI' ? 'bg-surface-container-low font-bold' : 'bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-primary focus:ring-0"
                      />
                      <span className="text-xs text-text-primary">UPI (Google Pay, PhonePe, Paytm, QR)</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[20px]">qr_code_2</span>
                  </label>
                  {paymentMethod === 'UPI' && (
                    <div className="p-4 border-t border-border bg-surface-container-lowest space-y-2">
                      <label className="text-[10px] uppercase font-bold text-text-muted block">Enter UPI ID / VPA</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex-1 h-10 px-3 border border-border bg-surface text-xs focus:outline-none focus:border-primary font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => showToast('UPI ID Verified', 'success')}
                          className="px-4 h-10 bg-surface-container-low border border-border text-xs font-bold uppercase hover:bg-surface-container"
                        >
                          Verify
                        </button>
                      </div>
                      <p className="text-[10px] text-text-muted">A payment request will be sent to your UPI app.</p>
                    </div>
                  )}
                </div>

                {/* Card Option */}
                <div className="border border-border rounded-xs overflow-hidden">
                  <label 
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3.5 flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'Card' ? 'bg-surface-container-low font-bold' : 'bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        className="text-primary focus:ring-0"
                      />
                      <span className="text-xs text-text-primary">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[20px]">credit_card</span>
                  </label>
                  {paymentMethod === 'Card' && (
                    <div className="p-4 border-t border-border bg-surface-container-lowest space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full h-9 px-3 border border-border bg-surface text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full h-9 px-3 border border-border bg-surface text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full h-9 px-3 border border-border bg-surface text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className="border border-border rounded-xs overflow-hidden">
                  <label 
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 flex items-center justify-between cursor-pointer ${
                      paymentMethod === 'COD' ? 'bg-surface-container-low font-bold' : 'bg-surface'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment_choice"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-primary focus:ring-0"
                      />
                      <span className="text-xs text-text-primary">Cash on Delivery (Pay upon receipt)</span>
                    </div>
                    <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
                  </label>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-surface-container-lowest border border-border p-4 sm:p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-3">
              Order Summary ({cart.length} pieces)
            </h3>

            {/* Cart Items List */}
            <div className="divide-y divide-border max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="py-2.5 flex space-x-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-16 object-cover rounded-xs bg-surface-container shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-text-primary truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-secondary">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Application */}
            <div className="pt-2 border-t border-border">
              {activeCoupon ? (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-2 rounded-xs">
                  <span>Code <strong>{activeCoupon.code}</strong> applied</span>
                  <button onClick={removeCoupon} className="underline text-[11px] font-bold">Remove</button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-surface-container-low border border-border px-3 py-1.5 text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (applyCoupon(couponCode)) setCouponCode('');
                    }}
                    className="bg-primary text-surface text-xs font-bold px-3 py-1.5 rounded-xs"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-secondary pt-3 border-t border-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-text-primary tabular-nums">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-error-sale">
                  <span>Reduction</span>
                  <span className="tabular-nums">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="text-emerald-700 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-border">
                <span>Total Amount Due</span>
                <span className="tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Order Action */}
            <button
              onClick={handleCompleteOrder}
              className="w-full bg-primary hover:bg-neutral-900 active:scale-[0.99] text-surface py-3.5 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg mt-2"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Place Order • ₹{cartTotal.toLocaleString('en-IN')}</span>
            </button>

            <p className="text-[10px] text-center text-text-muted">
              By confirming your order, you agree to Atelier Terms of Sale and Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
