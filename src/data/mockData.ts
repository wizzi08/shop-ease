import { Category, Conversation, Message, Order, PlatformReport, Product, Review, User } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    iconName: 'Smartphone',
    description: 'Smartphones, laptops, smart audio, gaming gear, and creator tech.',
    itemCount: 48,
    bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    feePercentage: 5,
    subcategories: ['Audio & Headphones', 'Laptops & Computers', 'Smartphones & Wearables', 'Cameras & Video', 'Gaming & Consoles']
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    iconName: 'Shirt',
    description: 'Designer streetwear, timeless vintage, luxury footwear, and accessories.',
    itemCount: 62,
    bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    feePercentage: 6,
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Footwear & Sneakers', 'Watches & Jewelry', 'Bags & Luggage']
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    slug: 'home-living',
    iconName: 'Home',
    description: 'Scandinavian furniture, artisan ceramics, lighting, and kitchenware.',
    itemCount: 39,
    bannerImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    feePercentage: 5,
    subcategories: ['Furniture', 'Lighting & Lamps', 'Kitchen & Dining', 'Decor & Rugs', 'Bedding & Bath']
  },
  {
    id: 'cat-collectibles',
    name: 'Collectibles & Art',
    slug: 'collectibles',
    iconName: 'Gem',
    description: 'Original canvas art, vintage vinyl, rare trading cards, and sculptures.',
    itemCount: 27,
    bannerImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    feePercentage: 7,
    subcategories: ['Original Paintings', 'Vinyl Records', 'Trading Cards', 'Retro Gaming', 'Rare Books']
  },
  {
    id: 'cat-sports',
    name: 'Sports & Outdoors',
    slug: 'sports',
    iconName: 'Compass',
    description: 'Bicycles, camping gear, fitness equipment, and technical outerwear.',
    itemCount: 34,
    bannerImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80',
    feePercentage: 5,
    subcategories: ['Cycling & Bikes', 'Camping & Hiking', 'Fitness & Gym', 'Water Sports', 'Winter Sports']
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Wellness',
    slug: 'beauty',
    iconName: 'Sparkles',
    description: 'Organic skincare, niche fragrances, haircare, and therapeutic wellness.',
    itemCount: 22,
    bannerImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    feePercentage: 6,
    subcategories: ['Skincare & Serums', 'Niche Fragrance', 'Haircare', 'Massage & Wellness', 'Makeup']
  },
  {
    id: 'cat-vehicles',
    name: 'Vehicles & Parts',
    slug: 'vehicles',
    iconName: 'Car',
    description: 'E-Bikes, electric scooters, motorcycle accessories, and performance parts.',
    itemCount: 19,
    bannerImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80',
    feePercentage: 4,
    subcategories: ['Electric Scooters', 'E-Bikes', 'Automotive Accessories', 'Motorcycle Gear', 'Tools & Equipment']
  },
  {
    id: 'cat-books',
    name: 'Books & Media',
    slug: 'books-media',
    iconName: 'BookOpen',
    description: 'First editions, photography monographs, design books, and indie film prints.',
    itemCount: 18,
    bannerImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    feePercentage: 5,
    subcategories: ['Art & Design Books', 'Fiction & Literature', 'First Edition Rare', 'Cookbooks', 'Graphic Novels']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-buyer-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'buyer',
    bio: 'Product designer & audio enthusiast based in Seattle. Love minimalist desk setups and mechanical watches.',
    location: 'Seattle, WA, USA',
    joinDate: 'Jan 2024',
    rating: 4.9,
    reviewCount: 16,
    verified: true,
    phone: '+1 (206) 555-0192',
    settings: {
      emailNotifications: true,
      orderUpdates: true,
      priceAlerts: true,
      marketingEmails: false,
      twoFactorAuth: true,
      currency: 'USD'
    },
    addresses: [
      {
        id: 'addr-1',
        isDefault: true,
        fullName: 'Alex Rivera',
        street: '424 Pine Street, Suite 8B',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
        phone: '+1 (206) 555-0192'
      },
      {
        id: 'addr-2',
        isDefault: false,
        fullName: 'Alex Rivera (Studio)',
        street: '1200 Westlake Ave N #400',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98109',
        country: 'United States',
        phone: '+1 (206) 555-0192'
      }
    ],
    paymentMethods: [
      {
        id: 'pm-1',
        isDefault: true,
        brand: 'Visa',
        last4: '4242',
        expiry: '10/28',
        holderName: 'Alex Rivera'
      },
      {
        id: 'pm-2',
        isDefault: false,
        brand: 'Mastercard',
        last4: '8810',
        expiry: '04/27',
        holderName: 'Alex Rivera'
      }
    ],
    balance: {
      available: 0,
      pending: 0
    },
    isSuspended: false
  },
  {
    id: 'user-seller-1',
    name: 'Elena Rostova',
    storeName: 'TechVault Pro',
    storeBanner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    email: 'elena@techvaultpro.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    role: 'seller',
    bio: 'Official premium refurbisher & boutique audio lab. Certified audiophile hardware with 1-year express warranty.',
    location: 'Austin, TX, USA',
    joinDate: 'March 2023',
    rating: 4.95,
    reviewCount: 142,
    verified: true,
    phone: '+1 (512) 555-8392',
    settings: {
      emailNotifications: true,
      orderUpdates: true,
      priceAlerts: false,
      marketingEmails: true,
      twoFactorAuth: true,
      currency: 'USD'
    },
    addresses: [
      {
        id: 'addr-seller-1',
        isDefault: true,
        fullName: 'TechVault Logistics Center',
        street: '701 Brazos St, Suite 500',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'United States',
        phone: '+1 (512) 555-8392'
      }
    ],
    paymentMethods: [
      {
        id: 'pm-seller-1',
        isDefault: true,
        brand: 'Mastercard',
        last4: '5521',
        expiry: '12/29',
        holderName: 'Elena Rostova'
      }
    ],
    balance: {
      available: 3840.50,
      pending: 690.00
    },
    isSuspended: false
  },
  {
    id: 'user-seller-2',
    name: 'Soren Lindqvist',
    storeName: 'Nordic Craft Living',
    storeBanner: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop&q=80',
    email: 'soren@nordiccraft.design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'seller',
    bio: 'Bespoke Scandinavian woodcraft, sustainable ceramics, and organic architectural lighting crafted by hand.',
    location: 'Portland, OR, USA',
    joinDate: 'August 2023',
    rating: 4.88,
    reviewCount: 89,
    verified: true,
    phone: '+1 (503) 555-0914',
    settings: {
      emailNotifications: true,
      orderUpdates: true,
      priceAlerts: false,
      marketingEmails: false,
      twoFactorAuth: true,
      currency: 'USD'
    },
    addresses: [
      {
        id: 'addr-seller-2',
        isDefault: true,
        fullName: 'Nordic Craft Studio',
        street: '1410 NW Johnson St',
        city: 'Portland',
        state: 'OR',
        postalCode: '97209',
        country: 'United States',
        phone: '+1 (503) 555-0914'
      }
    ],
    paymentMethods: [],
    balance: {
      available: 2150.00,
      pending: 480.00
    },
    isSuspended: false
  },
  {
    id: 'user-seller-3',
    name: 'Maya Lin',
    storeName: 'StreetVibe Atelier',
    storeBanner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    email: 'maya@streetvibe.co',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    role: 'seller',
    bio: 'Curated deadstock streetwear, Japanese selvedge denim, archival outerwear, and limited collector sneakers.',
    location: 'Brooklyn, NY, USA',
    joinDate: 'November 2023',
    rating: 4.92,
    reviewCount: 64,
    verified: true,
    settings: {
      emailNotifications: true,
      orderUpdates: true,
      priceAlerts: true,
      marketingEmails: false,
      twoFactorAuth: false,
      currency: 'USD'
    },
    addresses: [],
    paymentMethods: [],
    balance: {
      available: 1620.00,
      pending: 290.00
    },
    isSuspended: false
  },
  {
    id: 'user-admin-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@meridianmarket.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    bio: 'Head of Operations & Trust & Safety at Meridian Marketplace. Ensuring compliance, fair trade, and quality assurance.',
    location: 'San Francisco, CA, USA',
    joinDate: 'January 2022',
    rating: 5.0,
    reviewCount: 0,
    verified: true,
    settings: {
      emailNotifications: true,
      orderUpdates: true,
      priceAlerts: false,
      marketingEmails: false,
      twoFactorAuth: true,
      currency: 'USD'
    },
    addresses: [],
    paymentMethods: [],
    balance: {
      available: 0,
      pending: 0
    },
    isSuspended: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones (Obsidian Black)',
    description: 'Industry-leading noise cancellation powered by dual processors and 8 microphones. Ultra-comfortable lightweight design with soft fit leather. Up to 30 hours battery life with quick charging (3 min charge for 3 hours playback). Includes original magnetic carry case, gold-plated 3.5mm cable, and USB-C fast charger.',
    price: 329.99,
    originalPrice: 399.99,
    categoryId: 'cat-electronics',
    subcategory: 'Audio & Headphones',
    condition: 'like_new',
    location: 'Austin, TX',
    stock: 7,
    soldCount: 43,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-1', name: 'Free Standard Ground (3-5 Days)', price: 0, estimatedDays: '3-5 business days', isFree: true },
      { id: 'ship-2', name: 'FedEx 2-Day Air Express', price: 14.50, estimatedDays: '2 business days' },
      { id: 'ship-3', name: 'Local Austin Pickup (Same Day)', price: 0, estimatedDays: 'Today', isFree: true }
    ],
    tags: ['Sony', 'Wireless', 'ANC', 'Hi-Res Audio', 'Bluetooth 5.2'],
    status: 'active',
    createdAt: '2026-07-28T14:32:00Z',
    updatedAt: '2026-08-01T10:15:00Z',
    featured: true,
    views: 1420,
    rating: 4.9,
    reviewCount: 38,
    specifications: [
      { name: 'Driver Unit', value: '30mm, dome type (CCAW Voice coil)' },
      { name: 'Frequency Response', value: '4 Hz - 40,000 Hz' },
      { name: 'Battery Life', value: '30 Hours (ANC ON), 40 Hours (ANC OFF)' },
      { name: 'Weight', value: '250 grams' },
      { name: 'Connectivity', value: 'Bluetooth 5.2, LDAC, AAC, SBC, 3.5mm Jack' }
    ],
    deliveryInfo: 'Ships within 24 hours. Includes 30-day money-back guarantee.'
  },
  {
    id: 'prod-2',
    sellerId: 'user-seller-2',
    sellerName: 'Nordic Craft Living',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.88,
    sellerVerified: true,
    title: 'Solid American Walnut Minimalist Lounge Chair with Bouclé Cushion',
    description: 'Sculpted from FSC-certified solid American walnut, hand-finished with natural Danish linseed oil. The ergonomic backrest angle pairs with an ultra-plush premium ivory bouclé cushion with high-resilience foam core. Ideal for reading nooks, modern living rooms, or executive offices.',
    price: 649.00,
    originalPrice: 780.00,
    categoryId: 'cat-home',
    subcategory: 'Furniture',
    condition: 'brand_new',
    location: 'Portland, OR',
    stock: 4,
    soldCount: 19,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-home-1', name: 'White Glove Freight Delivery', price: 49.00, estimatedDays: '5-8 business days' },
      { id: 'ship-home-2', name: 'Portland Studio Pickup', price: 0, estimatedDays: 'Next business day', isFree: true }
    ],
    tags: ['Walnut', 'Mid-Century', 'Handcrafted', 'Bouclé', 'Nordic Design'],
    status: 'active',
    createdAt: '2026-07-15T09:20:00Z',
    updatedAt: '2026-08-04T16:00:00Z',
    featured: true,
    views: 2190,
    rating: 5.0,
    reviewCount: 14,
    specifications: [
      { name: 'Dimensions', value: '31"W x 33"D x 30"H' },
      { name: 'Seat Height', value: '16.5 inches' },
      { name: 'Wood Finish', value: 'Natural Matte Danish Oil' },
      { name: 'Fabric', value: 'High-wear textured Bouclé (100% Wool blend)' },
      { name: 'Assembly', value: 'Fully assembled' }
    ]
  },
  {
    id: 'prod-3',
    sellerId: 'user-seller-3',
    sellerName: 'StreetVibe Atelier',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.92,
    sellerVerified: true,
    title: 'Vintage 1994 Type III Japanese Selvedge Denim Jacket (14.5oz Indigo)',
    description: 'Rare deadstock Japanese Kurabo mill raw denim jacket with custom brass donut buttons, double-needle contrast stitching, and deep natural indigo hue. Never washed, zero shrinkage loss. Beautiful crisp hand-feel that will develop breathtaking electric blue fades with wear.',
    price: 245.00,
    originalPrice: 320.00,
    categoryId: 'cat-fashion',
    subcategory: 'Men\'s Clothing',
    condition: 'like_new',
    location: 'Brooklyn, NY',
    stock: 2,
    soldCount: 8,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-fashion-1', name: 'USPS Priority Insured', price: 9.50, estimatedDays: '2-4 business days' },
      { id: 'ship-fashion-2', name: 'UPS Next Day Air Saver', price: 24.00, estimatedDays: '1 business day' }
    ],
    tags: ['Vintage', 'Selvedge Denim', 'Japanese Denim', 'Streetwear', 'Raw Indigo'],
    status: 'active',
    createdAt: '2026-08-01T11:45:00Z',
    updatedAt: '2026-08-05T08:30:00Z',
    featured: true,
    views: 980,
    rating: 4.9,
    reviewCount: 9,
    specifications: [
      { name: 'Size', value: 'Medium (Chest: 40", Length: 25.5")' },
      { name: 'Fabric Weight', value: '14.5 oz Raw Rigid Selvedge' },
      { name: 'Country of Origin', value: 'Okayama, Japan' },
      { name: 'Hardware', value: 'Solid Antiqued Brass' }
    ]
  },
  {
    id: 'prod-4',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Apple MacBook Pro 14" M3 Pro (18GB RAM / 512GB SSD / Space Black)',
    description: 'Mint condition powerhouse. Battery health at 99% (only 24 cycles). Includes original 70W MagSafe 3 power adapter, braided black USB-C cable, and factory box. Flawless Liquid Retina XDR screen with zero dead pixels or keyboard marks. Clean iCloud signout and AppleCare warranty active until Nov 2027.',
    price: 1649.00,
    originalPrice: 1999.00,
    categoryId: 'cat-electronics',
    subcategory: 'Laptops & Computers',
    condition: 'like_new',
    location: 'Austin, TX',
    stock: 3,
    soldCount: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-mb-1', name: 'Free Insured FedEx 2-Day Air', price: 0, estimatedDays: '2 business days', isFree: true },
      { id: 'ship-mb-2', name: 'Overnight Priority with Signature', price: 29.00, estimatedDays: '1 business day' }
    ],
    tags: ['Apple', 'MacBook Pro', 'M3 Pro', 'Space Black', 'Laptops'],
    status: 'active',
    createdAt: '2026-08-02T16:10:00Z',
    updatedAt: '2026-08-06T12:00:00Z',
    featured: true,
    views: 3410,
    rating: 4.95,
    reviewCount: 22,
    specifications: [
      { name: 'Processor', value: 'Apple M3 Pro (11-core CPU, 14-core GPU)' },
      { name: 'Unified Memory', value: '18GB' },
      { name: 'Storage', value: '512GB Fast PCIe NVMe SSD' },
      { name: 'Display', value: '14.2" Liquid Retina XDR (3024x1964 @ 120Hz)' },
      { name: 'Ports', value: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3' }
    ]
  },
  {
    id: 'prod-5',
    sellerId: 'user-seller-2',
    sellerName: 'Nordic Craft Living',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.88,
    sellerVerified: true,
    title: 'Artisan Ceramic Table Lamp with Pleated Linen Shade (Stone Matte Finish)',
    description: 'Wheel-thrown stoneware lamp base glazed in an earthy warm-white speckled matte ceramic. Finished with a warm pleated flax linen lampshade that casts gentle ambient light. Equipped with solid brass turn-knob dimmer switch and 6ft woven cotton cord.',
    price: 185.00,
    originalPrice: 220.00,
    categoryId: 'cat-home',
    subcategory: 'Lighting & Lamps',
    condition: 'brand_new',
    location: 'Portland, OR',
    stock: 8,
    soldCount: 31,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-lamp-1', name: 'Carefully Padded Standard Parcel', price: 12.00, estimatedDays: '3-5 business days' }
    ],
    tags: ['Ceramics', 'Table Lamp', 'Linen', 'Lighting', 'Warm White'],
    status: 'active',
    createdAt: '2026-07-20T10:00:00Z',
    updatedAt: '2026-08-03T14:30:00Z',
    featured: false,
    views: 870,
    rating: 4.8,
    reviewCount: 16,
    specifications: [
      { name: 'Height', value: '18.5 inches' },
      { name: 'Base Diameter', value: '8 inches' },
      { name: 'Bulb Socket', value: 'Standard E26 Medium (Dimmable Warm LED included)' },
      { name: 'Voltage', value: '110-240V compatible' }
    ]
  },
  {
    id: 'prod-6',
    sellerId: 'user-seller-3',
    sellerName: 'StreetVibe Atelier',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.92,
    sellerVerified: true,
    title: 'Original Leica M6 Classic Rangefinder 35mm Film Camera (Black Chrome)',
    description: 'Iconic mechanical 35mm rangefinder camera in exceptional cosmetic and operational condition. Shutter speeds calibrated on factory tester; rangefinder patch bright and accurately aligned. Clear viewfinder without fungus or haze. Comes with body cap and authentic leather neck strap.',
    price: 2890.00,
    originalPrice: 3200.00,
    categoryId: 'cat-collectibles',
    subcategory: 'Cameras & Collectibles',
    condition: 'good',
    location: 'Brooklyn, NY',
    stock: 1,
    soldCount: 3,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-leica-1', name: 'Armored Courier Overnight with Signature', price: 35.00, estimatedDays: '1 business day' }
    ],
    tags: ['Leica', 'Rangefinder', '35mm Film', 'Vintage Camera', 'Photography'],
    status: 'active',
    createdAt: '2026-08-03T19:20:00Z',
    updatedAt: '2026-08-07T11:00:00Z',
    featured: true,
    views: 4120,
    rating: 5.0,
    reviewCount: 7,
    specifications: [
      { name: 'Format', value: '35mm Film' },
      { name: 'Lens Mount', value: 'Leica M Mount' },
      { name: 'Shutter Speeds', value: '1s to 1/1000s + Bulb' },
      { name: 'Light Meter', value: 'TTL Silicon Photocell (tested accurate)' }
    ]
  },
  {
    id: 'prod-7',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Custom Gasket-Mount Mechanical Keyboard (Brass Plate / Lubed Holy Pandas)',
    description: 'Hand-tuned custom 75% mechanical keyboard featuring CNC anodized aerospace aluminum case, FR4 and brass dual plates, lubed TriboSys 3203 tactile switches, and dye-sub PBT keycaps. Multi-layer poron foam acoustic dampening provides a deep, creamy typing sound profile.',
    price: 260.00,
    originalPrice: 310.00,
    categoryId: 'cat-electronics',
    subcategory: 'Laptops & Computers',
    condition: 'brand_new',
    location: 'Austin, TX',
    stock: 5,
    soldCount: 26,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-kb-1', name: 'Standard Priority Courier', price: 9.00, estimatedDays: '3-4 business days' },
      { id: 'ship-kb-2', name: 'Free Pickup in Austin', price: 0, estimatedDays: 'Same day', isFree: true }
    ],
    tags: ['Mechanical Keyboard', 'Custom Keycaps', 'Holy Panda', 'Gasket Mount', 'Tech'],
    status: 'active',
    createdAt: '2026-07-30T15:00:00Z',
    updatedAt: '2026-08-08T09:00:00Z',
    featured: false,
    views: 1650,
    rating: 4.9,
    reviewCount: 21,
    specifications: [
      { name: 'Layout', value: '75% Compact (82 Keys)' },
      { name: 'Switches', value: 'Holy Panda Tactile (Hand-lubed + filmed)' },
      { name: 'Connectivity', value: 'Type-C Detachable Braided Cable' },
      { name: 'RGB', value: 'South-facing Per-key RGB with VIA/QMK support' }
    ]
  },
  {
    id: 'prod-8',
    sellerId: 'user-seller-3',
    sellerName: 'StreetVibe Atelier',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.92,
    sellerVerified: true,
    title: 'Heritage Full-Grain Leather Weekender Duffel Bag (Chestnut Brown)',
    description: 'Crafted from 5oz vegetable-tanned Italian bridle leather that develops a rich, personal patina over years of travel. Features solid copper hand-hammered rivets, heavy-duty YKK Excella two-way brass zipper, padded detachable shoulder strap, and waterproof cotton twill lining with internal shoe compartment.',
    price: 340.00,
    originalPrice: 425.00,
    categoryId: 'cat-fashion',
    subcategory: 'Bags & Luggage',
    condition: 'brand_new',
    location: 'Brooklyn, NY',
    stock: 6,
    soldCount: 38,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-bag-1', name: 'Free Standard Shipping', price: 0, estimatedDays: '4-6 business days', isFree: true },
      { id: 'ship-bag-2', name: 'Express Insured Air', price: 18.00, estimatedDays: '2 business days' }
    ],
    tags: ['Leather Bag', 'Travel', 'Weekender', 'Handmade', 'Full-Grain'],
    status: 'active',
    createdAt: '2026-07-22T08:15:00Z',
    updatedAt: '2026-08-02T13:40:00Z',
    featured: true,
    views: 1840,
    rating: 4.9,
    reviewCount: 33,
    specifications: [
      { name: 'Capacity', value: '42 Liters (Airline Carry-On Compliant)' },
      { name: 'Dimensions', value: '20"L x 11.5"H x 10"D' },
      { name: 'Leather Type', value: 'Full-Grain Tuscan Veg-Tan' },
      { name: 'Hardware', value: 'Solid Cast Antiqued Brass' }
    ]
  },
  {
    id: 'prod-9',
    sellerId: 'user-seller-2',
    sellerName: 'Nordic Craft Living',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.88,
    sellerVerified: true,
    title: 'Handmade Japanese Cast Iron Tetsubin Teapot & Matcha Bowl Set',
    description: 'Traditional Nanbu Tekki iron teapot crafted by master artisans in Iwate, Japan. Features internal enamel coating to prevent oxidation and optimize heat retention. Accompanied by two hand-pinched Tenmoku glaze matcha ceramic cups and a handcrafted bamboo whisk.',
    price: 135.00,
    originalPrice: 165.00,
    categoryId: 'cat-home',
    subcategory: 'Kitchen & Dining',
    condition: 'brand_new',
    location: 'Portland, OR',
    stock: 12,
    soldCount: 45,
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-tea-1', name: 'Careful Fragile Shipping', price: 8.50, estimatedDays: '3-5 business days' }
    ],
    tags: ['Teapot', 'Cast Iron', 'Matcha', 'Japanese Craft', 'Ceramics'],
    status: 'active',
    createdAt: '2026-07-18T13:10:00Z',
    updatedAt: '2026-08-01T17:00:00Z',
    featured: false,
    views: 1210,
    rating: 4.95,
    reviewCount: 29,
    specifications: [
      { name: 'Teapot Volume', value: '900ml (30 oz)' },
      { name: 'Material', value: 'High-purity Cast Iron + Porcelain Enamel' },
      { name: 'Includes', value: 'Teapot, SS Infuser, 2 Tea Cups, Trivet' }
    ]
  },
  {
    id: 'prod-10',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.95,
    sellerVerified: true,
    title: 'Fujifilm X100V Compact Mirrorless Camera (Silver Edition + Lens Hood)',
    description: 'Beloved everyday carry camera featuring 26.1MP X-Trans CMOS 4 sensor, redesigned 23mm F2 sharp pancake lens, two-way tilting touchscreen, and legendary film simulations including Classic Negative. Very low shutter count (only 1,840 actuations). Weather-sealed filter ring attached.',
    price: 1540.00,
    originalPrice: 1699.00,
    categoryId: 'cat-electronics',
    subcategory: 'Cameras & Video',
    condition: 'like_new',
    location: 'Austin, TX',
    stock: 2,
    soldCount: 9,
    images: [
      'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-fuji-1', name: 'Free Insured Express', price: 0, estimatedDays: '2 business days', isFree: true }
    ],
    tags: ['Fujifilm', 'X100V', 'Street Photography', 'Film Simulation', 'Mirrorless'],
    status: 'active',
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-08-09T18:00:00Z',
    featured: true,
    views: 5200,
    rating: 5.0,
    reviewCount: 18,
    specifications: [
      { name: 'Sensor', value: '26.1MP APS-C X-Trans CMOS 4' },
      { name: 'Lens', value: 'Fujinon 23mm f/2.0 II (35mm equivalent)' },
      { name: 'Video', value: '4K/30p and F-Log internal' },
      { name: 'Viewfinder', value: 'Advanced Hybrid OVF/EVF (3.69m-dot OLED)' }
    ]
  },
  {
    id: 'prod-11',
    sellerId: 'user-seller-3',
    sellerName: 'StreetVibe Atelier',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.92,
    sellerVerified: true,
    title: 'Seiko Prospex "Alpinist" Automatic Watch (Sunburst Green Dial / SPB121)',
    description: 'Iconic adventure timepiece with emerald green sunbeam dial, gold cathedral hands, internal rotating compass bezel, and sapphire crystal with cyclops date magnifier. Powered by Seiko caliber 6R35 automatic movement with robust 70-hour power reserve. Paired with brown alligator leather deployant strap.',
    price: 595.00,
    originalPrice: 725.00,
    categoryId: 'cat-fashion',
    subcategory: 'Watches & Jewelry',
    condition: 'brand_new',
    location: 'Brooklyn, NY',
    stock: 4,
    soldCount: 14,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-seiko-1', name: 'Free Signature Tracked Express', price: 0, estimatedDays: '2-3 business days', isFree: true }
    ],
    tags: ['Seiko', 'Alpinist', 'Automatic Watch', 'Luxury Watch', 'Horology'],
    status: 'active',
    createdAt: '2026-07-25T11:20:00Z',
    updatedAt: '2026-08-04T10:10:00Z',
    featured: true,
    views: 2980,
    rating: 4.95,
    reviewCount: 25,
    specifications: [
      { name: 'Case Diameter', value: '39.5mm' },
      { name: 'Thickness', value: '13.2mm' },
      { name: 'Water Resistance', value: '200 Meters (20 bar)' },
      { name: 'Movement', value: 'Seiko 6R35 (24 Jewels, 70hr reserve)' }
    ]
  },
  {
    id: 'prod-12',
    sellerId: 'user-seller-2',
    sellerName: 'Nordic Craft Living',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    sellerRating: 4.88,
    sellerVerified: true,
    title: 'Super73-S2 High Performance Electric Adventure Motorbike (Hudson Blue)',
    description: 'Aircraft-grade aluminum alloy frame with inverted coil-spring suspension fork and custom BDGR all-terrain tires. Driven by multi-class ride mode 2000W peak motor and 960 watt-hour removable battery delivering 40-75+ miles of range. Includes integrated bright LED halo headlight and brake lights.',
    price: 2499.00,
    originalPrice: 2895.00,
    categoryId: 'cat-vehicles',
    subcategory: 'E-Bikes',
    condition: 'like_new',
    location: 'Portland, OR',
    stock: 2,
    soldCount: 5,
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=900&auto=format&fit=crop&q=80'
    ],
    shippingOptions: [
      { id: 'ship-bike-1', name: 'Freight Pallet Shipping', price: 95.00, estimatedDays: '5-7 business days' },
      { id: 'ship-bike-2', name: 'Free Local Pickup', price: 0, estimatedDays: 'Tomorrow', isFree: true }
    ],
    tags: ['E-Bike', 'Super73', 'Electric Vehicle', 'Adventure', 'Commuter'],
    status: 'active',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-06T15:00:00Z',
    featured: false,
    views: 3100,
    rating: 4.8,
    reviewCount: 11,
    specifications: [
      { name: 'Top Speed', value: 'Class 1-3 & Unlimited Off-Road (28+ MPH)' },
      { name: 'Battery Range', value: '40-75 miles depending on pedal assist' },
      { name: 'Brakes', value: 'Tektro Hydraulic 2-Piston Disc Brakes' },
      { name: 'Weight Capacity', value: '325 lbs' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-9842',
    buyerId: 'user-buyer-1',
    buyerName: 'Alex Rivera',
    buyerEmail: 'alex.rivera@example.com',
    sellerId: 'user-seller-1',
    sellerName: 'TechVault Pro',
    items: [
      {
        productId: 'prod-1',
        title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones (Obsidian Black)',
        price: 329.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80',
        sellerId: 'user-seller-1',
        sellerName: 'TechVault Pro',
        shippingOptionName: 'Free Standard Ground',
        shippingPrice: 0
      }
    ],
    subtotal: 329.99,
    shippingFee: 0,
    tax: 26.40,
    discount: 0,
    total: 356.39,
    shippingAddress: {
      fullName: 'Alex Rivera',
      street: '424 Pine Street, Suite 8B',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
      phone: '+1 (206) 555-0192'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242'
    },
    status: 'delivered',
    trackingNumber: 'FDX-994182941',
    carrier: 'FedEx',
    createdAt: '2026-08-05T14:20:00Z',
    estimatedDelivery: '2026-08-08',
    statusHistory: [
      { status: 'pending_payment', timestamp: '2026-08-05T14:20:00Z', note: 'Payment verified with Stripe' },
      { status: 'processing', timestamp: '2026-08-05T16:00:00Z', note: 'Packed at Austin Warehouse' },
      { status: 'shipped', timestamp: '2026-08-06T09:30:00Z', note: 'Handed off to FedEx Express' },
      { status: 'out_for_delivery', timestamp: '2026-08-08T08:15:00Z', note: 'On delivery vehicle in Seattle' },
      { status: 'delivered', timestamp: '2026-08-08T13:42:00Z', note: 'Delivered to front door / mailroom' }
    ],
    canReview: true
  },
  {
    id: 'ord-9843',
    buyerId: 'user-buyer-1',
    buyerName: 'Alex Rivera',
    buyerEmail: 'alex.rivera@example.com',
    sellerId: 'user-seller-2',
    sellerName: 'Nordic Craft Living',
    items: [
      {
        productId: 'prod-5',
        title: 'Artisan Ceramic Table Lamp with Pleated Linen Shade',
        price: 185.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80',
        sellerId: 'user-seller-2',
        sellerName: 'Nordic Craft Living',
        shippingOptionName: 'Standard Parcel',
        shippingPrice: 12.00
      }
    ],
    subtotal: 185.00,
    shippingFee: 12.00,
    tax: 14.80,
    discount: 15.00,
    couponCode: 'MERIDIAN15',
    total: 196.80,
    shippingAddress: {
      fullName: 'Alex Rivera',
      street: '424 Pine Street, Suite 8B',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'United States',
      phone: '+1 (206) 555-0192'
    },
    paymentMethod: {
      type: 'card',
      brand: 'Visa',
      last4: '4242'
    },
    status: 'shipped',
    trackingNumber: 'UPS-748192048',
    carrier: 'UPS Ground',
    createdAt: '2026-08-11T10:15:00Z',
    estimatedDelivery: '2026-08-16',
    statusHistory: [
      { status: 'pending_payment', timestamp: '2026-08-11T10:15:00Z', note: 'Payment processed' },
      { status: 'processing', timestamp: '2026-08-11T14:00:00Z', note: 'Inspected and padded' },
      { status: 'shipped', timestamp: '2026-08-12T11:00:00Z', note: 'En route via UPS Hub Portland' }
    ],
    canReview: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productTitle: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80',
    sellerId: 'user-seller-1',
    buyerId: 'user-buyer-1',
    buyerName: 'Alex Rivera',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Pristine condition, fast shipping!',
    comment: 'Described as like-new and it genuinely looks brand new right out of the box. ANC is unmatched for work focus. Seller shipped within 4 hours. Highly recommended!',
    verifiedPurchase: true,
    createdAt: '2026-08-09T15:30:00Z',
    helpfulVotes: 14,
    sellerResponse: {
      comment: 'Thank you so much Alex! Enjoy the crystal-clear sound and reach out anytime if you need tuning tips.',
      createdAt: '2026-08-09T18:10:00Z'
    }
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productTitle: 'Solid American Walnut Minimalist Lounge Chair',
    productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&auto=format&fit=crop&q=80',
    sellerId: 'user-seller-2',
    buyerId: 'user-buyer-3',
    buyerName: 'Claire Dupont',
    buyerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Museum-quality woodwork in our living room',
    comment: 'The grain on this walnut chair is stunning. The bouclé fabric is heavy and soft. Soren was very helpful answering dimension questions prior to purchase.',
    verifiedPurchase: true,
    createdAt: '2026-08-02T19:00:00Z',
    helpfulVotes: 21
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    productTitle: 'Apple MacBook Pro 14" M3 Pro',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80',
    sellerId: 'user-seller-1',
    buyerId: 'user-buyer-4',
    buyerName: 'David Chen',
    buyerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Saved hundreds over retail, works flawlessly',
    comment: 'Fast benchmark tests and zero thermal throttling. Battery cycle count matched the listing description precisely.',
    verifiedPurchase: true,
    createdAt: '2026-08-04T11:20:00Z',
    helpfulVotes: 8
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participants: ['user-buyer-1', 'user-seller-1'],
    participantDetails: {
      'user-buyer-1': {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'buyer',
        isOnline: true
      },
      'user-seller-1': {
        name: 'Elena Rostova',
        storeName: 'TechVault Pro',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        role: 'seller',
        isOnline: true
      }
    },
    lastMessage: 'Great! The headphones have been packaged securely with extra bubble wrap.',
    lastMessageTimestamp: '2026-08-05T15:10:00Z',
    unreadCount: {
      'user-buyer-1': 0,
      'user-seller-1': 0
    },
    relatedProductId: 'prod-1',
    relatedProductTitle: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    relatedProductImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'conv-2',
    participants: ['user-buyer-1', 'user-seller-2'],
    participantDetails: {
      'user-buyer-1': {
        name: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        role: 'buyer',
        isOnline: true
      },
      'user-seller-2': {
        name: 'Soren Lindqvist',
        storeName: 'Nordic Craft Living',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        role: 'seller',
        isOnline: false
      }
    },
    lastMessage: 'Is the American Walnut chair available for studio pickup in Portland this weekend?',
    lastMessageTimestamp: '2026-08-13T18:24:00Z',
    unreadCount: {
      'user-buyer-1': 0,
      'user-seller-2': 1
    },
    relatedProductId: 'prod-2',
    relatedProductTitle: 'Solid American Walnut Minimalist Lounge Chair',
    relatedProductImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-buyer-1',
    receiverId: 'user-seller-1',
    text: 'Hi Elena! Does the Sony XM5 come with the original audio jack cable for airplane use?',
    timestamp: '2026-08-05T14:45:00Z',
    isRead: true,
    attachmentProduct: {
      id: 'prod-1',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      price: 329.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-seller-1',
    receiverId: 'user-buyer-1',
    text: 'Hello Alex! Yes absolutely, it includes the original gold-plated 3.5mm cable as well as the magnetic zip case.',
    timestamp: '2026-08-05T14:52:00Z',
    isRead: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-seller-1',
    receiverId: 'user-buyer-1',
    text: 'Great! The headphones have been packaged securely with extra bubble wrap.',
    timestamp: '2026-08-05T15:10:00Z',
    isRead: true
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'user-buyer-1',
    receiverId: 'user-seller-2',
    text: 'Hi Soren, is the American Walnut chair available for studio pickup in Portland this weekend?',
    timestamp: '2026-08-13T18:24:00Z',
    isRead: false,
    attachmentProduct: {
      id: 'prod-2',
      title: 'Solid American Walnut Lounge Chair',
      price: 649.00,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&auto=format&fit=crop&q=80'
    }
  }
];

export const INITIAL_REPORTS: PlatformReport[] = [
  {
    id: 'rep-1',
    reporterId: 'user-buyer-1',
    reporterName: 'Alex Rivera',
    targetType: 'product',
    targetId: 'prod-sample-suspicious',
    targetTitle: 'Suspicious duplicate listing in electronics',
    reason: 'Possible counterfeit item',
    details: 'Price was significantly below market average with missing serial number details.',
    status: 'pending',
    createdAt: '2026-08-10T11:00:00Z'
  }
];
