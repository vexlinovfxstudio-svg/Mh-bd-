import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { lang, t, products, setActiveTab } = useStore();

  // 12-hour recurring countdown simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 11, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.flashSale);

  if (flashProducts.length === 0) return null;

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Flash Sale Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>{t.flashSaleTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.flashSaleSub}</p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-slate-900 border border-amber-500/30 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>{t.endsIn}:</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black text-white">
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 min-w-[32px] text-center">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-amber-400">:</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 min-w-[32px] text-center">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-amber-400">:</span>
              <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 min-w-[32px] text-center text-amber-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {flashProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab('shop')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
