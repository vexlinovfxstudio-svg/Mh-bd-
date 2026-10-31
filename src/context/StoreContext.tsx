import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Coupon,
  Language,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  StoreSettings,
  User,
} from '../types';
import { formatPrice, translations } from '../services/i18n';
import { storage } from '../services/storage';

interface PlaceOrderParams {
  customerName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  division: string;
  district: string;
  fullAddress: string;
  notes?: string;
  deliveryArea: 'dhaka' | 'outside';
  paymentMethod: PaymentMethod;
  senderNumber?: string;
  trxId?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  t: (typeof translations)['en'];
  formatAmount: (amount: number) => string;

  // Navigation
  activeTab: 'home' | 'shop' | 'flash' | 'track' | 'checkout' | 'account' | 'admin';
  setActiveTab: (tab: 'home' | 'shop' | 'flash' | 'track' | 'checkout' | 'account' | 'admin') => void;

  // Catalog
  products: Product[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filteredProducts: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;

  // Cart
  cart: CartItem[];
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
  trackOrderLookup: (query: string) => Order | null;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    note?: string,
    courierName?: string,
    courierTrackingCode?: string
  ) => void;

  // Product CRUD (Admin)
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // User Auth
  currentUser: User | null;
  loginUser: (identifier: string) => boolean;
  registerUser: (name: string, phone: string, email?: string) => boolean;
  logoutUser: () => void;

  // Admin Auth
  isAdmin: boolean;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => Promise<void>;

  // Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: StoreSettings) => void;

