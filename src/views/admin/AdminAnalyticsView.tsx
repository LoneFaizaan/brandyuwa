import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminAnalyticsView: React.FC = () => {
  const { todayRevenue, todayOrdersCount } = useStore();
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d'>('7d');

  // Realistic analytics values
  const multiplier = dateRange === 'today' ? 1 : dateRange === '7d' ? 6.5 : 24.2;
  const grossRevenue = Math.round(todayRevenue * multiplier);
  const netRevenue = Math.round(grossRevenue * 0.88);
  const taxCollected = Math.round(grossRevenue * 0.12);
  const totalOrders = Math.round(todayOrdersCount * multiplier);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">
            Commerce Intelligence & Analytics
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Operational visibility into sales trajectories, category velocity, and conversion funnels
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center space-x-1 bg-surface-container-low border border-border p-1 rounded-full text-xs">
          <button
            onClick={() => setDateRange('today')}
            className={`px-3 py-1 rounded-full font-medium transition ${dateRange === 'today' ? 'bg-primary text-surface font-bold' : 'text-text-muted hover:text-text-primary'}`}
          >
            Today
          </button>
          <button
            onClick={() => setDateRange('7d')}
            className={`px-3 py-1 rounded-full font-medium transition ${dateRange === '7d' ? 'bg-primary text-surface font-bold' : 'text-text-muted hover:text-text-primary'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1 rounded-full font-medium transition ${dateRange === '30d' ? 'bg-primary text-surface font-bold' : 'text-text-muted hover:text-text-primary'}`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Top Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Gross Revenue</span>
          <p className="text-2xl font-bold text-text-primary tabular-nums mt-1">₹{grossRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">+14.2% vs previous period</span>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Net Realization</span>
          <p className="text-2xl font-bold text-text-primary tabular-nums mt-1">₹{netRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-text-muted font-medium">Excluding returns & discounts</span>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Completed Orders</span>
          <p className="text-2xl font-bold text-text-primary tabular-nums mt-1">{totalOrders} orders</p>
          <span className="text-[10px] text-emerald-700 font-semibold">98.2% fulfillment rate</span>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Integrated Tax (12%)</span>
          <p className="text-2xl font-bold text-text-primary tabular-nums mt-1">₹{taxCollected.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-text-muted font-medium">GST compliant remittance</span>
        </div>
      </div>

      {/* Revenue Trend Visualizer */}
      <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Revenue Daily Rhythm (Last 7 Days)
          </h3>
          <span className="text-[10px] font-mono text-text-muted">Target: ₹50,000/day</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
          {[
            { day: 'Mon', amount: 38200, height: '62%' },
            { day: 'Tue', amount: 41500, height: '68%' },
            { day: 'Wed', amount: 49000, height: '80%' },
            { day: 'Thu', amount: 44200, height: '72%' },
            { day: 'Fri', amount: 56800, height: '94%' },
            { day: 'Sat', amount: 62400, height: '100%' },
            { day: 'Sun', amount: 48900, height: '79%' }
          ].map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition tabular-nums text-text-muted">
                ₹{(item.amount / 1000).toFixed(1)}k
              </span>
              <div 
                className="w-full bg-primary group-hover:bg-neutral-800 rounded-t-xs transition-all duration-300"
                style={{ height: item.height }}
              />
              <span className="text-[11px] font-bold uppercase text-text-primary">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance & Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Share */}
        <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-2.5">
            Category Sales Distribution
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { cat: 'Utility Overshirts', pct: 36, rev: '₹1,02,400' },
              { cat: 'Oxford & Linen Shirts', pct: 28, rev: '₹79,600' },
              { cat: 'Selvedge Raw Denim', pct: 18, rev: '₹51,200' },
              { cat: 'Bomber & Outerwear', pct: 12, rev: '₹34,100' },
              { cat: 'Pleated Trousers', pct: 6, rev: '₹17,200' }
            ].map((c) => (
              <div key={c.cat} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-text-primary">{c.cat}</span>
                  <span className="font-mono text-text-muted">{c.rev} ({c.pct}%)</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-2.5">
            Payment Method Split
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { method: 'UPI (GPay / PhonePe / QR)', share: 68, color: 'bg-emerald-600' },
              { method: 'Cards (Visa / Mastercard / RuPay)', share: 22, color: 'bg-blue-600' },
              { method: 'Cash on Delivery (COD)', share: 10, color: 'bg-amber-600' }
            ].map((m) => (
              <div key={m.method} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-semibold text-text-primary">{m.method}</span>
                  <span className="font-mono font-bold text-text-primary">{m.share}%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.share}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 text-[11px] text-text-muted leading-relaxed">
            Note: 90% of revenue is digitally pre-paid with zero return-to-origin (RTO) friction.
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-2.5">
          E-Commerce Conversion Funnel
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-surface-container-low p-3 rounded-xs border border-border">
            <span className="text-[10px] uppercase font-bold text-text-muted block">1. Unique Visitors</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">4,820</p>
            <span className="text-[10px] text-text-muted">100% Top of Funnel</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xs border border-border">
            <span className="text-[10px] uppercase font-bold text-text-muted block">2. Product Views</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">2,890</p>
            <span className="text-[10px] text-text-muted">60.0% Engagement</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xs border border-border">
            <span className="text-[10px] uppercase font-bold text-text-muted block">3. Added to Bag</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">690</p>
            <span className="text-[10px] text-text-muted">23.8% Intent</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xs border border-border">
            <span className="text-[10px] uppercase font-bold text-text-muted block">4. Checkout Started</span>
            <p className="text-lg font-bold text-text-primary mt-1 font-mono">340</p>
            <span className="text-[10px] text-text-muted">49.2% Cart Conversion</span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xs border border-emerald-300">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">5. Purchased</span>
            <p className="text-lg font-bold text-emerald-900 mt-1 font-mono">114</p>
            <span className="text-[10px] text-emerald-800 font-bold">2.36% Overall Conversion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
