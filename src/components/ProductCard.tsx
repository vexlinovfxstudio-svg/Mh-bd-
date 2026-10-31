import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    lang,
    formatAmount,
    addToCart,
    setSelectedProduct,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const isFavorited = isInWishlist(product.id);

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-emerald-950/20">
      {/* Product Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[11px] font-black tracking-wide shadow-sm">
            -{product.discountPercent}%
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors ${
            isFavorited
              ? 'bg-rose-500 text-white'
              : 'bg-slate-950/60 text-slate-300 hover:text-white hover:bg-slate-900/80'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center gap-2">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-slate-200 text-xs font-semibold backdrop-blur-md border border-slate-700 transition-all shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'এক নজরে' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata: Category & Rating (Zero-pill discipline) */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="truncate">{lang === 'bn' ? product.categoryBn : product.category}</span>
            <div className="flex items-center gap-1 shrink-0 text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-semibold text-slate-300">{product.rating}</span>
              <span className="text-slate-500 text-[10px]">({product.ratingCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
            title={product.name}
          >
            {lang === 'bn' ? product.nameBn : product.name}
          </h3>

          {/* Stock state indicator */}
          <div className="mt-2 text-[11px]">
            {product.stock <= 0 ? (
              <span className="text-rose-400 font-medium">
                {lang === 'bn' ? 'স্টক শেষ' : 'Out of stock'}
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-400 font-medium">
                {lang === 'bn'
                  ? `মাত্র ${product.stock} টি বাকি আছে!`
                  : `Only ${product.stock} units left!`}
              </span>
            ) : (
              <span className="text-emerald-400/90 font-medium">
                ✓ {lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-emerald-400">
              {formatAmount(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-slate-500 line-through">
                {formatAmount(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1, product.colors?.[0], product.sizes?.[0])}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-semibold transition-all flex items-center justify-center shrink-0 ${
              product.stock <= 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 shadow-md shadow-emerald-700/20'
            }`}
            title={lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to cart'}
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
