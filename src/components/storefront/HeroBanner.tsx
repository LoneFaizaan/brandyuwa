import React from 'react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setStorefrontPage } = useStore();

  return (
    <section className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 items-stretch bg-surface-container-low">
        {/* Left Editorial Text */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">
                Direct Mill Sourcing • Autumn/Winter 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-text-primary uppercase tracking-tight leading-tight">
              Architectural Menswear Essentials
            </h1>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed max-w-lg">
              Precision-tailored Japanese twill overshirts, heavyweight combed jersey, and shuttle-loom selvedge denim designed with utilitarian discipline.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 flex items-center space-x-3">
            <button
              onClick={() => {
                setSelectedCategory('All Items');
                setStorefrontPage('shop');
              }}
              className="inline-flex items-center space-x-2 bg-primary text-surface text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded-full hover:bg-neutral-800 active:scale-95 transition"
            >
              <span>Shop Collection</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                setSelectedCategory('Overshirts');
                setStorefrontPage('shop');
              }}
              className="inline-flex items-center space-x-2 bg-surface border border-border text-text-primary text-xs font-semibold tracking-wider uppercase px-4 py-3 rounded-full hover:bg-surface-container transition"
            >
              <span>Explore Overshirts</span>
            </button>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="md:col-span-5 relative bg-surface-container overflow-hidden border-t md:border-t-0 md:border-l border-border min-h-[260px] md:min-h-[380px]">
          <img
            src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80"
            alt="Refined menswear model wearing structured overcoat"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-sm border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-primary rounded-xs">
            Edition 04 • In Stock
          </div>
        </div>
      </div>
    </section>
  );
};
