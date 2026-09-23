import React from 'react';
import { useStore } from '../../context/StoreContext';
import { HeroBanner } from '../../components/storefront/HeroBanner';
import { ProductCard } from '../../components/storefront/ProductCard';

export const HomeView: React.FC = () => {
  const { products, setSelectedCategory, setStorefrontPage } = useStore();

  const newArrivals = products.filter(p => p.isNew || p.status === 'Published').slice(0, 4);
  const bestSellers = products.filter(p => p.isBestseller).slice(0, 4);

  return (
    <div className="space-y-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. New Season Arrivals */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between border-b border-border pb-3 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Seasonal Releases
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-text-primary mt-0.5">
              New Season Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setStorefrontPage('shop');
            }}
            className="text-xs font-bold uppercase tracking-wider text-text-primary hover:text-secondary flex items-center space-x-1"
          >
            <span>View All ({products.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Category Lookbook Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="border-b border-border pb-3 mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Curated Form Factors
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-text-primary mt-0.5">
            Shop By Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overshirts Card */}
          <div 
            onClick={() => {
              setSelectedCategory('Overshirts');
              setStorefrontPage('shop');
            }}
            className="relative group h-80 bg-surface-container overflow-hidden rounded-xs cursor-pointer border border-border"
          >
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
              alt="Overshirts"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Outer Layer</span>
              <h3 className="text-xl font-bold uppercase tracking-tight mt-1">Utility Overshirts</h3>
              <p className="text-xs text-white/80 mt-1">380 GSM Ring-spun cotton twill</p>
            </div>
          </div>

          {/* Shirts Card */}
          <div 
            onClick={() => {
              setSelectedCategory('Shirts');
              setStorefrontPage('shop');
            }}
            className="relative group h-80 bg-surface-container overflow-hidden rounded-xs cursor-pointer border border-border"
          >
            <img
              src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80"
              alt="Oxford Shirts"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Tailored Base</span>
              <h3 className="text-xl font-bold uppercase tracking-tight mt-1">Pinpoint Oxford Shirts</h3>
              <p className="text-xs text-white/80 mt-1">Giza 80s 2-ply woven cotton</p>
            </div>
          </div>

          {/* Denim & Trousers Card */}
          <div 
            onClick={() => {
              setSelectedCategory('Jeans');
              setStorefrontPage('shop');
            }}
            className="relative group h-80 bg-surface-container overflow-hidden rounded-xs cursor-pointer border border-border"
          >
            <img
              src="https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80"
              alt="Selvedge Denim"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Bottom Silhouette</span>
              <h3 className="text-xl font-bold uppercase tracking-tight mt-1">Shuttle-Loom Selvedge</h3>
              <p className="text-xs text-white/80 mt-1">13.5 oz Red-line vintage weave</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial Philosophy Quote Callout */}
      <section className="bg-primary text-surface py-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
            The Atelier Standard
          </span>
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight leading-snug">
            "We reject ephemeral fashion trends and decorative visual gimmicks. Every Atelier garment is an architectural unit constructed from genuine natural fibres, reinforced stress points, and disciplined modern proportions."
          </h3>
          <p className="text-xs text-neutral-400">Atelier Menswear Design System • Edition 2026</p>
        </div>
      </section>

      {/* 5. Best Sellers Collection */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between border-b border-border pb-3 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Most Selected
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-text-primary mt-0.5">
              Best Selling Essentials
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setStorefrontPage('shop');
            }}
            className="text-xs font-bold uppercase tracking-wider text-text-primary hover:text-secondary flex items-center space-x-1"
          >
            <span>Explore All</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
