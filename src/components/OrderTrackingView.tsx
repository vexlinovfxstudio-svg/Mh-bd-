import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { toInternationalBdPhone } from '../services/whatsapp';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MessageCircle,
  MapPin,
  Calendar,
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { lang, t, formatAmount, trackOrderLookup, storeSettings } = useStore();

  const [searchQuery, setSearchQuery] = useState('MHBD-847291');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(() =>
    trackOrderLookup('MHBD-847291')
  );
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const result = trackOrderLookup(searchQuery.trim());
    setTrackedOrder(result);
    setHasSearched(true);
  };

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    { key: 'pending', labelEn: 'Order Placed', labelBn: 'অর্ডার গৃহীত' },
    { key: 'processing', labelEn: 'Packaging & QC', labelBn: 'প্যাকিং ও যাচাই' },
    { key: 'shipped', labelEn: 'Dispatched to Courier', labelBn: 'কুরিয়ারে হস্তান্তর' },
    { key: 'delivered', labelEn: 'Delivered', labelBn: 'ডেলিভারি সম্পন্ন' },
  ];

  const currentStepIndex = trackedOrder ? getStatusIndex(trackedOrder.status) : 0;

  return (
    <div className="py-10 sm:py-16 bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-1 border border-emerald-500/20">
            <Truck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.trackOrderTitle}</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            {t.trackOrderSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.trackInputPlaceholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-xl"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md"
            >
              {t.findOrder}
            </button>
          </div>
        </form>

        {/* Search Result */}
        {hasSearched && !trackedOrder && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-xs text-slate-300 leading-relaxed">{t.noOrderFound}</p>
          </div>
        )}

        {trackedOrder && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-8 animate-in fade-in">
            {/* Order Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {t.orderIdLabel}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-white">
                  {trackedOrder.id}
                </span>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Placed on {new Date(trackedOrder.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-left sm:text-right">
                <span
                  className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    trackedOrder.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : trackedOrder.status === 'shipped'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : trackedOrder.status === 'processing'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : trackedOrder.status === 'cancelled'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {trackedOrder.status === 'pending'
                    ? t.statusPending
                    : trackedOrder.status === 'processing'
                    ? t.statusProcessing
                    : trackedOrder.status === 'shipped'
                    ? t.statusShipped
                    : trackedOrder.status === 'delivered'
                    ? t.statusDelivered
                    : t.statusCancelled}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {trackedOrder.status !== 'cancelled' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.orderTimeline}
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step.key} className="space-y-2">
                        <div className="relative flex items-center justify-center">
                          {idx > 0 && (
                            <div
                              className={`absolute right-1/2 left-0 h-1 -top-1/2 translate-y-4 -z-0 ${
                                idx <= currentStepIndex ? 'bg-emerald-500' : 'bg-slate-800'
                              }`}
                            />
                          )}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                        </div>
                        <p
                          className={`text-[11px] font-semibold leading-tight ${
                            isCurrent ? 'text-emerald-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {lang === 'bn' ? step.labelBn : step.labelEn}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Courier Tracking Info (if dispatched) */}
            {trackedOrder.courierName && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">{t.courierPartner}</span>
                  <span className="font-bold text-white text-sm">{trackedOrder.courierName}</span>
                </div>
                {trackedOrder.courierTrackingCode && (
                  <div>
                    <span className="text-slate-400 block">{t.consignmentNumber}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {trackedOrder.courierTrackingCode}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Timeline Events Log */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'bn' ? 'স্ট্যাটাস আপডেট হিস্ট্রি' : 'Live Status Log'}
              </h4>
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40 text-xs">
                {trackedOrder.statusTimeline.map((ev, i) => (
                  <div key={i} className="p-3.5 flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-200">{ev.note}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(ev.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items and Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 space-y-2">
                <span className="font-bold text-white block">
                  {lang === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}
                </span>
                <p className="text-slate-300 font-medium">{trackedOrder.customerName}</p>
                <p className="text-slate-400">{trackedOrder.phone}</p>
                <p className="text-slate-400">
                  {trackedOrder.fullAddress}, {trackedOrder.district}, {trackedOrder.division}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 space-y-2">
                <span className="font-bold text-white block">
                  {lang === 'bn' ? 'পেমেন্ট ও মূল্য' : 'Payment & Summary'}
                </span>
                <div className="flex justify-between text-slate-400">
                  <span>Method:</span>
                  <span className="font-semibold text-white uppercase">
                    {trackedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Amount:</span>
                  <span className="font-bold text-emerald-400">
                    {formatAmount(trackedOrder.total)}
                  </span>
                </div>
                {trackedOrder.paymentDetails.trxId && (
                  <div className="flex justify-between text-slate-400">
                    <span>TrxID:</span>
                    <span className="font-mono text-slate-300">
                      {trackedOrder.paymentDetails.trxId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inquire on WhatsApp Support */}
            <div className="pt-2 flex justify-end">
              <a
                href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}?text=${encodeURIComponent(
                  `Hello MHBDMART, I want an update on my order ID ${trackedOrder.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে সাপোর্ট নিন' : 'Inquire on WhatsApp'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
