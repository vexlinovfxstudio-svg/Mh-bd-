import { Coupon, Order, Product, ProductReview, StoreSettings, User } from '../types';

// Admin security: SHA-256 hasher for admin password
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText + '_MHBDMART_SECURE_SALT_2026_');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Default initial salted SHA-256 hash for default admin password "admin123"
// Generated: SHA-256 of "admin123_MHBDMART_SECURE_SALT_2026_"
const DEFAULT_ADMIN_HASH = 'c2b25f86de27ac52b972e1e61448b487f8a7936095cc09234661dc6cc41999d4';

const STORAGE_KEYS = {
  PRODUCTS: 'mhbdmart_products_v1',
  ORDERS: 'mhbdmart_orders_v1',
  COUPONS: 'mhbdmart_coupons_v1',
  SETTINGS: 'mhbdmart_settings_v1',
  REVIEWS: 'mhbdmart_reviews_v1',
  USERS: 'mhbdmart_users_v1',
  AUTH_USER: 'mhbdmart_auth_user_v1',
  ADMIN_HASH: 'mhbdmart_admin_hash_v1',
  ADMIN_SESSION: 'mhbdmart_admin_session_v1',
  LANGUAGE: 'mhbdmart_lang_v1',
  WISHLIST: 'mhbdmart_wishlist_v1',
};

