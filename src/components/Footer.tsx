import React from 'react';
import { useStore } from '../context/StoreContext';
import { toInternationalBdPhone } from '../services/whatsapp';
import { ShieldCheck, Truck, MessageCircle, Phone, MapPin, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t, setActiveTab, storeSettings } = useStore();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs pb-20 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-500/20">
                MH
              </div>
              <span className="text-xl font-black text-white">
                MHBD<span className="text-emerald-400">MART</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {lang === 'bn'
                ? 'বাংলাদেশের নির্ভরযোগ্য ও প্রিমিয়াম গ্যাজেট, লাইফস্টাইল ও ইলেকট্রনিক্স শপ। আসল পণ্যের নিশ্চয়তা ও দ্রুততম হোম ডেলিভারি।'
                : "Bangladesh's premier online destination for authentic gadgets, smart electronics, and luxury lifestyle accessories. Guaranteed authenticity and nationwide express delivery."}
            </p>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline: {storeSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {storeSettings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gulshan-2 & Dhanmondi, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'প্রয়োজনীয় লিংক' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.shop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('flash')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.flashDeals}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('track')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.trackOrder}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'গ্রাহক সেবা' : 'Customer Care'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('account')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.profile}
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  WhatsApp Direct Support
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.admin}
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {lang === 'bn' ? 'পেমেন্ট পার্টনার' : 'Accepted Payments'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center text-[11px] font-bold">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#E2136E]">
                bKash
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#F7941D]">
                Nagad
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#B840C2]">
                Rocket
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                Cash on Del.
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Courier Delivery via Steadfast, Pathao & Paperfly across 64 districts.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} MHBDMART. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with precision for Bangladesh</span>
            <span className="text-emerald-400">🇧🇩</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
