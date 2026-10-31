import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { toInternationalBdPhone } from '../services/whatsapp';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Shield,
  MessageCircle,
  Truck,
  Globe,
  X,
  Menu,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    formatAmount,
    activeTab,
    setActiveTab,
    cartCount,
    cartSubtotal,
    setCartDrawerOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    setSelectedCategory,
    currentUser,
    isAdmin,
    storeSettings,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Autocomplete search suggestions
  const suggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameBn.includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (prod: any) => {
    setSelectedProduct(prod);
    setSearchFocused(false);
    setSearchQuery('');
    setMobileSearchOpen(false);
  };

  const categories = [
    { en: 'All Categories', bn: 'সকল ক্যাটাগরি', val: 'All' },
    { en: 'Electronics & Audio', bn: 'ইলেকট্রনিক্স ও অডিও', val: 'Electronics & Audio' },
    { en: 'Smart Watches', bn: 'স্মার্ট ওয়াচ', val: 'Smart Watches' },
    { en: 'Fashion & Luxury', bn: 'ফ্যাশন ও লাইফস্টাইল', val: 'Fashion & Luxury' },
    { en: 'Smart Home & Security', bn: 'স্মার্ট হোম ও সিকিউরিটি', val: 'Smart Home & Security' },
    { en: 'Home & Kitchen', bn: 'হোম ও কিচেন', val: 'Home & Kitchen' },
    { en: 'Health & Grooming', bn: 'স্বাস্থ্য ও রূপচর্চা', val: 'Health & Grooming' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-900/80 via-teal-900/80 to-slate-900 px-4 py-1.5 text-xs text-emerald-200 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              ★
            </span>
            <span className="truncate">
              {lang === 'bn' ? storeSettings.announcementBn : storeSettings.announcementEn}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs shrink-0 text-slate-300">
            <a
              href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {storeSettings.whatsappNumber}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setActiveTab('track')}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t.trackOrder}</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition-colors"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className="text-left flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                MH
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  MHBD<span className="text-emerald-400">MART</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5 hidden sm:block">
                  {lang === 'bn' ? 'বিশ্বস্ত প্রিমিয়াম অনলাইন শপ' : 'Premium BD Marketplace'}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar with Autocomplete */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-xl mx-4 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                onFocus={() => setSearchFocused(true)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-2 border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'পরামর্শ' : 'Suggested Products'}
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-slate-800/70 transition-colors group"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                        {lang === 'bn' ? item.nameBn : item.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{item.category}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-400 shrink-0">
                      {formatAmount(item.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 md:hidden"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="sm:hidden px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold"
            >
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>

            {/* Track Order Icon Button */}
            <button
              onClick={() => setActiveTab('track')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'track'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>{t.trackOrder}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveTab('account')}
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Wishlist"
              title={t.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account / Admin Button */}
            <button
              onClick={() => setActiveTab(isAdmin ? 'admin' : 'account')}
              className={`flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium transition-colors ${
                activeTab === 'account' || activeTab === 'admin'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isAdmin ? t.admin : currentUser ? currentUser.name : t.account}
            >
              {isAdmin ? (
                <Shield className="w-5 h-5 text-emerald-400" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="hidden lg:inline-block max-w-[100px] truncate">
                {isAdmin
                  ? 'Admin'
                  : currentUser
                  ? currentUser.name.split(' ')[0]
                  : t.account}
              </span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {formatAmount(cartSubtotal)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {mobileSearchOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800 md:hidden animate-in fade-in">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                autoFocus
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile search suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800 overflow-hidden">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full flex items-center gap-3 p-2.5 text-left active:bg-slate-800"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {lang === 'bn' ? item.nameBn : item.name}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold">
                        {formatAmount(item.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Categories Strip */}
        <div className="hidden md:flex items-center justify-between gap-6 mt-3 pt-2.5 border-t border-slate-900 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.val}
                onClick={() => {
                  setSelectedCategory(cat.val);
                  if (activeTab !== 'home' && activeTab !== 'shop') setActiveTab('shop');
                }}
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 font-medium whitespace-nowrap transition-colors"
              >
                {lang === 'bn' ? cat.bn : cat.en}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('flash')}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.flashDeals}</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t.admin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              {t.home}
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              {t.shop}
            </button>
            <button
              onClick={() => {
                setActiveTab('flash');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-left text-xs font-semibold text-amber-300 hover:bg-amber-900/50"
            >
              ⚡ {t.flashDeals}
            </button>
            <button
              onClick={() => {
                setActiveTab('track');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800"
            >
              🚚 {t.trackOrder}
            </button>
          </div>

          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {t.categories}
          </p>
          <div className="space-y-1">
            {categories.map((c) => (
              <button
                key={c.val}
                onClick={() => {
                  setSelectedCategory(c.val);
                  setActiveTab('shop');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {lang === 'bn' ? c.bn : c.en}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
            >
              <Shield className="w-4 h-4" />
              <span>{t.admin}</span>
            </button>
            <a
              href={`https://wa.me/${toInternationalBdPhone(storeSettings.whatsappNumber)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
