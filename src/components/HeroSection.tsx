import React from 'react';
import { useStore } from '../context/StoreContext';
import { toInternationalBdPhone } from '../services/whatsapp';
import { ShieldCheck, Truck, CreditCard, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { lang, t, setActiveTab, setSelectedCategory, storeSettings } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-10 sm:py-16 border-b border-slate-800">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'bn'
                  ? 'বাংলাদেশের ১ নম্বর বিশ্বস্ত প্রিমিয়াম অনলাইন স্টোর'
                  : "Bangladesh's Trusted Premium Online Store"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {lang === 'bn' ? (
                storeSettings.heroTitleBn || (
                  <>
                    প্রিমিয়াম গ্যাজেট ও লাইফস্টাইল{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                      সেরা অফারে
                    </span>
                  </>
                )
              ) : (
                storeSettings.heroTitleEn || (
                  <>
                    Curated Premium Tech &{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
                      Modern Lifestyle
                    </span>
                  </>
                )
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {lang === 'bn' ? (storeSettings.heroSubtitleBn || t.heroSubtitle) : (storeSettings.heroSubtitleEn || t.heroSubtitle)}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('shop')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
              >
                <span>{t.shopNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('flash')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/60 text-slate-200 hover:text-amber-300 font-semibold text-sm transition-all shadow-sm"
              >
                <span>⚡ {t.viewDeals}</span>
              </button>

              <a
                href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}?text=${encodeURIComponent(
                  'Hello MHBDMART, I want to make an order inquiry.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-900/60 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'WhatsApp Order'}</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{lang === 'bn' ? '৬৪ জেলায় ক্যাশ অন ডেলিভারি' : 'COD in 64 Districts'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{lang === 'bn' ? 'সরাসরি ব্র‍্যান্ড রিপ্লেসমেন্ট' : 'Direct Warranty'}</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Feature Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  HOT DEAL -24%
                </div>
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                  alt="AeroSound Pro Headphones"
                  className="w-full h-56 sm:h-64 object-cover rounded-xl bg-slate-950 mb-4 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'bn'
                        ? 'অ্যারোসাউন্ড প্রো হাইব্রিড নয়েজ ক্যানসেলিং হেডফোন'
                        : 'AeroSound Pro ANC Studio Headphones'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'bn' ? '৫৫ ঘণ্টা ব্যাকআপ · -৪২ডিবি এএনসি' : '55h Playtime · -42dB Hybrid ANC'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-emerald-400">৳4,950</p>
                    <p className="text-xs text-slate-500 line-through">৳6,500</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-emerald-400 font-medium">
                    ✓ {lang === 'bn' ? 'স্টকে আছে' : 'Ready in Stock'}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory('Electronics & Audio');
                      setActiveTab('shop');
                    }}
                    className="text-slate-300 hover:text-white font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>{lang === 'bn' ? 'কালেকশন দেখুন' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Floating Mini Spec Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 rounded-xl border border-slate-700 bg-slate-950/95 p-3.5 shadow-xl items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {lang === 'bn' ? '২৪-৭২ ঘণ্টায় ডেলিভারি' : '24-72h Fast Express'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'ঢাকা ৬০৳ · ঢাকার বাইরে ১২০৳' : 'Dhaka ৳60 · Outside ৳120'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-10 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.genuineGuarantee}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.genuineSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.expressDelivery}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.expressSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.easyPayment}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.easyPaymentSub}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{t.customerCare}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{t.customerCareSub}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
