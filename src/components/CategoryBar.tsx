import React from 'react';
import { useStore } from '../context/StoreContext';
import { Headphones, Watch, Sparkles, Shield, Coffee, Scissors, Laptop } from 'lucide-react';

export const CategoryBar: React.FC = () => {
  const { lang, selectedCategory, setSelectedCategory, setActiveTab } = useStore();

  const categoryItems = [
    {
      id: 'All',
      en: 'All Products',
      bn: 'সব পণ্য',
      icon: Sparkles,
      color: 'text-emerald-400',
    },
    {
      id: 'Electronics & Audio',
      en: 'Electronics & Audio',
      bn: 'ইলেকট্রনিক্স ও অডিও',
      icon: Headphones,
      color: 'text-teal-400',
    },
    {
      id: 'Smart Watches',
      en: 'Smart Watches',
      bn: 'স্মার্ট ওয়াচ',
      icon: Watch,
      color: 'text-cyan-400',
    },
    {
      id: 'Fashion & Luxury',
      en: 'Fashion & Luxury',
      bn: 'ফ্যাশন ও লাইফস্টাইল',
      icon: Sparkles,
      color: 'text-amber-400',
    },
    {
      id: 'Smart Home & Security',
      en: 'Smart Home & CCTV',
      bn: 'সিকিউরিটি ক্যামেরা',
      icon: Shield,
      color: 'text-indigo-400',
    },
    {
      id: 'Home & Kitchen',
      en: 'Home & Kitchen',
      bn: 'হোম ও কিচেন',
      icon: Coffee,
      color: 'text-emerald-400',
    },
    {
      id: 'Health & Grooming',
      en: 'Health & Grooming',
      bn: 'গ্রুমিং ও ট্রিমার',
      icon: Scissors,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="py-6 border-b border-slate-800 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categoryItems.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveTab('shop');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : cat.color}`} />
                <span>{lang === 'bn' ? cat.bn : cat.en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