  // Coupons (Admin & Store)
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  toggleCoupon: (code: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => storage.getLanguage());
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'flash' | 'track' | 'checkout' | 'account' | 'admin'>('home');
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storage.getOrders());
  const [coupons, setCoupons] = useState<Coupon[]>(() => storage.getCoupons());
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => storage.getSettings());
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [wishlist, setWishlist] = useState<string[]>(() => storage.getWishlist());
  const [isAdmin, setIsAdmin] = useState<boolean>(() => storage.isAdminAuthenticated());

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    storage.setLanguage(newLang);
  };

  const t = translations[lang];
  const formatAmount = (amt: number) => formatPrice(amt, lang);

  // Cart math
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = Math.round((cartSubtotal * appliedCoupon.value) / 100);
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    if (product.stock <= 0) {
      showToast(lang === 'bn' ? 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই।' : 'Sorry, this product is currently out of stock.', 'error');
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast(
            lang === 'bn'
              ? `সর্বোচ্চ ${product.stock} টি স্টকে আছে।`
              : `Only ${product.stock} units available in stock.`,
            'info'
          );
          updated[existingIndex].quantity = product.stock;
        } else {
          updated[existingIndex].quantity = newQty;
          showToast(
            lang === 'bn'
              ? `কার্টে পরিমাণ আপডেট করা হয়েছে (${updated[existingIndex].quantity})`
              : `Updated quantity in cart (${updated[existingIndex].quantity})`,
            'success'
          );
        }
        return updated;
      } else {
        showToast(
          lang === 'bn' ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে` : `Added "${product.name}" to cart`,
          'success'
        );
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
    showToast(lang === 'bn' ? 'পণ্য কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          const finalQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === clean && c.active);

    if (!found) {
      return { success: false, message: lang === 'bn' ? 'অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড।' : 'Invalid or expired promo code.' };
    }

    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message:
          lang === 'bn'
            ? `এই কুপনের জন্য সর্বনিম্ন ৳${found.minOrder.toLocaleString()} টাকার অর্ডার প্রয়োজন।`
            : `Minimum order of ৳${found.minOrder.toLocaleString()} required for this coupon.`,
      };
    }

    setAppliedCoupon(found);
    return {
      success: true,
      message:
        lang === 'bn'
          ? `কুপন কোড "${found.code}" সফলভাবে প্রয়োগ করা হয়েছে!`
          : `Promo code "${found.code}" applied successfully!`,
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast(lang === 'bn' ? 'কুপন সরানো হয়েছে' : 'Promo code removed', 'info');
  };

  const addCoupon = (newCoupon: Coupon) => {
    const updated = [newCoupon, ...coupons.filter((c) => c.code.toUpperCase() !== newCoupon.code.toUpperCase())];
    setCoupons(updated);
    storage.saveCoupons(updated);
    showToast(lang === 'bn' ? 'কুপন সফলভাবে যোগ করা হয়েছে' : 'Coupon created successfully', 'success');
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    setCoupons(updated);
    storage.saveCoupons(updated);
    showToast(lang === 'bn' ? 'কুপন মুছে ফেলা হয়েছে' : 'Coupon removed', 'info');
  };

  const toggleCoupon = (code: string) => {
    const updated = coupons.map((c) =>
      c.code.toUpperCase() === code.toUpperCase() ? { ...c, active: !c.active } : c
    );
    setCoupons(updated);
    storage.saveCoupons(updated);
    showToast(lang === 'bn' ? 'কুপন স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'Coupon status updated', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    let updated: string[];
    if (exists) {
      updated = wishlist.filter((id) => id !== productId);
      showToast(lang === 'bn' ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from wishlist', 'info');
    } else {
      updated = [...wishlist, productId];
      showToast(lang === 'bn' ? 'পছন্দের তালিকায় যুক্ত হয়েছে ❤️' : 'Added to wishlist ❤️', 'success');
    }
    setWishlist(updated);
    storage.saveWishlist(updated);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Filtered Products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameBn.includes(searchQuery) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' ||
      selectedCategory === 'সব' ||
      prod.category === selectedCategory ||
      prod.categoryBn === selectedCategory;

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.featured ? 1 : -1;
  });

  // Orders
  const placeOrder = async (params: PlaceOrderParams): Promise<Order> => {
    const deliveryFee =
      cartSubtotal >= storeSettings.freeDeliveryThreshold
        ? 0
        : params.deliveryArea === 'dhaka'
        ? storeSettings.deliveryDhaka
        : storeSettings.deliveryOutside;

    const total = Math.max(0, cartSubtotal + deliveryFee - discountAmount);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MHBD-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: params.customerName.trim(),
      phone: params.phone.trim(),
      alternatePhone: params.alternatePhone?.trim(),
      email: params.email?.trim(),
      division: params.division,
      district: params.district,
      fullAddress: params.fullAddress.trim(),
      notes: params.notes?.trim(),
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        nameBn: item.product.nameBn,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0] || '',
        color: item.selectedColor,
        size: item.selectedSize,
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      total,
      paymentMethod: params.paymentMethod,
      paymentDetails: {
        senderNumber: params.senderNumber?.trim(),
        trxId: params.trxId?.trim(),
        isVerified: false,
      },
      status: 'pending',
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note:
            params.paymentMethod === 'cod'
              ? 'Order placed with Cash on Delivery'
              : `Order placed with ${params.paymentMethod.toUpperCase()} (TrxID: ${params.trxId || 'Pending'})`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Deduct stock
    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((c) => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });

    setProducts(updatedProducts);
    storage.saveProducts(updatedProducts);

    storage.saveNewOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    clearCart();

    return newOrder;
  };

  const trackOrderLookup = (query: string): Order | null => {
    const clean = query.trim().toLowerCase();
    if (!clean) return null;
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === clean ||
          o.phone.replace(/[^0-9]/g, '') === clean.replace(/[^0-9]/g, '') ||
          (o.courierTrackingCode && o.courierTrackingCode.toLowerCase() === clean)
      ) || null
    );
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    note?: string,
    courierName?: string,
    courierTrackingCode?: string
  ) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;

    const timelineEvent = {
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status.toUpperCase()}`,
    };

    const updated: Order = {
      ...target,
      status,
      courierName: courierName || target.courierName,
      courierTrackingCode: courierTrackingCode || target.courierTrackingCode,
      statusTimeline: [...target.statusTimeline, timelineEvent],
      updatedAt: new Date().toISOString(),
      paymentDetails: {
        ...target.paymentDetails,
        isVerified: status === 'delivered' ? true : target.paymentDetails.isVerified,
      },
    };

    storage.updateOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    showToast(`Order #${orderId} status updated to ${status.toUpperCase()}`, 'success');
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      ...prodData,
      id,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    storage.saveProducts(updated);
    showToast(lang === 'bn' ? 'পণ্য সফলভাবে যোগ করা হয়েছে' : 'Product created successfully', 'success');
  };

  const updateProduct = (product: Product) => {
    const updated = products.map((p) => (p.id === product.id ? product : p));
    setProducts(updated);
    storage.saveProducts(updated);
    showToast(lang === 'bn' ? 'পণ্য তথ্য আপডেট হয়েছে' : 'Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    storage.saveProducts(updated);
    showToast(lang === 'bn' ? 'পণ্য মুছে ফেলা হয়েছে' : 'Product deleted', 'info');
  };

  // User Auth
  const loginUser = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase();
    const existing = storage.getUsers().find((u) => u.email.toLowerCase() === clean || u.phone === clean);
    if (existing) {
      setCurrentUser(existing);
      storage.setCurrentUser(existing);
      showToast(lang === 'bn' ? `স্বাগতম, ${existing.name}!` : `Welcome back, ${existing.name}!`, 'success');
      return true;
    }
    // Auto register simple user
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: identifier.split('@')[0] || 'Customer',
      email: clean.includes('@') ? clean : `${clean}@mhbdmart.com`,
      phone: clean.startsWith('01') ? clean : '01700000000',
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    const allUsers = [...storage.getUsers(), newUser];
    storage.saveUsers(allUsers);
    setCurrentUser(newUser);
    storage.setCurrentUser(newUser);
    showToast(lang === 'bn' ? 'লগইন সফল হয়েছে' : 'Logged in successfully', 'success');
    return true;
  };

  const registerUser = (name: string, phone: string, email?: string): boolean => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || `${phone.trim()}@mhbdmart.com`,
      role: 'customer',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString(),
    };
    const allUsers = [...storage.getUsers(), newUser];
    storage.saveUsers(allUsers);
    setCurrentUser(newUser);
    storage.setCurrentUser(newUser);
    showToast(lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Account registered successfully!', 'success');
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
    showToast(lang === 'bn' ? 'লগআউট করা হয়েছে' : 'Logged out', 'info');
  };

  // Admin Auth
  const loginAdmin = async (password: string): Promise<boolean> => {
    const valid = await storage.verifyAdminPassword(password);
    if (valid) {
      setIsAdmin(true);
      showToast(lang === 'bn' ? 'অ্যাডমিন প্যানেলে স্বাগতম' : 'Authorized Admin Access Granted', 'success');
      return true;
    } else {
      showToast(lang === 'bn' ? 'ভুল সিকিউরিটি পাসওয়ার্ড।' : 'Invalid Admin Security Key.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    storage.clearAdminSession();
    setIsAdmin(false);
    showToast(lang === 'bn' ? 'অ্যাডমিন সেশন সমাপ্ত হয়েছে' : 'Admin logged out', 'info');
  };

  const changeAdminPassword = async (newPass: string) => {
    await storage.setAdminPassword(newPass);
    showToast(lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' : 'Admin password updated', 'success');
  };

  // Settings
  const updateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    storage.saveSettings(newSettings);
    showToast(lang === 'bn' ? 'স্টোর সেটিংস সেভ করা হয়েছে' : 'Store settings saved', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        t,
        formatAmount,
        activeTab,
        setActiveTab,
        products,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        cart,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        lastPlacedOrder,
        setLastPlacedOrder,
        trackOrderLookup,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        currentUser,
        loginUser,
        registerUser,
        logoutUser,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        storeSettings,
        updateStoreSettings,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCoupon,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