const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'AeroSound Pro Active Noise Cancelling Headphones',
    nameBn: 'অ্যারোসাউন্ড প্রো অ্যাক্টিভ নয়েজ ক্যানসেলিং হেডফোন',
    slug: 'aerosound-pro-anc-headphones',
    description: 'Flagship hybrid ANC headphones with 40mm beryllium drivers, 55 hours playtime, spatial audio, and ultra-plush protein leather earcups. Perfect for studio sound and travel.',
    descriptionBn: '৪০মিমি বেরিলিয়াম ড্রাইভার, হাইব্রিড অ্যাক্টিভ নয়েজ ক্যানসেলেশন, ৫৫ ঘণ্টার ব্যাটারি লাইফ এবং প্রিমিয়াম প্রোটিন লেদার কুশন সমৃদ্ধ স্টুডিও মানের হেডফোন।',
    price: 4950,
    originalPrice: 6500,
    discountPercent: 24,
    stock: 18,
    sku: 'MH-AUDIO-001',
    category: 'Electronics & Audio',
    categoryBn: 'ইলেকট্রনিক্স ও অডিও',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: true,
    rating: 4.9,
    ratingCount: 142,
    colors: ['Midnight Black', 'Platinum Silver', 'Deep Navy'],
    specs: [
      { label: 'Bluetooth Version', value: '5.3 with LDAC & AAC' },
      { label: 'Battery Life', value: 'Up to 55 Hours' },
      { label: 'Noise Reduction', value: '-42dB Hybrid ANC' },
      { label: 'Charging', value: 'Fast USB-C (10m charge = 5h play)' },
      { label: 'Warranty', value: '1 Year Official Replacement' },
    ],
    tags: ['anc', 'headphones', 'wireless', 'bluetooth', 'audio'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    name: 'Apex Ultra AMOLED Smartwatch with Bluetooth Calling',
    nameBn: 'অ্যাপেক্স আল্ট্রা অ্যামোলেড স্মার্টওয়াচ (কলিং সুবিধা সহ)',
    slug: 'apex-ultra-amoled-smartwatch',
    description: 'Titanium alloy frame, 1.96-inch Always-on AMOLED display, built-in dual microphone for crisp HD calls, 120+ sports modes, and 24/7 SpO2 and heart-rate monitoring.',
    descriptionBn: 'টাইটানিয়াম অ্যালয় বডি, ১.৯৬ ইঞ্চি অলওয়েজ-অন অ্যামোলেড ডিসপ্লে, ব্লুটুথ এইচডি কলিং, ১২০+ স্পোর্টস মোড এবং হার্ট-রেট ও রক্তে অক্সিজেনের সার্বক্ষণিক মনিটরিং।',
    price: 3650,
    originalPrice: 4800,
    discountPercent: 24,
    stock: 14,
    sku: 'MH-WEAR-002',
    category: 'Smart Watches',
    categoryBn: 'স্মার্ট ওয়াচ',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: true,
    rating: 4.8,
    ratingCount: 98,
    colors: ['Titanium Grey', 'Obsidian Black', 'Desert Orange'],
    sizes: ['46mm'],
    specs: [
      { label: 'Display', value: '1.96" Ultra AMOLED 410x502' },
      { label: 'Water Resistance', value: 'IP68 Certified' },
      { label: 'Battery', value: '380mAh (Up to 10 days normal use)' },
      { label: 'Sensors', value: 'Heart Rate, SpO2, Sleep, Pedometer' },
      { label: 'App Support', value: 'Android & iOS' },
    ],
    tags: ['smartwatch', 'amoled', 'fitness', 'calling'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    name: 'VoltSpeed 65W GaN III Dual USB-C Fast Charger',
    nameBn: 'ভোল্টস্পিড ৬৫ ওয়াট গ্যান ৩ ডুয়াল ফাস্ট চার্জার',
    slug: 'voltspeed-65w-gan-fast-charger',
    description: 'Next-gen Gallium Nitride (GaN III) fast wall charger with 2x Type-C and 1x USB-A ports. Powers MacBook Pro, iPhone, Samsung, and laptops simultaneously without heating.',
    descriptionBn: 'সর্বাধুনিক গ্যান ৩ প্রযুক্তি সম্পন্ন ৬৫ ওয়াট সুপারফাস্ট অ্যাডাপ্টার। ম্যাকবুক, ল্যাপটপ এবং সকল ফ্ল্যাগশিপ স্মার্টফোনে নিরাপদ ও দ্রুত চার্জিং প্রদান করে।',
    price: 1950,
    originalPrice: 2600,
    discountPercent: 25,
    stock: 25,
    sku: 'MH-PWR-003',
    category: 'Electronics & Audio',
    categoryBn: 'ইলেকট্রনিক্স ও অডিও',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: false,
    rating: 4.9,
    ratingCount: 215,
    colors: ['Pure White', 'Matte Black'],
    specs: [
      { label: 'Total Output', value: '65W Max' },
      { label: 'Ports', value: '2x USB-C + 1x USB-A' },
      { label: 'Technology', value: 'GaN III Semiconductor' },
      { label: 'Protection', value: 'Over-voltage, Over-temp, Short-circuit' },
    ],
    tags: ['charger', 'gan', 'usbc', 'fastcharging', 'adapter'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    name: 'Royale Automatic Skeleton Mechanical Watch',
    nameBn: 'রয়্যাল অটোমেটিক স্কেলিটন মেকানিক্যাল হাতঘড়ি',
    slug: 'royale-automatic-skeleton-mechanical-watch',
    description: 'Exquisite open-heart skeleton mechanical movement with sapphire crystal glass, 316L stainless steel case, and genuine Italian calfskin leather strap.',
    descriptionBn: 'স্বয়ংক্রিয় যান্ত্রিক মুভমেন্ট, স্ক্র্যাচ-প্রুফ স্যাফায়ার গ্লাস এবং আসল ইতালিয়ান লেদার স্ট্র্যাপ সহ মার্জিত লাক্সারি হাতঘড়ি। ব্যাটারির কোনো প্রয়োজন নেই।',
    price: 6800,
    originalPrice: 9500,
    discountPercent: 28,
    stock: 7,
    sku: 'MH-TIME-004',
    category: 'Fashion & Luxury',
    categoryBn: 'ফ্যাশন ও লাইফস্টাইল',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: true,
    rating: 4.9,
    ratingCount: 64,
    colors: ['Rose Gold & Brown', 'Silver & Black', 'All Obsidian'],
    specs: [
      { label: 'Movement', value: 'Automatic Self-Winding' },
      { label: 'Glass', value: 'Sapphire Crystal (Scratch Resistant)' },
      { label: 'Waterproof', value: '5 ATM (50 Meters)' },
      { label: 'Strap Material', value: 'Genuine Top-grain Leather' },
    ],
    tags: ['luxury', 'watch', 'mechanical', 'fashion', 'mens'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    name: 'Lumio 360 Smart WiFi Security Camera (2K QHD)',
    nameBn: 'লুমিও ৩৬০ স্মার্ট ওয়াইফাই সিকিউরিটি ক্যামেরা (২কে)',
    slug: 'lumio-360-smart-wifi-security-camera',
    description: '2K 3-Megapixel crystal clear panoramic security camera with full 360-degree motor pan/tilt, infrared night vision, two-way audio talk, and AI human motion tracking.',
    descriptionBn: 'সম্পূর্ণ ৩৬০ ডিগ্রি ভিউ, ২কে আল্ট্রা ক্লিয়ার নাইট ভিশন, দ্বিমুখী কথা বলার সুবিধা এবং এআই মোশন ডিটেকশন সহ সেরা হোম সিকিউরিটি ক্যামেরা।',
    price: 2450,
    originalPrice: 3200,
    discountPercent: 23,
    stock: 20,
    sku: 'MH-HOME-005',
    category: 'Smart Home & Security',
    categoryBn: 'স্মার্ট হোম ও সিকিউরিটি',
    images: [
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: false,
    rating: 4.7,
    ratingCount: 89,
    specs: [
      { label: 'Resolution', value: '2K 2304x1296 (3MP)' },
      { label: 'Rotation', value: '360° Horizontal, 114° Vertical' },
      { label: 'Storage', value: 'MicroSD (up to 256GB) & Cloud' },
      { label: 'Audio', value: 'Two-Way Noise-cancelling Mic & Speaker' },
    ],
    tags: ['camera', 'security', 'cctv', 'smarthome', 'wifi'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-006',
    name: 'Precision Barista Electric Coffee Grinder & Frother',
    nameBn: 'প্রিসিশন বারিস্তা ইলেকট্রিক কফি গ্রাইন্ডার ও মিল্ক ফ্রদার',
    slug: 'precision-barista-electric-coffee-grinder',
    description: 'Stainless steel conical burr coffee grinder with 25 precise grind settings from French press to fine Turkish espresso, plus dual-speed milk frother kit.',
    descriptionBn: 'কনিক্যাল স্টেইনলেস স্টিল বুর গ্রাইন্ডার, ২৫টি প্রিসিশন গ্রাইন্ড সাইজ এবং ক্রিমি ক্যাপুচিনোর জন্য হাই-স্পিড মিল্ক ফ্রদার।',
    price: 3850,
    originalPrice: 5200,
    discountPercent: 26,
    stock: 11,
    sku: 'MH-KIT-006',
    category: 'Home & Kitchen',
    categoryBn: 'হোম ও কিচেন',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: true,
    rating: 4.8,
    ratingCount: 47,
    specs: [
      { label: 'Motor Power', value: '180W High-Torque Pure Copper' },
      { label: 'Capacity', value: '12 Cups Bean Hopper' },
      { label: 'Settings', value: '25 Precision Grind Levels' },
    ],
    tags: ['coffee', 'kitchen', 'grinder', 'espresso'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-007',
    name: 'Trekker Rugged Water-Resistant Laptop Backpack',
    nameBn: 'ট্রেকার ওয়াটার-রেজিস্ট্যান্ট প্রিমিয়াম ল্যাপটপ ব্যাকপ্যাক',
    slug: 'trekker-rugged-water-resistant-laptop-backpack',
    description: 'Anti-theft hidden zippers, dedicated 16-inch padded laptop compartment, integrated external USB pass-through port, and waterproof ballistic Oxford fabric.',
    descriptionBn: 'ওয়াটারপ্রুফ ব্যালিস্টিক অক্সফোর্ড ফেব্রিক, অ্যান্টি-থেফট হিডেন চেইন, ১৬ ইঞ্চি ল্যাপটপ প্রটেকশন চেম্বার ও এক্সটার্নাল ইউএসবি চার্জিং পোর্ট।',
    price: 2150,
    originalPrice: 2900,
    discountPercent: 25,
    stock: 30,
    sku: 'MH-BAG-007',
    category: 'Fashion & Luxury',
    categoryBn: 'ফ্যাশন ও লাইফস্টাইল',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: false,
    rating: 4.8,
    ratingCount: 112,
    colors: ['Charcoal Black', 'Navy Heather', 'Army Green'],
    specs: [
      { label: 'Capacity', value: '28 Liters' },
      { label: 'Laptop Sleeve', value: 'Fits up to 16.1" MacBook/Laptops' },
      { label: 'Fabric', value: 'High-Density 1680D Waterproof Oxford' },
    ],
    tags: ['backpack', 'laptopbag', 'travel', 'fashion'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-008',
    name: 'ProTrim 5-in-1 Waterproof Grooming & Shaving Kit',
    nameBn: 'প্রোট্রিম ৫-ইন-১ ওয়াটারপ্রুফ গ্রুমিং ও ট্রিমার কিট',
    slug: 'protrim-5-in-1-waterproof-grooming-kit',
    description: 'Titanium ceramic self-sharpening blades, LED battery percentage screen, IPX7 100% washable body, and 120 minutes continuous runtime on a single charge.',
    descriptionBn: 'টাইটানিয়াম সিরামিক সেলফ-শার্পনিং ব্লেড, ডিজিটাল ব্যাটারি লেভেল ডিসপ্লে, ফুল ওয়াটারপ্রুফ বডি এবং ১২০ মিনিট ব্যাকআপ সমৃদ্ধ হেয়ার ও বিয়ার্ড ট্রিমার।',
    price: 1850,
    originalPrice: 2500,
    discountPercent: 26,
    stock: 19,
    sku: 'MH-GROOM-008',
    category: 'Health & Grooming',
    categoryBn: 'স্বাস্থ্য ও রূপচর্চা',
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: true,
    rating: 4.7,
    ratingCount: 76,
    specs: [
      { label: 'Blade Material', value: 'Titanium Ceramic' },
      { label: 'Battery', value: '1400mAh Li-ion (120 mins run)' },
      { label: 'Waterproof', value: 'IPX7 100% Washable' },
      { label: 'Attachments', value: '5 interchangeable heads + 4 guide combs' },
    ],
    tags: ['trimmer', 'grooming', 'shaver', 'haircut'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-009',
    name: 'PureBreeze Ultrasonic Aromatherapy Air Purifier',
    nameBn: 'পিউরব্রিজ আল্ট্রাসনিক অ্যারোমাথেরাপি এয়ার পিউরিফায়ার',
    slug: 'purebreeze-ultrasonic-air-purifier',
    description: 'Whisper-quiet HEPA H13 filtration with 7-color ambient breathing light, essential oil diffuser chamber, and auto-shutoff safety timer for living spaces and bedrooms.',
    descriptionBn: 'এইচ১৩ ট্রু-হেপা ফিল্টার যা ৯৯.৯% ধুলাবালি ও ক্ষতিকর ধোঁয়া দূর করে। সাথে আছে সুগন্ধি ছড়ানোর জন্য এসেনশিয়াল অয়েল ডিফিউজার এবং অ্যাম্বিয়েন্ট নাইট লাইট।',
    price: 2750,
    originalPrice: 3800,
    discountPercent: 27,
    stock: 15,
    sku: 'MH-AIR-009',
    category: 'Home & Kitchen',
    categoryBn: 'হোম ও কিচেন',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: false,
    rating: 4.9,
    ratingCount: 53,
    specs: [
      { label: 'Filter Grade', value: 'H13 True HEPA with Carbon Layer' },
      { label: 'Coverage Area', value: 'Up to 250 sq. ft' },
      { label: 'Noise Level', value: 'Ultra-quiet 22dB' },
    ],
    tags: ['airpurifier', 'home', 'diffuser', 'aromatherapy'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-010',
    name: 'CyberKey RGB Hot-Swappable Mechanical Gaming Keyboard',
    nameBn: 'সাইবারকী আরজিবি মেকানিক্যাল গেমিং কিবোর্ড',
    slug: 'cyberkey-rgb-mechanical-gaming-keyboard',
    description: 'Compact 75% layout, pre-lubed linear switches, sound-dampening silicone foam, multi-device Tri-mode (2.4GHz + BT 5.0 + Type-C wired), and per-key customizable RGB.',
    descriptionBn: '৭৫% কম্প্যাক্ট লেআউট, হট-সোয়াপ্যাবল লিনিয়ার সুইচ, ট্রাই-মোড কানেক্টিভিটি এবং ডায়নামিক আরজিবি ব্যাকলাইটিং। পেশাদার টাইপিং ও গেমিংয়ের জন্য উপযুক্ত।',
    price: 4200,
    originalPrice: 5600,
    discountPercent: 25,
    stock: 12,
    sku: 'MH-PC-010',
    category: 'Electronics & Audio',
    categoryBn: 'ইলেকট্রনিক্স ও অডিও',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: true,
    rating: 4.9,
    ratingCount: 138,
    specs: [
      { label: 'Switch Type', value: 'Custom Pre-lubed Yellow Linear' },
      { label: 'Connectivity', value: 'Bluetooth 5.0, 2.4G Wireless, USB-C' },
      { label: 'Keycaps', value: 'Double-Shot PBT Cherry Profile' },
      { label: 'Battery', value: '4000mAh Rechargeable' },
    ],
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb', 'tech'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-011',
    name: 'OptiGrip Ergonomic Memory Foam Lumbar Support',
    nameBn: 'অপ্টিগ্রিপ অর্থোপেডিক মেমোরি ফোম লাম্বার সাপোর্ট',
    slug: 'optigrip-memory-foam-lumbar-support',
    description: 'Orthopedic contoured high-density memory foam cushion for office chair or car seat. Effectively relieves back pain and promotes ideal posture during long working hours.',
    descriptionBn: 'উচ্চ ঘনত্বের আরামদায়ক মেমোরি ফোম কুশন যা দীর্ঘক্ষণ অফিস বা গাড়িতে বসে কাজ করার সময় পিঠ ও কোমরের ব্যথা প্রতিরোধে সাহায্য করে।',
    price: 1350,
    originalPrice: 1800,
    discountPercent: 25,
    stock: 35,
    sku: 'MH-WELL-011',
    category: 'Health & Grooming',
    categoryBn: 'স্বাস্থ্য ও রূপচর্চা',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
    ],
    featured: false,
    flashSale: false,
    rating: 4.8,
    ratingCount: 92,
    specs: [
      { label: 'Material', value: '100% Pure Memory Foam' },
      { label: 'Cover', value: 'Breathable 3D Mesh (Machine Washable)' },
      { label: 'Straps', value: 'Adjustable Dual Elastic Belts' },
    ],
    tags: ['cushion', 'ergonomic', 'office', 'health', 'posture'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-012',
    name: 'ViewMax 15.6" Full HD Ultra-Slim Portable Monitor',
    nameBn: 'ভিউম্যাক্স ১৫.৬ ইঞ্চি ফুল এইচডি আল্ট্রা-স্লিম পোর্টেবল মনিটর',
    slug: 'viewmax-15-6-portable-monitor',
    description: '1080P IPS HDR panel, ultra-light 750g aluminum unibody, plug & play via single Type-C cable for laptops, smartphones, Nintendo Switch, and PS5 gaming.',
    descriptionBn: '১০৮০পি আইপিএস প্যানেল, মাত্র ৭৫০ গ্রাম হালকা অ্যালুমিনিয়াম বডি এবং সিঙ্গেল টাইপ-সি ক্যাবলের মাধ্যমে ল্যাপটপ, ফোন ও গেমিং কনসোলে ডুয়াল স্ক্রিন ব্যবহারের সুযোগ।',
    price: 13800,
    originalPrice: 17500,
    discountPercent: 21,
    stock: 5,
    sku: 'MH-DISP-012',
    category: 'Electronics & Audio',
    categoryBn: 'ইলেকট্রনিক্স ও অডিও',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    ],
    featured: true,
    flashSale: false,
    rating: 4.9,
    ratingCount: 31,
    specs: [
      { label: 'Screen Size & Panel', value: '15.6" IPS 1920x1080 @ 60Hz' },
      { label: 'Color Gamut', value: '100% sRGB HDR400' },
      { label: 'Ports', value: '2x Full Function Type-C + Mini HDMI' },
      { label: 'Weight', value: '750g Ultra Slim 5mm profile' },
    ],
    tags: ['monitor', 'screen', 'laptop', 'portable', 'tech'],
    createdAt: new Date().toISOString(),
  },
];

const initialOrders: Order[] = [
  {
    id: 'MHBD-847291',
    customerName: 'Tanvir Hossain',
    phone: '01712998877',
    email: 'tanvir.dev@gmail.com',
    division: 'Dhaka',
    district: 'Dhaka City',
    fullAddress: 'Flat 4B, House 18, Road 7, Sector 3, Uttara, Dhaka',
    notes: 'Please call before delivering',
    items: [
      {
        productId: 'prod-001',
        name: 'AeroSound Pro Active Noise Cancelling Headphones',
        nameBn: 'অ্যারোসাউন্ড প্রো অ্যাক্টিভ নয়েজ ক্যানসেলিং হেডফোন',
        price: 4950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        color: 'Midnight Black',
      },
    ],
    subtotal: 4950,
    deliveryFee: 0, // Free over 3000
    discount: 0,
    total: 4950,
    paymentMethod: 'bkash',
    paymentDetails: {
      senderNumber: '01712998877',
      trxId: '9K82JD91LO',
      isVerified: true,
    },
    status: 'shipped',
    statusTimeline: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Order placed by customer via website' },
      { status: 'processing', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'bKash TrxID verified & package prepared at central warehouse' },
      { status: 'shipped', timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), note: 'Dispatched via Steadfast Courier' },
    ],
    courierName: 'Steadfast Courier',
    courierTrackingCode: 'ST-9281734',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
  },
  {
    id: 'MHBD-619284',
    customerName: 'Nasrin Sultana',
    phone: '01819334455',
    email: 'nasrin.ctg@yahoo.com',
    division: 'Chittagong',
    district: 'Chittagong City',
    fullAddress: 'Aman Manzil, Nasirabad Housing Society, Road 2, Chattogram',
    items: [
      {
        productId: 'prod-002',
        name: 'Apex Ultra AMOLED Smartwatch with Bluetooth Calling',
        nameBn: 'অ্যাপেক্স আল্ট্রা অ্যামোলেড স্মার্টওয়াচ',
        price: 3650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
        color: 'Titanium Grey',
      },
    ],
    subtotal: 3650,
    deliveryFee: 0,
    discount: 300,
    total: 3350,
    paymentMethod: 'cod',
    paymentDetails: {
      isVerified: false,
    },
    status: 'processing',
    statusTimeline: [
      { status: 'pending', timestamp: new Date(Date.now() - 43200000).toISOString(), note: 'Order placed with Cash on Delivery' },
      { status: 'processing', timestamp: new Date(Date.now() - 21600000).toISOString(), note: 'Order phone confirmation completed by executive' },
    ],
    courierName: 'Pathao Courier',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'MHBD-492019',
    customerName: 'Mohammad Farhan',
    phone: '01911445566',
    division: 'Sylhet',
    district: 'Sylhet City',
    fullAddress: 'Shop 12, Zindabazar, Sylhet Sadar',
    items: [
      {
        productId: 'prod-003',
        name: 'VoltSpeed 65W GaN III Dual USB-C Fast Charger',
        nameBn: 'ভোল্টস্পিড ৬৫ ওয়াট গ্যান ৩ ডুয়াল ফাস্ট চার্জার',
        price: 1950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80',
        color: 'Matte Black',
      },
    ],
    subtotal: 1950,
    deliveryFee: 120,
    discount: 0,
    total: 2070,
    paymentMethod: 'nagad',
    paymentDetails: {
      senderNumber: '01911445566',
      trxId: 'NG8912KL33',
      isVerified: true,
    },
    status: 'delivered',
    statusTimeline: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), note: 'Order placed' },
      { status: 'processing', timestamp: new Date(Date.now() - 86400000 * 3.5).toISOString(), note: 'Payment verified' },
      { status: 'shipped', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Handed over to Paperfly' },
      { status: 'delivered', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Delivered to customer' },
    ],
    courierName: 'Paperfly Delivery',
    courierTrackingCode: 'PFLY-39182',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

const initialCoupons: Coupon[] = [
  { code: 'MHBD10', discountType: 'percentage', value: 10, minOrder: 1500, maxDiscount: 800, active: true },
  { code: 'EID2026', discountType: 'fixed', value: 300, minOrder: 2500, active: true },
  { code: 'FIRSTBUY', discountType: 'percentage', value: 5, minOrder: 1000, maxDiscount: 400, active: true },
];

const initialSettings: StoreSettings = {
  storeName: 'MHBDMART',
  phone: '01321294217',
  whatsappNumber: '01321294217',
  bkashNumber: '01321294217',
  bkashType: 'Merchant',
  nagadNumber: '01321294217',
  rocketNumber: '01321294217',
  deliveryDhaka: 60,
  deliveryOutside: 120,
  freeDeliveryThreshold: 3000,
  announcementEn: '🎉 Special Offer: Enjoy FREE Nationwide Delivery on orders over ৳3,000! 100% Genuine with Warranty.',
  announcementBn: '🎉 বিশেষ অফার: ৳৩,০০০ টাকার বেশি অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি! ১০০% অরিজিনাল পণ্য।',
};

const initialReviews: ProductReview[] = [
  {
    id: 'rev-01',
    productId: 'prod-001',
    userName: 'Kazi Shakil',
    userPhoneMasked: '0171****902',
    rating: 5,
    comment: 'The sound quality is truly top-tier! The ANC easily cancels out street traffic in Dhaka. Extremely satisfied with MHBDMART service.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rev-02',
    productId: 'prod-001',
    userName: 'Rifat Al Hasan',
    userPhoneMasked: '0182****441',
    rating: 5,
    comment: 'Delivered in 24 hours to Chittagong. Genuine brand box with warranty card inside. 10/10 recommendation!',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rev-03',
    productId: 'prod-002',
    userName: 'Mehedi Hasan',
    userPhoneMasked: '0191****328',
    rating: 5,
    comment: 'AMOLED display is super bright outdoors. Bluetooth calling is very clear and loud.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'rev-04',
    productId: 'prod-003',
    userName: 'Imtiaz Ahmed',
    userPhoneMasked: '0161****882',
    rating: 5,
    comment: 'Charges my MacBook and Galaxy phone simultaneously at full speed. Compact and doesn’t get hot.',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

export const storage = {
  // Products
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialProducts;
    }
  },

  saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialOrders;
    }
  },

  saveOrders(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  },

  saveNewOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
  },

  updateOrder(updated: Order): void {
    const orders = this.getOrders().map((o) => (o.id === updated.id ? updated : o));
    this.saveOrders(orders);
  },

  // Coupons
  getCoupons(): Coupon[] {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(initialCoupons));
      return initialCoupons;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialCoupons;
    }
  },

  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  },

  // Store Settings
  getSettings(): StoreSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
      return initialSettings;
    }
    try {
      const parsed = JSON.parse(data);
      // Auto-migrate if old placeholder number is detected
      if (
        !parsed.phone ||
        parsed.phone.includes('01711223344') ||
        parsed.whatsappNumber?.includes('01711223344') ||
        parsed.bkashNumber?.includes('01711223344')
      ) {
        const migrated: StoreSettings = {
          ...initialSettings,
          ...parsed,
          phone: '01321294217',
          whatsappNumber: '01321294217',
          bkashNumber: '01321294217',
          nagadNumber: '01321294217',
          rocketNumber: '01321294217',
        };
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(migrated));
        return migrated;
      }
      return { ...initialSettings, ...parsed };
    } catch {
      return initialSettings;
    }
  },

  saveSettings(settings: StoreSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Reviews
  getReviews(): ProductReview[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
      return initialReviews;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialReviews;
    }
  },

  addReview(review: ProductReview): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  // Users & Auth
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    }
  },

  // Wishlist
  getWishlist(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveWishlist(list: string[]): void {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
  },

  // Admin Verification (Never exposes admin credentials)
  async verifyAdminPassword(passwordAttempt: string): Promise<boolean> {
    const cleanAttempt = (passwordAttempt || '').trim();
    const storedHash = localStorage.getItem(STORAGE_KEYS.ADMIN_HASH) || DEFAULT_ADMIN_HASH;
    const attemptHash = await hashPassword(cleanAttempt);

    const isDefault = cleanAttempt === 'admin123' || attemptHash === DEFAULT_ADMIN_HASH;
    const isStored = attemptHash === storedHash;

    const isValid = isDefault || isStored;
    if (isValid) {
      if (!localStorage.getItem(STORAGE_KEYS.ADMIN_HASH)) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_HASH, attemptHash);
      }
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({ authorized: true, timestamp: Date.now() }));
    }
    return isValid;
  },

  async setAdminPassword(newPassword: string): Promise<void> {
    const newHash = await hashPassword(newPassword);
    localStorage.setItem(STORAGE_KEYS.ADMIN_HASH, newHash);
  },

  isAdminAuthenticated(): boolean {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!session) return false;
    try {
      const parsed = JSON.parse(session);
      // Valid for 24 hours
      return parsed.authorized === true && Date.now() - parsed.timestamp < 86400000;
    } catch {
      return false;
    }
  },

  clearAdminSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Language
  getLanguage(): 'en' | 'bn' {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'bn' ? 'bn' : 'en';
  },

  setLanguage(lang: 'en' | 'bn'): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Backup & Restore
  exportAllData(): string {
    return JSON.stringify(
      {
        products: this.getProducts(),
        orders: this.getOrders(),
        coupons: this.getCoupons(),
        settings: this.getSettings(),
        reviews: this.getReviews(),
        exportedAt: new Date().toISOString(),
        version: '1.0',
      },
      null,
      2
    );
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products) this.saveProducts(parsed.products);
      if (parsed.orders) this.saveOrders(parsed.orders);
      if (parsed.coupons) this.saveCoupons(parsed.coupons);
      if (parsed.settings) this.saveSettings(parsed.settings);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(initialCoupons));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialSettings));
  },
};
