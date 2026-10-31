import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, X, Sparkles } from 'lucide-react';

export const ShopCatalogView: React.FC = () => {
  const {
    lang,
    t,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useStore();

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
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {selectedCategory === 'All'
                ? t.shop
                : selectedCategory}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {filteredProducts.length} {lang === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'premium items available'}
            </p>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 shrink-0">{t.sortBy}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="featured">Featured First</option>
              <option value="newest">{t.newest}</option>
              <option value="price-low">{t.priceLowHigh}</option>
              <option value="price-high">{t.priceHighLow}</option>
              <option value="rating">{t.ratingHigh}</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.val}
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.val
                  ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'bn' ? cat.bn : cat.en}
            </button>
          ))}
        </div>

        {/* Active Search Filter Banner */}
        {searchQuery && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              Showing results for: <span className="font-bold text-white">"{searchQuery}"</span>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <Search className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No products found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords or choosing another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
