import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FlashSale } from './components/FlashSale';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { ShopCatalogView } from './components/ShopCatalogView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CustomerAccountView } from './components/CustomerAccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileNavigation } from './components/MobileNavigation';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import { ArrowRight, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { lang, t, activeTab, setActiveTab, products } = useStore();

  const featuredProducts = products.filter((p) => p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-0">
            {/* Hero Banner */}
            <HeroSection />

            {/* Flash Deals with Live Countdown */}
            <FlashSale />

            {/* Category Filter Bar */}
            <CategoryBar />

            {/* Featured Products Collection */}
            <section className="py-12 sm:py-16 bg-slate-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span>{t.featuredProducts}</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'bn'
                        ? 'আমাদের সেরা রেটেড ও জনপ্রিয় গ্যাজেট কালেকশন'
                        : 'Handpicked authentic essentials with manufacturer warranty'}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('shop')}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>{t.viewAll}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {featuredProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'shop' && <ShopCatalogView />}
        {activeTab === 'flash' && (
          <div className="py-4">
            <FlashSale />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <h2 className="text-xl font-bold text-white mb-6">All Flash Sale Deals</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products
                  .filter((p) => p.flashSale || p.discountPercent > 20)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'track' && <OrderTrackingView />}
        {activeTab === 'checkout' && <CheckoutView />}
        {activeTab === 'account' && <CustomerAccountView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <OrderSuccessModal />
      <ToastContainer />
      <WhatsAppFloatingButton />
      <MobileNavigation />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
