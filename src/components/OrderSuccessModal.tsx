import React from 'react';
import { useStore } from '../context/StoreContext';
import { getWhatsAppOrderUrl } from '../services/whatsapp';
import {
  CheckCircle2,
  MessageCircle,
  Truck,
  Printer,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const {
    lang,
    t,
    formatAmount,
    lastPlacedOrder,
    setLastPlacedOrder,
    setActiveTab,
    storeSettings,
    showToast,
  } = useStore();

  const [copiedId, setCopiedId] = React.useState(false);

  if (!lastPlacedOrder) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(lastPlacedOrder.id);
    setCopiedId(true);
    showToast(lang === 'bn' ? 'অর্ডার আইডি কপি হয়েছে!' : 'Order ID copied!', 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleTrackClick = () => {
    const id = lastPlacedOrder.id;
    setLastPlacedOrder(null);
    setActiveTab('track');
  };

  const handlePrint = () => {
    window.print();
  };

  const waUrl = getWhatsAppOrderUrl(lastPlacedOrder, storeSettings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6">
        {/* Celebration Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">{t.orderSuccessTitle}</h2>
          <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
            {t.orderSuccessSub}
          </p>
        </div>

        {/* Order ID & Tracking Bar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              {t.orderIdLabel}
            </span>
            <span className="text-base font-mono font-black text-emerald-400">
              {lastPlacedOrder.id}
            </span>
          </div>
          <button
            onClick={handleCopyId}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId ? t.copied : t.copyNumber}</span>
          </button>
        </div>

        {/* Order Highlights Box */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>{t.customer}:</span>
            <span className="font-semibold text-slate-200">{lastPlacedOrder.customerName}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{t.phoneNumber}:</span>
            <span className="font-semibold text-slate-200">
              {lastPlacedOrder.phone}
              {lastPlacedOrder.alternatePhone ? ` (বিকল্প: ${lastPlacedOrder.alternatePhone})` : ''}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Address'}:</span>
            <span className="font-semibold text-slate-200 text-right max-w-[240px] truncate">
              {lastPlacedOrder.fullAddress}, {lastPlacedOrder.district}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>{lang === 'bn' ? 'পেমেন্ট মেথড' : 'Payment'}:</span>
            <span className="font-semibold text-emerald-400 uppercase">
              {lastPlacedOrder.paymentMethod}
              {lastPlacedOrder.paymentDetails.trxId ? ` (Trx: ${lastPlacedOrder.paymentDetails.trxId})` : ''}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
            <span>{t.total}:</span>
            <span className="text-base text-emerald-400 font-black">
              {formatAmount(lastPlacedOrder.total)}
            </span>
          </div>
        </div>

        {/* WhatsApp Notification Action (Key Requirement) */}
        <div className="space-y-2.5">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95 text-center"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{t.sendOrderWhatsApp}</span>
          </a>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleTrackClick}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{t.trackYourOrder}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>{t.printInvoice}</span>
            </button>
          </div>
        </div>

        {/* Close / Continue Shopping */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              setLastPlacedOrder(null);
              setActiveTab('home');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.continueShopping}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
