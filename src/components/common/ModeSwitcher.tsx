import React from 'react';
import { useStore } from '../../context/StoreContext';

export const ModeSwitcher: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    frameMode, 
    setFrameMode, 
    cartCount, 
    pendingDispatchCount,
    setStorefrontPage,
    setAdminPage 
  } = useStore();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center bg-[#0A0A0A] text-white p-1.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-md">
      {/* View Mode Toggle */}
      <div className="flex items-center bg-white/10 rounded-full p-0.5">
        <button
          onClick={() => {
            setViewMode('storefront');
            setStorefrontPage('home');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            viewMode === 'storefront'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">storefront</span>
          <span>Storefront</span>
          {cartCount > 0 && (
            <span className="bg-[#C53030] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setViewMode('admin');
            setAdminPage('dashboard');
          }}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            viewMode === 'admin'
              ? 'bg-white text-black shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">dashboard</span>
          <span>Admin Console</span>
          {pendingDispatchCount > 0 && (
            <span className="bg-[#B7791F] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
              {pendingDispatchCount}
            </span>
          )}
        </button>
      </div>

      {/* Frame / Viewport simulator */}
      <div className="h-4 w-[1px] bg-white/20 mx-2" />

      <button
        onClick={() => setFrameMode(frameMode === 'mobile' ? 'full' : 'mobile')}
        className="flex items-center space-x-1 text-white/80 hover:text-white px-2.5 py-1 text-xs font-medium rounded-full hover:bg-white/10 transition"
        title={frameMode === 'mobile' ? 'Switch to Full Desktop View' : 'Switch to Mobile Viewport Simulator'}
      >
        <span className="material-symbols-outlined text-[16px]">
          {frameMode === 'mobile' ? 'smartphone' : 'desktop_windows'}
        </span>
        <span className="hidden sm:inline">
          {frameMode === 'mobile' ? 'Mobile Frame' : 'Full Width'}
        </span>
      </button>
    </div>
  );
};
