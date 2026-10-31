import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { toInternationalBdPhone } from '../services/whatsapp';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { lang, storeSettings } = useStore();
  const [openPopover, setOpenPopover] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanNumber = toInternationalBdPhone(storeSettings.whatsappNumber);

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const text = customMsg.trim() || 'Hello MHBDMART, I want to inquire about a product.';
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setOpenPopover(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40">
      {/* Popover Bubble */}
      {openPopover && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">{storeSettings.storeName} Support</p>
                <p className="text-[10px] text-emerald-400">● Typically replies in 5 minutes</p>
              </div>
            </div>
            <button
              onClick={() => setOpenPopover(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-slate-300 space-y-1.5">
            <p className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] leading-relaxed">
              {lang === 'bn'
                ? 'স্বাগতম! কোনো প্রশ্ন বা অর্ডারের সহায়তার জন্য আমাদের হোয়াটসঅ্যাপে মেসেজ দিন।'
                : 'Welcome! Need assistance with placing an order or tracking? Message us anytime on WhatsApp.'}
            </p>
          </div>

          <form onSubmit={handleSendCustom} className="flex gap-2">
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={lang === 'bn' ? 'মেসেজ লিখুন...' : 'Type your message...'}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 shadow-md"
              aria-label="Send WhatsApp"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpenPopover(!openPopover)}
        className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group font-bold text-xs"
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-semibold">
          {lang === 'bn' ? 'হোয়াটসঅ্যাপে চ্যাট' : 'WhatsApp Chat'}
        </span>
      </button>
    </div>
  );
};
