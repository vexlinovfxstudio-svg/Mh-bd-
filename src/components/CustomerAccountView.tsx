import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { toInternationalBdPhone } from '../services/whatsapp';
import {
  User as UserIcon,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Truck,
  ArrowRight,
  Shield,
  MessageCircle,
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    lang,
    t,
    formatAmount,
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    setActiveTab,
    setSelectedProduct,
    storeSettings,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    loginUser(identifier.trim());
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    registerUser(regName.trim(), regPhone.trim(), regEmail.trim());
  };

  // If not logged in, show Auth Gate
  if (!currentUser) {
    return (
      <div className="py-12 sm:py-20 bg-slate-950 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {authMode === 'login' ? t.signInTitle : t.signUpTitle}
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {authMode === 'login' ? t.signInSub : t.signUpSub}
            </p>
          </div>

          {/* Form */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.emailOrPhone} *
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="017XXXXXXXX or you@email.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.password} *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
              >
                {t.login}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Shakil Chowdhury"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.phoneNumber} *
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  {t.password} *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
              >
                {t.register}
              </button>
            </form>
          )}

          {/* Toggle login / register */}
          <div className="pt-3 border-t border-slate-800 text-center text-xs">
            {authMode === 'login' ? (
              <p className="text-slate-400">
                {t.dontHaveAccount}{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-emerald-400 font-bold hover:underline ml-1"
                >
                  {t.register}
                </button>
              </p>
            ) : (
              <p className="text-slate-400">
                {t.alreadyHaveAccount}{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-emerald-400 font-bold hover:underline ml-1"
                >
                  {t.login}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter orders matching logged in phone
  const userOrders = orders.filter(
    (o) =>
      o.phone.replace(/[^0-9]/g, '') === currentUser.phone.replace(/[^0-9]/g, '') ||
      (currentUser.email && o.email?.toLowerCase() === currentUser.email.toLowerCase())
  );

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* User Profile Header */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/20">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.phone}</p>
              {currentUser.email && (
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              )}
            </div>
          </div>

          <button
            onClick={logoutUser}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'orders'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {t.myOrders} ({userOrders.length})
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'wishlist'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>
              {t.myWishlist} ({wishlist.length})
            </span>
          </button>
        </div>

        {/* Orders Tab */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <ShoppingBag className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">{t.noOrdersYet}</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  {t.shopNow}
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Order #{ord.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : ord.status === 'shipped'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : ord.status === 'processing'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="divide-y divide-slate-800/80">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                          />
                          <div>
                            <p className="font-semibold text-slate-200">
                              {lang === 'bn' ? it.nameBn : it.name}
                            </p>
                            <p className="text-[11px] text-slate-500">Qty: {it.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400">
                          {formatAmount(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total and Action buttons */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Total: </span>
                      <span className="font-bold text-white text-sm">
                        {formatAmount(ord.total)}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-2">({ord.paymentMethod})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('track')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        <Truck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Track</span>
                      </button>

                      <a
                        href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}?text=${encodeURIComponent(
                          `Hello MHBDMART, I want to inquire about my order #${ord.id}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Support</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeSubTab === 'wishlist' && (
          <div className="space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <Heart className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">{t.noWishlistYet}</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  {t.shopNow}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3.5"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      onClick={() => setSelectedProduct(p)}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-950 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() => setSelectedProduct(p)}
                        className="text-xs font-bold text-slate-200 truncate cursor-pointer hover:text-emerald-400"
                      >
                        {lang === 'bn' ? p.nameBn : p.name}
                      </h4>
                      <p className="text-xs font-black text-emerald-400 mt-0.5">
                        {formatAmount(p.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                        >
                          {t.addToCart}
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="text-slate-500 hover:text-rose-400 text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
