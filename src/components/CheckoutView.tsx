import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod } from '../types';
import { bangladeshDivisions, divisionDistricts } from '../services/i18n';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ArrowLeft,
  Lock,
  Phone,
  MapPin,
  FileText,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    lang,
    t,
    formatAmount,
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    storeSettings,
    placeOrder,
    setActiveTab,
    showToast,
    currentUser,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka City');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery calculation
  const isFreeDelivery = cartSubtotal >= storeSettings.freeDeliveryThreshold;
  const isInsideDhaka = division.toLowerCase() === 'dhaka';
  const deliveryFee = isFreeDelivery
    ? 0
    : isInsideDhaka
    ? storeSettings.deliveryDhaka
    : storeSettings.deliveryOutside;

  const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);

  // When division changes, update district
  const handleDivisionChange = (divName: string) => {
    setDivision(divName);
    const divKey = divName.toLowerCase();
    const districts = divisionDistricts[divKey];
    if (districts && districts.length > 0) {
      setDistrict(districts[0].en);
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    showToast(lang === 'bn' ? 'নম্বর কপি করা হয়েছে!' : 'Number copied to clipboard!', 'success');
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast(lang === 'bn' ? 'আপনার কার্ট খালি।' : 'Your cart is empty.', 'error');
      setActiveTab('shop');
      return;
    }

    if (!customerName.trim()) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম দিন।' : 'Please enter your name.', 'error');
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      showToast(
        lang === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।'
          : 'Please enter a valid 11-digit mobile number.',
        'error'
      );
      return;
    }

    if (!fullAddress.trim()) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে ডেলিভারি ঠিকানা দিন।' : 'Please enter delivery address.', 'error');
      return;
    }

    if (paymentMethod !== 'cod' && !trxId.trim()) {
      showToast(
        lang === 'bn'
          ? `অনুগ্রহ করে ${paymentMethod.toUpperCase()} ট্রানজেকশন আইডি (TrxID) লিখুন।`
          : `Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID).`,
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        customerName,
        phone: cleanPhone,
        alternatePhone: alternatePhone.trim(),
        email: email.trim(),
        division,
        district,
        fullAddress,
        notes,
        deliveryArea: isInsideDhaka ? 'dhaka' : 'outside',
        paymentMethod,
        senderNumber: senderNumber.trim(),
        trxId: trxId.trim(),
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#064E3B', '#F59E0B', '#3B82F6'],
      });

      showToast(
        lang === 'bn' ? 'আপনার অর্ডার সফলভাবে তৈরি হয়েছে!' : 'Order created successfully!',
        'success'
      );
    } catch (err) {
      console.error('Order error:', err);
      showToast('Could not complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDistricts = divisionDistricts[division.toLowerCase()] || [];

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => setActiveTab('shop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.continueShopping}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Delivery & Payment Details */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            {/* Shipping Address Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">{t.billingDetails}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Primary Phone Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'bn' ? 'সচল মোবাইল নম্বর' : 'Active Mobile Number'} *</span>
                    </label>
                    {phone.trim().length === 11 && phone.startsWith('01') && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        ✓ {lang === 'bn' ? 'সঠিক নম্বর' : 'Valid'}
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400 flex items-center gap-1 pointer-events-none border-r border-slate-700/80 pr-2">
                      <span>🇧🇩</span>
                      <span>+88</span>
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-16 pr-3.5 py-2.5 text-xs font-semibold tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'bn'
                      ? 'ডেলিভারি রাইডার এই নম্বরে ফোন করে পার্সেল পৌঁছে দেবেন।'
                      : 'Delivery rider will call this number.'}
                  </p>
                </div>

                {/* Alternate Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {lang === 'bn' ? 'বিকল্প মোবাইল নম্বর (ঐচ্ছিক)' : 'Alternate Phone (Optional)'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400 flex items-center gap-1 pointer-events-none border-r border-slate-700/80 pr-2">
                      <span>🇧🇩</span>
                      <span>+88</span>
                    </span>
                    <input
                      type="tel"
                      maxLength={11}
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-16 pr-3.5 py-2.5 text-xs font-semibold tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === 'bn'
                      ? 'প্রধান নম্বর বন্ধ থাকলে বিকল্প নম্বরে যোগাযোগ করা হবে।'
                      : 'Secondary contact number for safe delivery.'}
                  </p>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.emailAddress}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Division & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.selectDivision} *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => handleDivisionChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {bangladeshDivisions.map((div) => (
                      <option key={div.id} value={div.name}>
                        {lang === 'bn' ? div.nameBn : div.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.selectDistrict} *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {currentDistricts.map((dst, i) => (
                      <option key={i} value={dst.en}>
                        {lang === 'bn' ? dst.bn : dst.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.deliveryAddress} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder={t.deliveryAddressPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.orderNotes}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.orderNotesPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Payment Method Selector Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">{t.paymentMethod}</h2>
              </div>

              {/* Gateways Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-400">COD</div>
                  <div className="text-[11px] font-medium leading-tight mt-1 text-slate-300">
                    {lang === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                  </div>
                </button>

                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#E2136E]/20 border-[#E2136E] text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-[#E2136E]">bKash</div>
                  <div className="text-[11px] font-medium leading-tight mt-1 text-slate-300">
                    {lang === 'bn' ? 'বিকাশ পেমেন্ট' : 'bKash Send/Pay'}
                  </div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#F7941D]/20 border-[#F7941D] text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-[#F7941D]">Nagad</div>
                  <div className="text-[11px] font-medium leading-tight mt-1 text-slate-300">
                    {lang === 'bn' ? 'নগদ পেমেন্ট' : 'Nagad Payment'}
                  </div>
                </button>

                {/* Rocket */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'rocket'
                      ? 'bg-[#8C3494]/20 border-[#8C3494] text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-black text-[#B840C2]">Rocket</div>
                  <div className="text-[11px] font-medium leading-tight mt-1 text-slate-300">
                    {lang === 'bn' ? 'রকেট পেমেন্ট' : 'Rocket Payment'}
                  </div>
                </button>
              </div>

              {/* Gateway Guide & Details Panel */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-semibold text-white">{t.codTitle}</p>
                  <p className="text-slate-400 leading-relaxed">{t.codDescription}</p>
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                    ✓ {lang === 'bn' ? '৬৪ জেলায় হোম ডেলিভারি ও রাইডারকে টাকা দেওয়ার সুবিধা।' : 'Safe delivery with parcel inspection in presence of courier.'}
                  </div>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-[#E2136E]/40 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#E2136E] text-sm">
                        bKash {storeSettings.bkashType} Account
                      </span>
                      <p className="text-white text-base font-mono font-bold mt-0.5">
                        {storeSettings.bkashNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(storeSettings.bkashNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E2136E] text-white font-bold text-xs hover:bg-[#c0105d] transition-colors"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? t.copied : t.copyNumber}</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-400 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <p>{t.step1.replace('{method}', 'bKash (*247#)')}</p>
                    <p>{t.step2}</p>
                    <p>{t.step3} <span className="text-white font-mono">{storeSettings.bkashNumber}</span></p>
                    <p>{t.step4.replace('{amount}', total.toLocaleString())}</p>
                    <p>{t.step5}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.senderNumberLabel.replace('{method}', 'bKash')}
                      </label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.trxIdLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={t.trxIdPlaceholder}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-[#F7941D]/40 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#F7941D] text-sm">Nagad Account</span>
                      <p className="text-white text-base font-mono font-bold mt-0.5">
                        {storeSettings.nagadNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(storeSettings.nagadNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7941D] text-white font-bold text-xs hover:bg-[#d97c11] transition-colors"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? t.copied : t.copyNumber}</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-400 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <p>{t.step1.replace('{method}', 'Nagad (*167#)')}</p>
                    <p>{t.step2}</p>
                    <p>{t.step3} <span className="text-white font-mono">{storeSettings.nagadNumber}</span></p>
                    <p>{t.step4.replace('{amount}', total.toLocaleString())}</p>
                    <p>{t.step5}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.senderNumberLabel.replace('{method}', 'Nagad')}
                      </label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.trxIdLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={t.trxIdPlaceholder}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'rocket' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-[#8C3494]/40 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#B840C2] text-sm">Rocket Account</span>
                      <p className="text-white text-base font-mono font-bold mt-0.5">
                        {storeSettings.rocketNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber(storeSettings.rocketNumber)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8C3494] text-white font-bold text-xs hover:bg-[#6c2872] transition-colors"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? t.copied : t.copyNumber}</span>
                    </button>
                  </div>

                  <div className="space-y-1 text-slate-400 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <p>{t.step1.replace('{method}', 'Rocket (*322#)')}</p>
                    <p>{t.step2}</p>
                    <p>{t.step3} <span className="text-white font-mono">{storeSettings.rocketNumber}</span></p>
                    <p>{t.step4.replace('{amount}', total.toLocaleString())}</p>
                    <p>{t.step5}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.senderNumberLabel.replace('{method}', 'Rocket')}
                      </label>
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.trxIdLabel} *
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder={t.trxIdPlaceholder}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white uppercase font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition-all active:scale-98 disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? lang === 'bn'
                      ? 'অর্ডার প্রসেস হচ্ছে...'
                      : 'Processing Order...'
                    : `${t.placeOrder} (${formatAmount(total)})`}
                </span>
              </button>
            </div>
          </form>

          {/* Right Summary Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">{t.orderSummary}</h3>
                <span className="text-xs text-slate-400">
                  {cart.length} {t.items}
                </span>
              </div>

              {/* Item thumbnails */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {lang === 'bn' ? item.product.nameBn : item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Qty: {item.quantity}{' '}
                        {item.selectedColor ? `· ${item.selectedColor}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 shrink-0">
                      {formatAmount(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Calculation */}
              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-slate-200">
                    {formatAmount(cartSubtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t.discount} ({appliedCoupon?.code})</span>
                    <span className="font-bold">-{formatAmount(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>
                    {t.deliveryFee} ({isInsideDhaka ? 'Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span className="font-semibold text-slate-200">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatAmount(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                  <span>{t.total}</span>
                  <span className="text-xl text-emerald-400 font-black">
                    {formatAmount(total)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'bn'
                    ? 'আপনার সমস্ত লেনদেন ও ব্যক্তিগত তথ্য নিরাপদ।'
                    : '100% Encrypted & Safe Checkout.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
