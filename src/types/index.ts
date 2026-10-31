export type Language = 'en' | 'bn';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  stock: number;
  sku: string;
  category: string;
  categoryBn: string;
  images: string[];
  featured?: boolean;
  flashSale?: boolean;
  rating: number;
  ratingCount: number;
  specs: ProductSpec[];
  colors?: string[];
  sizes?: string[];
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'bkash' | 'nagad' | 'rocket' | 'cod';

export interface OrderItem {
  productId: string;
  name: string;
  nameBn: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string; // e.g. MHBD-749214
  customerName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  division: string;
  district: string;
  fullAddress: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    senderNumber?: string;
    trxId?: string;
    isVerified?: boolean;
  };
  status: OrderStatus;
  statusTimeline: OrderStatusEvent[];
  courierName?: string;
  courierTrackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  id: string;
  label: string;
  division: string;
  district: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  wishlist: string[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 200 for ৳200
  minOrder: number;
  maxDiscount?: number;
  active: boolean;
  expiresAt?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userPhoneMasked: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  phone: string;
  whatsappNumber: string; // e.g. "+8801711223344"
  bkashNumber: string;
  bkashType: 'Merchant' | 'Personal';
  nagadNumber: string;
  rocketNumber: string;
  deliveryDhaka: number;
  deliveryOutside: number;
  freeDeliveryThreshold: number;
  announcementEn: string;
  announcementBn: string;
  heroTitleEn?: string;
  heroTitleBn?: string;
  heroSubtitleEn?: string;
  heroSubtitleBn?: string;
}
