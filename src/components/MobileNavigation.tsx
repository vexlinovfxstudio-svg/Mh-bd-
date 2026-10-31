import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Grid, ShoppingCart, Truck, User } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { lang, t, activeTab, setActiveTab, cartCount, setCartDrawerOpen } = useStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 pb-safe shadow-2xl">
      <div className="grid grid-cols-5 h-14">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{t.home}</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'shop' || activeTab === 'flash'
              ? 'text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{t.shop}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">{t.cart}</span>
        </button>

        {/* Track Order */}
        <button
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'track' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{t.trackOrder}</span>
        </button>

        {/* Account / Admin */}
        <button
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'account' || activeTab === 'admin'
              ? 'text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-semibold">{t.account}</span>
        </button>
      </div>
    </nav>
  );
};
