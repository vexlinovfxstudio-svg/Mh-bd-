import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storage } from '../services/storage';
import { getWhatsAppProductInquiryUrl } from '../services/whatsapp';
import {
  X,
  Star,
  ShoppingCart,
  Zap,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  Check,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    lang,
    t,
    formatAmount,
    selectedProduct,
    setSelectedProduct,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    setActiveTab,
    storeSettings,
    showToast,
  } = useStore();

  const product = selectedProduct || quickViewProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.colors?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerPhone, setReviewerPhone] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const handleClose = () => {
    setSelectedProduct(null);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    handleClose();
    setActiveTab('checkout');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      showToast(lang === 'bn' ? 'অনুগ্রহ করে সকল তথ্য পূরণ করুন।' : 'Please fill all required fields.', 'error');
      return;
    }

    const masked = reviewerPhone.trim()
      ? `${reviewerPhone.slice(0, 4)}****${reviewerPhone.slice(-3)}`
      : '0171****991';

    storage.addReview({
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: reviewerName.trim(),
      userPhoneMasked: masked,
      rating: reviewRating,
      comment: reviewComment.trim(),
      createdAt: new Date().toISOString(),
    });

    showToast(lang === 'bn' ? 'রিভিউ জমা দেওয়ার জন্য ধন্যবাদ!' : 'Thank you for your review!', 'success');
    setReviewComment('');
    setReviewerName('');
    setShowReviewForm(false);
  };

  const reviews = storage.getReviews().filter((r) => r.productId === product.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{lang === 'bn' ? product.categoryBn : product.category}</span>
            <span>·</span>
            <span>SKU: {product.sku}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
            {/* Left: Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all"
                />
                {product.discountPercent > 0 && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-black shadow-md">
                    -{product.discountPercent}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-emerald-500 scale-95 shadow-md'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Controls */}
            <div className="space-y-5">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {lang === 'bn' ? product.nameBn : product.name}
                </h1>

                {/* Rating & In-stock */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span className="text-slate-400">({product.ratingCount} reviews)</span>
                  </div>
                  <span className="text-slate-600">·</span>
                  <div>
                    {product.stock > 0 ? (
                      <span className="text-emerald-400 font-semibold">
                        ✓ {t.inStock} ({product.stock} {t.unitsLeft})
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold">{t.outOfStock}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-baseline gap-3">
                <span className="text-2xl font-black text-emerald-400">
                  {formatAmount(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-slate-500 line-through">
                    {formatAmount(product.originalPrice)}
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-emerald-300/80">
                  {lang === 'bn' ? 'ভ্যাট অন্তর্ভুক্ত' : 'VAT Included'}
                </span>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.colors}: <span className="text-emerald-400">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedColor === color
                            ? 'bg-emerald-600/20 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    {t.sizes}: <span className="text-emerald-400">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSize === size
                            ? 'bg-emerald-600/20 border-emerald-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  {lang === 'bn' ? 'পরিমাণ' : 'Quantity'}
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 text-slate-400 hover:text-white"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-2 text-slate-400 hover:text-white"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">
                    {lang === 'bn'
                      ? `স্টকে মোট ${product.stock} টি আছে`
                      : `Total ${product.stock} available`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      addToCart(product, quantity, selectedColor, selectedSize);
                    }}
                    disabled={product.stock <= 0}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{t.buyNow}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Product Inquiry Button */}
                <a
                  href={getWhatsAppProductInquiryUrl(product, storeSettings)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 font-semibold text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{t.askOnWhatsApp}</span>
                </a>
              </div>

              {/* Delivery Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400">
                <div className="p-2 rounded-lg bg-slate-950">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                  <span>{lang === 'bn' ? '২৪-৭২ ঘণ্টা হোম ডেলিভারি' : '24-72h Delivery'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-teal-400" />
                  <span>{lang === 'bn' ? '১০০% আসল ওয়্যারেন্টি' : '100% Genuine'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-950">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                  <span>{lang === 'bn' ? '৭ দিনে সহজ রিটার্ন' : '7 Days Return'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pt-6 border-t border-slate-800">
            <h3 className="text-base font-bold text-white mb-2">{t.description}</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {lang === 'bn' ? product.descriptionBn : product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specs && product.specs.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-base font-bold text-white mb-3">{t.specifications}</h3>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex flex-col sm:flex-row py-2.5 px-4 bg-slate-950/40">
                    <span className="font-semibold text-slate-400 sm:w-1/3 mb-1 sm:mb-0">
                      {spec.label}
                    </span>
                    <span className="text-slate-200 sm:w-2/3">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">{t.customerReviews}</h3>
                <p className="text-xs text-slate-400">
                  {reviews.length} {lang === 'bn' ? 'টি রিভিউ পাওয়া গেছে' : 'verified reviews'}
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                {showReviewForm ? t.cancel : t.writeReview}
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleAddReview}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 mb-4 animate-in fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Shakil Ahmed"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.phoneNumber} ({lang === 'bn' ? 'গোপন রাখা হবে' : 'will be masked'})
                    </label>
                    <input
                      type="text"
                      value={reviewerPhone}
                      onChange={(e) => setReviewerPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.yourRating}:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-amber-400 hover:scale-110 transition-transform p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-600'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.yourReview} *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={
                      lang === 'bn'
                        ? 'পণ্যের মান ও ডেলিভারি নিয়ে আপনার মতামত জানান...'
                        : 'Share your feedback about product quality and speed...'
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {t.submitReview}
                </button>
              </form>
            )}

            {/* Existing Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                {lang === 'bn'
                  ? 'এখনও কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউ দিন!'
                  : 'No reviews yet. Be the first to review this product!'}
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{rev.userName}</span>
                        <span className="text-[10px] text-slate-500">{rev.userPhoneMasked}</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-normal">{rev.comment}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
