import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setStorefrontPage, showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Thank you for joining the Atelier Gazette', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-surface border-t border-border mt-16 text-text-primary">
      {/* Trust & Guarantee Bar */}
      <div className="border-b border-border py-8 px-4 bg-surface-container-low">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-2xl text-primary">local_shipping</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Free Express Delivery</h4>
              <p className="text-[11px] text-secondary">Complimentary on all orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-2xl text-primary">swap_horiz</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">14-Day Return Window</h4>
              <p className="text-[11px] text-secondary">Simple doorstep pickup & full refunds</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-2xl text-primary">verified</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Tactile Honesty</h4>
              <p className="text-[11px] text-secondary">Heavyweight Japanese twills & Giza cottons</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="material-symbols-outlined text-2xl text-primary">shield</span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Encrypted Commerce</h4>
              <p className="text-[11px] text-secondary">UPI, Cards, and Net Banking protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand statement */}
        <div className="md:col-span-4 space-y-3">
          <span className="font-bold text-base tracking-widest uppercase">ATELIER RETAIL</span>
          <p className="text-xs text-secondary leading-relaxed">
            Disciplined modern menswear grounded in structured minimalism, Swiss modernism, and tactile material integrity. Every garment is cut for architectural proportion and everyday durability.
          </p>
          <p className="text-[11px] text-text-muted">
            Designed in Bengaluru & Tokyo. Manufactured with certified ethical mill partners.
          </p>
        </div>

        {/* Categories */}
        <div className="md:col-span-2 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Collections</h4>
          <ul className="space-y-1.5 text-xs text-secondary">
            {['Overshirts', 'Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets'].map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => {
                    setSelectedCategory(cat);
                    setStorefrontPage('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-text-primary transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Client Care */}
        <div className="md:col-span-2 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Client Care</h4>
          <ul className="space-y-1.5 text-xs text-secondary">
            <li>
              <button 
                onClick={() => {
                  setStorefrontPage('order-tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-text-primary transition-colors"
              >
                Track Your Order
              </button>
            </li>
            <li><span className="text-secondary/70">Shipping & Delivery</span></li>
            <li><span className="text-secondary/70">Returns & Exchanges</span></li>
            <li><span className="text-secondary/70">Size Guide & Fit Matrix</span></li>
            <li><span className="text-secondary/70">Contact Concierge</span></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">The Atelier Gazette</h4>
          <p className="text-xs text-secondary">
            Receive private release notices for limited seasonal fabric drops and archival restocks. No marketing spam.
          </p>
          <form onSubmit={handleSubscribe} className="flex space-x-2">
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-surface-container-lowest border border-border px-3 py-2 text-xs focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              className="bg-primary text-surface px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-neutral-800 transition"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-border py-6 px-4 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-text-muted space-y-2 sm:space-y-0">
          <p>© 2026 Atelier Architectural Menswear Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Made with Stitch Design System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
