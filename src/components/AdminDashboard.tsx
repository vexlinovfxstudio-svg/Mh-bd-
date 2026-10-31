import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus, Product, Coupon } from '../types';
import { getWhatsAppCustomerStatusUpdateUrl } from '../services/whatsapp';
import { storage } from '../services/storage';
import {
  Shield,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  Settings,
  Download,
  Upload,
  Key,
  X,
  Search,
  ExternalLink,
  Printer,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  Tag,
  Save,
  Check,
  RotateCcw,
  Percent,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    lang,
    t,
    formatAmount,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    storeSettings,
    updateStoreSettings,
    coupons,
    addCoupon,
    deleteCoupon,
    toggleCoupon,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword,
    showToast,
    setActiveTab,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'products' | 'orders' | 'coupons' | 'settings' | 'security'
  >('overview');

  // Login Gate State
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Product Add / Edit Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Search & Filter in Admin
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminProductCategory, setAdminProductCategory] = useState('all');
  const [adminProductStockFilter, setAdminProductStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Quick inline edits state: key = prod.id, value = { price, originalPrice, stock }
  const [inlineEdits, setInlineEdits] = useState<
    Record<string, { price: number; originalPrice: number; stock: number }>
  >({});

  // Product Form fields
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodNameBn, setProdNameBn] = useState('');
  const [prodCategory, setProdCategory] = useState('Electronics & Audio');
  const [prodCategoryBn, setProdCategoryBn] = useState('ইলেকট্রনিক্স ও অডিও');
  const [prodPrice, setProdPrice] = useState(2500);
  const [prodOrigPrice, setProdOrigPrice] = useState(3200);
  const [prodStock, setProdStock] = useState(15);
  const [prodSku, setProdSku] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodDescBn, setProdDescBn] = useState('');
  const [prodImagesText, setProdImagesText] = useState('');
  const [prodFeatured, setProdFeatured] = useState(true);
  const [prodFlash, setProdFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Coupon Creation Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(1000);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Status update dialog
  const [newStatus, setNewStatus] = useState<OrderStatus>('processing');
  const [statusNote, setStatusNote] = useState('');
  const [courierName, setCourierName] = useState('Steadfast Courier');
  const [trackingCode, setTrackingCode] = useState('');

  // Settings fields
  const [settingsForm, setSettingsForm] = useState(storeSettings);

  useEffect(() => {
    setSettingsForm(storeSettings);
  }, [storeSettings]);

  // Security password change
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');

  // Backup restore
  const restoreFileRef = useRef<HTMLInputElement>(null);

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setLoginError(false);
    const success = await loginAdmin(adminPasswordInput.trim());
    setIsVerifying(false);
    if (!success) {
      setLoginError(true);
    } else {
      setAdminPasswordInput('');
    }
  };

  // If not authenticated, render secure login gate
  if (!isAdmin) {
    return (
      <div className="py-16 sm:py-24 bg-slate-950 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">{t.adminDashboard}</h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {t.adminLoginPrompt}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  {t.adminKeyLabel}
                </label>
                <button
                  type="button"
                  onClick={() => setAdminPasswordInput('admin123')}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Fill Default (admin123)
                </button>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-11 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {loginError && (
                <p className="text-xs text-rose-400 mt-1.5 font-medium">
                  {lang === 'bn' ? 'ভুল সিকিউরিটি পাসওয়ার্ড। ডিফল্ট: admin123' : 'Invalid Admin Security Key. Default: admin123'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : t.adminLoginButton}
            </button>
          </form>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs text-slate-400">
            <span>Default Security Key: <strong className="text-emerald-400 font-mono">admin123</strong></span>
          </div>

          <div className="pt-1 text-center text-[11px] text-slate-500">
            <span>MHBDMART Security Protocol · End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalRev = orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total : sum), 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  // Open modal for adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdNameEn('');
    setProdNameBn('');
    setProdCategory('Electronics & Audio');
    setProdCategoryBn('ইলেকট্রনিক্স ও অডিও');
    setProdPrice(2500);
    setProdOrigPrice(3200);
    setProdStock(15);
    setProdSku(`MH-${Math.floor(100 + Math.random() * 900)}`);
    setProdDescEn('');
    setProdDescBn('');
    setProdImagesText('');
    setProdFeatured(true);
    setProdFlash(false);
    setProductModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdNameEn(p.name);
    setProdNameBn(p.nameBn);
    setProdCategory(p.category);
    setProdCategoryBn(p.categoryBn);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice);
    setProdStock(p.stock);
    setProdSku(p.sku);
    setProdDescEn(p.description);
    setProdDescBn(p.descriptionBn);
    setProdImagesText(p.images.join('\n'));
    setProdFeatured(!!p.featured);
    setProdFlash(!!p.flashSale);
    setProductModalOpen(true);
  };

  // Local image file upload handler (FileReader converts to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProdImagesText((prev) => (prev ? `${result}\n${prev}` : result));
      showToast(lang === 'bn' ? 'ছবি সফলভাবে লোড করা হয়েছে' : 'Image loaded successfully', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const images = prodImagesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const fallbackImg =
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

    const discountPercent =
      prodOrigPrice > prodPrice ? Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100) : 0;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodNameEn,
        nameBn: prodNameBn || prodNameEn,
        category: prodCategory,
        categoryBn: prodCategoryBn || prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOrigPrice),
        discountPercent,
        stock: Number(prodStock),
        sku: prodSku,
        description: prodDescEn,
        descriptionBn: prodDescBn || prodDescEn,
        images: fallbackImg,
        featured: prodFeatured,
        flashSale: prodFlash,
      });
    } else {
      addProduct({
        name: prodNameEn,
        nameBn: prodNameBn || prodNameEn,
        slug: prodNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: prodCategory,
        categoryBn: prodCategoryBn || prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOrigPrice),
        discountPercent,
        stock: Number(prodStock),
        sku: prodSku,
        description: prodDescEn,
        descriptionBn: prodDescBn || prodDescEn,
        images: fallbackImg,
        featured: prodFeatured,
        flashSale: prodFlash,
        rating: 5.0,
        ratingCount: 1,
        specs: [{ label: 'Warranty', value: '1 Year Warranty' }],
        tags: ['electronics', 'premium'],
      });
    }

    setProductModalOpen(false);
  };

  // Status update
  const handleConfirmStatusUpdate = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, statusNote, courierName, trackingCode);
    const updated = orders.find((o) => o.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
    setStatusNote('');
  };

  // Export JSON
  const handleExportData = () => {
    const json = storage.exportAllData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mhbdmart_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database backup downloaded', 'success');
  };

  // Restore JSON
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = storage.importData(content);
      if (success) {
        showToast('Database restored successfully! Reloading data...', 'success');
        window.location.reload();
      } else {
        showToast('Invalid backup file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Change Admin password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass || newAdminPass.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    await changeAdminPassword(newAdminPass);
    setNewAdminPass('');
    setConfirmAdminPass('');
  };

  // Filtered products for admin
  const filteredAdminProducts = products.filter((p) => {
    const matchesSearch =
      adminProductSearch === '' ||
      p.name.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
      p.nameBn.includes(adminProductSearch) ||
      p.sku.toLowerCase().includes(adminProductSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(adminProductSearch.toLowerCase());

    const matchesCategory =
      adminProductCategory === 'all' || p.category === adminProductCategory;

    const matchesStock =
      adminProductStockFilter === 'all'
        ? true
        : adminProductStockFilter === 'low'
        ? p.stock <= 5 && p.stock > 0
        : p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleInlineChange = (
    productId: string,
    field: 'price' | 'originalPrice' | 'stock',
    value: number
  ) => {
    setInlineEdits((prev) => {
      const prod = products.find((p) => p.id === productId);
      const current = prev[productId] || {
        price: prod?.price ?? 0,
        originalPrice: prod?.originalPrice ?? 0,
        stock: prod?.stock ?? 0,
      };
      return {
        ...prev,
        [productId]: {
          ...current,
          [field]: value,
        },
      };
    });
  };

  const handleSaveInlineProduct = (prod: Product) => {
    const edit = inlineEdits[prod.id];
    if (!edit) return;
    const newPrice = Math.max(0, Number(edit.price));
    const newOrigPrice = Math.max(newPrice, Number(edit.originalPrice));
    const newStock = Math.max(0, Number(edit.stock));
    const discountPercent =
      newOrigPrice > newPrice ? Math.round(((newOrigPrice - newPrice) / newOrigPrice) * 100) : 0;

    updateProduct({
      ...prod,
      price: newPrice,
      originalPrice: newOrigPrice,
      stock: newStock,
      discountPercent,
    });

    setInlineEdits((prev) => {
      const copy = { ...prev };
      delete copy[prod.id];
      return copy;
    });

    showToast(
      lang === 'bn'
        ? `"${prod.nameBn}" এর নতুন দাম ৳${newPrice.toLocaleString()} ও স্টক সফলভাবে সেভ হয়েছে!`
        : `Updated "${prod.name}" price (৳${newPrice.toLocaleString()}) & stock successfully!`,
      'success'
    );
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) {
      showToast('Please enter coupon code', 'error');
      return;
    }
    const cleanCode = newCouponCode.trim().toUpperCase();
    addCoupon({
      code: cleanCode,
      discountType: newCouponType,
      value: Number(newCouponValue),
      minOrder: Number(newCouponMinOrder),
      active: true,
    });
    setNewCouponCode('');
    setNewCouponValue(10);
    setNewCouponMinOrder(1000);
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilterStatus === 'all' || o.status === orderFilterStatus;
    const matchesSearch =
      orderSearch === '' ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-8 sm:py-12 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Admin Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-600/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{t.adminDashboard}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium">
                ● Live Database & Store Management (সবকিছু পরিবর্তনের সম্পূর্ণ সুবিধা)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'bn' ? 'ওয়েবসাইট দেখুন' : 'Visit Live Store'}</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t.exportData}</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
            >
              {t.logout}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
          {[
            { id: 'overview', label: t.overview, icon: TrendingUp },
            { id: 'products', label: `${t.products} (${products.length})`, icon: Package },
            { id: 'orders', label: t.orders, icon: ShoppingBag, count: pendingCount },
            { id: 'coupons', label: lang === 'bn' ? 'কুপন ও ছাড়' : 'Coupons & Promos', icon: Tag },
            { id: 'settings', label: t.settings, icon: Settings },
            { id: 'security', label: 'Security & Backup', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeAdminTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.totalRevenue}
                </span>
                <p className="text-2xl font-black text-emerald-400">{formatAmount(totalRev)}</p>
                <p className="text-[11px] text-slate-500">From completed & active orders</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.totalOrders}
                </span>
                <p className="text-2xl font-black text-white">{orders.length}</p>
                <p className="text-[11px] text-slate-500">Lifetime orders received</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.pendingOrders}
                </span>
                <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
                <p className="text-[11px] text-slate-500">Requires verification/dispatch</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {t.lowStockAlerts}
                </span>
                <p className="text-2xl font-black text-rose-400">{lowStockCount}</p>
                <p className="text-[11px] text-slate-500">Items with &le; 5 units</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">{t.recentOrders}</h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {t.viewAll}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">{t.customer}</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3 text-right">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {orders.slice(0, 5).map((ord) => (
                      <tr
                        key={ord.id}
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveAdminTab('orders');
                        }}
                        className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          {ord.id}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-200">
                          {ord.customerName}
                          <span className="block text-[10px] text-slate-500">{ord.phone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : ord.status === 'shipped'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : ord.status === 'processing'
                                ? 'bg-amber-500/20 text-amber-400'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 uppercase text-slate-400 font-semibold">
                          {ord.paymentMethod}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-white">
                          {formatAmount(ord.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD & QUICK PRICE EDIT */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-black text-white">{t.products}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                    {filteredAdminProducts.length} of {products.length} Items
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'bn'
                    ? 'যেকোনো প্রোডাক্টের দাম ও স্টক সরাসরি টেবিল থেকে পরিবর্তন করুন অথবা বিস্তারিত এডিট করতে পেন্সিল আইকনে ক্লিক করুন'
                    : 'Edit prices and stock directly in the table or click the pencil icon for full product details'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addProduct}</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={adminProductSearch}
                  onChange={(e) => setAdminProductSearch(e.target.value)}
                  placeholder={
                    lang === 'bn'
                      ? 'নাম বা SKU দিয়ে প্রোডাক্ট খুঁজুন...'
                      : 'Search product by name or SKU...'
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={adminProductCategory}
                  onChange={(e) => setAdminProductCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">{lang === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
                  <option value="Electronics & Audio">Electronics & Audio</option>
                  <option value="Smart Watches">Smart Watches</option>
                  <option value="Fashion & Luxury">Fashion & Luxury</option>
                  <option value="Smart Home & Security">Smart Home & Security</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Health & Grooming">Health & Grooming</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setAdminProductStockFilter('all')}
                  className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-colors ${
                    adminProductStockFilter === 'all'
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  All ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminProductStockFilter('low')}
                  className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-colors ${
                    adminProductStockFilter === 'low'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-950/60'
                  }`}
                >
                  Low (&le;5)
                </button>
              </div>
            </div>

            {/* Products Table with Quick Inline Editor */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs min-w-[760px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Item / পণ্য</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Selling Price (৳)</th>
                    <th className="py-3 px-3">Regular Price (৳)</th>
                    <th className="py-3 px-3">Stock Units</th>
                    <th className="py-3 px-3">Badges</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAdminProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        {lang === 'bn'
                          ? 'কোনো প্রোডাক্ট পাওয়া যায়নি।'
                          : 'No products found matching your filter.'}
                      </td>
                    </tr>
                  ) : (
                    filteredAdminProducts.map((prod) => {
                      const edit = inlineEdits[prod.id];
                      const curPrice = edit?.price !== undefined ? edit.price : prod.price;
                      const curOrig =
                        edit?.originalPrice !== undefined ? edit.originalPrice : prod.originalPrice;
                      const curStock = edit?.stock !== undefined ? edit.stock : prod.stock;

                      const isChanged =
                        edit !== undefined &&
                        (edit.price !== prod.price ||
                          edit.originalPrice !== prod.originalPrice ||
                          edit.stock !== prod.stock);

                      return (
                        <tr
                          key={prod.id}
                          className={`hover:bg-slate-800/40 transition-colors ${
                            isChanged ? 'bg-emerald-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                              />
                              <div className="min-w-0 max-w-[200px]">
                                <p className="font-bold text-slate-100 truncate" title={prod.name}>
                                  {prod.name}
                                </p>
                                <p className="text-[11px] text-emerald-400 truncate">
                                  {prod.nameBn}
                                </p>
                                <p className="text-[10px] text-slate-500 font-mono">
                                  SKU: {prod.sku}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-300">
                            <span className="px-2 py-1 rounded-md bg-slate-950 text-[11px] border border-slate-800">
                              {prod.category}
                            </span>
                          </td>

                          {/* Editable Selling Price */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-bold">৳</span>
                              <input
                                type="number"
                                min={0}
                                value={curPrice}
                                onChange={(e) =>
                                  handleInlineChange(prod.id, 'price', Number(e.target.value))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlineProduct(prod);
                                }}
                                className={`w-24 bg-slate-950 border rounded-lg px-2 py-1 font-bold text-xs text-white focus:outline-none ${
                                  edit?.price !== undefined && edit.price !== prod.price
                                    ? 'border-emerald-400 ring-1 ring-emerald-400 text-emerald-300'
                                    : 'border-slate-700 text-emerald-400'
                                }`}
                              />
                            </div>
                          </td>

                          {/* Editable Regular / Original Price */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-bold">৳</span>
                              <input
                                type="number"
                                min={0}
                                value={curOrig}
                                onChange={(e) =>
                                  handleInlineChange(
                                    prod.id,
                                    'originalPrice',
                                    Number(e.target.value)
                                  )
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlineProduct(prod);
                                }}
                                className={`w-24 bg-slate-950 border rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none ${
                                  edit?.originalPrice !== undefined &&
                                  edit.originalPrice !== prod.originalPrice
                                    ? 'border-amber-400 ring-1 ring-amber-400'
                                    : 'border-slate-800'
                                }`}
                              />
                            </div>
                          </td>

                          {/* Editable Stock */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={0}
                                value={curStock}
                                onChange={(e) =>
                                  handleInlineChange(prod.id, 'stock', Number(e.target.value))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveInlineProduct(prod);
                                }}
                                className={`w-16 bg-slate-950 border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none ${
                                  curStock <= 5
                                    ? 'text-rose-400 border-rose-500/50'
                                    : 'text-slate-200 border-slate-700'
                                }`}
                              />
                              <span className="text-[10px] text-slate-500">pcs</span>
                            </div>
                          </td>

                          {/* Badges Quick View */}
                          <td className="py-3 px-3">
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateProduct({ ...prod, featured: !prod.featured })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold text-left transition-colors ${
                                  prod.featured
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {prod.featured ? '✓ Featured' : '+ Feature'}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateProduct({ ...prod, flashSale: !prod.flashSale })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-bold text-left transition-colors ${
                                  prod.flashSale
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-slate-950 text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                {prod.flashSale ? '⚡ Flash Sale' : '+ Flash'}
                              </button>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Save button if modified */}
                              {isChanged && (
                                <button
                                  onClick={() => handleSaveInlineProduct(prod)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 animate-pulse"
                                  title="Save Changes"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>{lang === 'bn' ? 'সেভ' : 'Save'}</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleOpenEditModal(prod)}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                title="Full Details Edit"
                              >
                                <Edit2 className="w-4 h-4 text-cyan-400" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete "${prod.name}" permanently?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  {lang === 'bn'
                    ? 'টিপস: দাম বা স্টক লিখে পাশে থাকা "সেভ" বাটনে ক্লিক করুন অথবা এন্টার চাপুন।'
                    : 'Tip: Edit price or stock in the box and click "Save" or press Enter.'}
                </span>
                <span>
                  {lang === 'bn'
                    ? 'পরিবর্তন করার সাথে সাথে ওয়েবসাইটে লাইভ কার্যকর হয়'
                    : 'Changes reflect instantly on the live storefront'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white">{t.orders}</h2>
                <p className="text-xs text-slate-400">Manage orders, update courier, notify customers</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto text-xs">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                      orderFilterStatus === st
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">{t.customer}</th>
                    <th className="py-3 px-3">District</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">{ord.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{ord.customerName}</span>
                        <span className="text-[11px] text-slate-400">{ord.phone}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {ord.district}, {ord.division}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold uppercase text-slate-200">
                          {ord.paymentMethod}
                        </span>
                        {ord.paymentDetails.trxId && (
                          <span className="block font-mono text-[10px] text-emerald-400">
                            Trx: {ord.paymentDetails.trxId}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ord.status === 'shipped'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : ord.status === 'processing'
                              ? 'bg-amber-500/20 text-amber-400'
                              : ord.status === 'cancelled'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-white">
                        {formatAmount(ord.total)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setNewStatus(ord.status);
                            setCourierName(ord.courierName || 'Steadfast Courier');
                            setTrackingCode(ord.courierTrackingCode || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Management Dialog */}
            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
                <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">Manage Order</span>
                      <h3 className="text-xl font-mono font-black text-emerald-400">
                        {selectedOrder.id}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Customer & Items Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-300 block">Customer Information</span>
                      <p className="text-white font-medium">{selectedOrder.customerName}</p>
                      <p className="text-slate-300 font-semibold flex items-center gap-1.5">
                        <span>📞 {selectedOrder.phone}</span>
                        {selectedOrder.alternatePhone && (
                          <span className="text-slate-400 font-normal">
                            (বিকল্প: {selectedOrder.alternatePhone})
                          </span>
                        )}
                      </p>
                      {selectedOrder.email && <p className="text-slate-400">{selectedOrder.email}</p>}
                      <p className="text-slate-300 pt-1">
                        {selectedOrder.fullAddress}, {selectedOrder.district}, {selectedOrder.division}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-bold text-slate-300 block">Payment Details</span>
                      <p className="text-white font-bold uppercase">{selectedOrder.paymentMethod}</p>
                      {selectedOrder.paymentDetails.senderNumber && (
                        <p className="text-slate-400">
                          Sender: {selectedOrder.paymentDetails.senderNumber}
                        </p>
                      )}
                      {selectedOrder.paymentDetails.trxId && (
                        <p className="font-mono text-emerald-400">
                          TrxID: {selectedOrder.paymentDetails.trxId}
                        </p>
                      )}
                      <p className="text-base font-black text-white pt-2">
                        Total: {formatAmount(selectedOrder.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="border border-slate-800 rounded-xl p-3 bg-slate-950 divide-y divide-slate-800 text-xs">
                    <span className="font-bold text-slate-300 pb-2 block">Order Items</span>
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={it.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover bg-slate-900"
                          />
                          <div>
                            <span className="text-slate-200 font-semibold">{it.name}</span>
                            <span className="text-slate-400 block text-[11px]">
                              Qty: {it.quantity}{it.color ? ` · ${it.color}` : ''}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400">
                          {formatAmount(it.price * it.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Status & Courier Update Fields */}
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Update Order State
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Target Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Courier Partner
                        </label>
                        <select
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="Steadfast Courier">Steadfast Courier</option>
                          <option value="Pathao Courier">Pathao Courier</option>
                          <option value="Paperfly Delivery">Paperfly Delivery</option>
                          <option value="RedX Logistics">RedX Logistics</option>
                          <option value="Sundarban Courier">Sundarban Courier</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Courier Consignment / Tracking Code
                        </label>
                        <input
                          type="text"
                          value={trackingCode}
                          onChange={(e) => setTrackingCode(e.target.value)}
                          placeholder="e.g. ST-9821447"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-400 mb-1 font-semibold">
                          Timeline Note (Visible to Customer)
                        </label>
                        <input
                          type="text"
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="e.g. Parcel packed and handed over to delivery hub"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                      {/* One-click WhatsApp status update link to customer */}
                      <a
                        href={getWhatsAppCustomerStatusUpdateUrl(selectedOrder, storeSettings)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/60 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Notify Customer via WhatsApp</span>
                      </a>

                      <button
                        onClick={handleConfirmStatusUpdate}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md"
                      >
                        {t.saveSettings}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS & DISCOUNTS */}
        {activeAdminTab === 'coupons' && (
          <div className="space-y-6 max-w-4xl animate-in fade-in">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
                <Tag className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-black text-white">
                    {lang === 'bn' ? 'ডিসকাউন্ট কুপন তৈরি করুন' : 'Create Discount Coupon'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn'
                      ? 'কাস্টমারদের বিশেষ ছাড় দিতে কুপন কোড তৈরি ও নিয়ন্ত্রণ করুন'
                      : 'Create and manage discount codes for checkout'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. MHBD15"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Taka (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Value {newCouponType === 'percentage' ? '(%)' : '(৳)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="sm:col-span-4 flex justify-end pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'কুপন যোগ করুন' : 'Add Coupon'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Coupons List */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'সক্রিয় কুপন তালিকা' : 'Active Coupons'} ({coupons.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Code</th>
                      <th className="py-2.5 px-3">Discount</th>
                      <th className="py-2.5 px-3">Min Order</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">{c.code}</td>
                        <td className="py-3 px-3 text-slate-200 font-semibold">
                          {c.discountType === 'percentage' ? `${c.value}% Off` : `৳${c.value} Off`}
                        </td>
                        <td className="py-3 px-3 text-slate-300">৳{c.minOrder.toLocaleString()}</td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => toggleCoupon(c.code)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.active
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {c.active ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Delete coupon "${c.code}"?`)) {
                                deleteCoupon(c.code);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 max-w-4xl animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-black text-white">{t.settings}</h2>
                <p className="text-xs text-slate-400">
                  {lang === 'bn'
                    ? 'হোমপেজ ব্যানার, ফোন নম্বর, পেমেন্ট ওয়ালেট এবং ডেলিভারি চার্জ পরিবর্তন করুন'
                    : 'Modify homepage hero banners, contact numbers, payment wallets and delivery fees'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-600/30"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'ওয়েবসাইটে পরিবর্তন দেখুন' : 'Preview on Live Store'}</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStoreSettings(settingsForm);
              }}
              className="space-y-6 text-xs"
            >
              {/* SECTION 1: HOMEPAGE HERO BANNER & HEADLINES */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    {lang === 'bn'
                      ? '১. হোমপেজ ব্যানার ও হেডলাইন (Homepage Hero Banner & Headlines)'
                      : '1. Homepage Hero Banner & Headlines'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hero Title (Bengali / বাংলা)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroTitleBn || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroTitleBn: e.target.value })
                      }
                      placeholder="যেমন: প্রিমিয়াম গ্যাজেট ও লাইফস্টাইল সেরা অফারে"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hero Title (English)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroTitleEn || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroTitleEn: e.target.value })
                      }
                      placeholder="e.g. Curated Premium Tech & Modern Lifestyle"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hero Subtitle (Bengali / বাংলা)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitleBn || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroSubtitleBn: e.target.value })
                      }
                      placeholder="যেমন: অথেনটিক গ্যাজেট, স্মার্ট এক্সেসরিজ এবং সেরা কোয়ালিটির পণ্য..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Hero Subtitle (English)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.heroSubtitleEn || ''}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, heroSubtitleEn: e.target.value })
                      }
                      placeholder="e.g. Elevate your everyday life with authentic gadgets..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONTACT & WHATSAPP HOTLINE */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'bn'
                    ? '২. যোগাযোগ ও হোয়াটসঅ্যাপ নম্বর (Contacts & WhatsApp)'
                    : '2. Contacts & WhatsApp Support'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Store WhatsApp Support Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      বর্তমান: 01321294217 (হোয়াটসঅ্যাপ চ্যাট ও অর্ডার লিঙ্কের জন্য)
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Customer Hotline Phone *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.phone}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, phone: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      বর্তমান: 01321294217 (কল ও হটলাইনের জন্য)
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PAYMENT WALLETS */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'bn'
                    ? '৩. পেমেন্ট ওয়ালেট নম্বরসমূহ (Payment Gateways)'
                    : '3. Payment Gateway Wallets'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      bKash Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.bkashNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">bKash Account Type</label>
                    <select
                      value={settingsForm.bkashType}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, bkashType: e.target.value as any })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Personal">Personal Account (Send Money)</option>
                      <option value="Merchant">Merchant Account (Payment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Nagad Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.nagadNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Rocket Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.rocketNumber}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: DELIVERY CHARGES */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'bn'
                    ? '৪. ডেলিভারি চার্জ ও ফ্রি ডেলিভারি (Shipping Fees)'
                    : '4. Delivery & Shipping Rates'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      ডেলিভারি ফি (ঢাকার ভেতর) ৳
                    </label>
                    <input
                      type="number"
                      required
                      value={settingsForm.deliveryDhaka}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, deliveryDhaka: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      ডেলিভারি ফি (ঢাকার বাইরে) ৳
                    </label>
                    <input
                      type="number"
                      required
                      value={settingsForm.deliveryOutside}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          deliveryOutside: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      ফ্রি ডেলিভারি ন্যূনতম অর্ডার ৳
                    </label>
                    <input
                      type="number"
                      required
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: TOP NOTICE TICKER */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'bn'
                    ? '৫. শীর্ষ নোটিশ বার (Top Announcement Marquee)'
                    : '5. Top Announcement Banner'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Top Announcement (English)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementEn}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementEn: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      শীর্ষ নোটিশ (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementBn}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, announcementBn: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'সব সেটিংস সেভ করুন' : t.saveSettings}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: SECURITY & BACKUP */}
        {activeAdminTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl animate-in fade-in">
            {/* Password Change Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Key className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Change Admin Security Key</h3>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    New Security Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmAdminPass}
                    onChange={(e) => setConfirmAdminPass(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <p className="text-[11px] text-slate-500">
                  Password is cryptographically hashed with SHA-256 and never stored in plain text.
                </p>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

            {/* Backup & Restore Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Backup & Restore</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p className="text-slate-400">
                  Download a full JSON snapshot of all products, orders, reviews, coupons, and store configuration.
                </p>

                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download JSON Database Backup</span>
                </button>

                <div className="pt-2">
                  <input
                    type="file"
                    ref={restoreFileRef}
                    accept=".json"
                    onChange={handleRestoreFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => restoreFileRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-slate-200 font-semibold"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    <span>Restore Database from File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Add / Edit Modal */}
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? t.editProduct : t.addProduct}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.productNameEn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodNameEn}
                      onChange={(e) => setProdNameEn(e.target.value)}
                      placeholder="e.g. Ultra HD Smartwatch"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.productNameBn} *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodNameBn}
                      onChange={(e) => setProdNameBn(e.target.value)}
                      placeholder="যেমন: আল্ট্রা এইচডি স্মার্টওয়াচ"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Category (English)
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Electronics & Audio">Electronics & Audio</option>
                      <option value="Smart Watches">Smart Watches</option>
                      <option value="Fashion & Luxury">Fashion & Luxury</option>
                      <option value="Smart Home & Security">Smart Home & Security</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Health & Grooming">Health & Grooming</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">SKU</label>
                    <input
                      type="text"
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      placeholder="MH-PROD-001"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.productPrice} *
                    </label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.regularPrice} (৳)
                    </label>
                    <input
                      type="number"
                      value={prodOrigPrice}
                      onChange={(e) => setProdOrigPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {t.stockCount} *
                    </label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        className="rounded text-emerald-500"
                      />
                      <span>Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-amber-400">
                      <input
                        type="checkbox"
                        checked={prodFlash}
                        onChange={(e) => setProdFlash(e.target.checked)}
                        className="rounded text-amber-500"
                      />
                      <span>⚡ Flash Sale</span>
                    </label>
                  </div>
                </div>

                {/* Local file upload & Image URLs */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-300">{t.productImages}</label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-emerald-400 font-semibold"
                    >
                      + {t.uploadLocalImage}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={prodImagesText}
                    onChange={(e) => setProdImagesText(e.target.value)}
                    placeholder="https://images.unsplash.com/... (one link per line)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500">{t.uploadHint}</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t.description} (English)
                  </label>
                  <textarea
                    rows={2}
                    value={prodDescEn}
                    onChange={(e) => setProdDescEn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    {t.description} (Bengali)
                  </label>
                  <textarea
                    rows={2}
                    value={prodDescBn}
                    onChange={(e) => setProdDescBn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    {t.saveProduct}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
