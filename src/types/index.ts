export type UserRole = 'buyer' | 'seller' | 'admin';

export type ProductCondition = 'brand_new' | 'like_new' | 'good' | 'fair' | 'refurbished';

export type ListingStatus = 'active' | 'draft' | 'paused' | 'sold' | 'inactive';
export type ProductStatus = ListingStatus;

export interface ShippingAddress {
  fullName: string;
  street?: string;
  streetAddress?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentDetails {
  type?: 'card' | 'apple_pay' | 'google_pay' | string;
  method?: string;
  brand?: string;
  last4?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  timestamp?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface UserSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  currency: string;
}

export interface UserAddress {
  id: string;
  isDefault: boolean;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface UserPaymentMethod {
  id: string;
  isDefault: boolean;
  brand: string;
  last4: string;
  expiry: string;
  holderName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  location: string;
  joinDate: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone?: string;
  storeName?: string;
  storeBanner?: string;
  settings: UserSettings;
  addresses: UserAddress[];
  paymentMethods: UserPaymentMethod[];
  balance: {
    available: number;
    pending: number;
  };
  isSuspended: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  isFree?: boolean;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified: boolean;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  subcategory: string;
  condition: ProductCondition;
  location: string;
  stock: number;
  soldCount: number;
  images: string[];
  shippingOptions: ShippingOption[];
  tags: string[];
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  specifications: ProductSpecification[];
  deliveryInfo?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  itemCount: number;
  bannerImage: string;
  feePercentage: number;
  subcategories: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedShippingId: string;
  product: Product;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  sellerName: string;
  shippingOptionName: string;
  shippingPrice: number;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  couponCode?: string;
  total: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: {
    type: 'card' | 'apple_pay' | 'google_pay';
    brand: string;
    last4: string;
  };
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  estimatedDelivery: string;
  statusHistory: OrderStatusHistoryItem[];
  canReview: boolean;
  refundReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulVotes: number;
  sellerResponse?: {
    comment: string;
    createdAt: string;
  };
}

export interface MessageOffer {
  amount: number;
  status: 'pending' | 'accepted' | 'declined';
}

export interface MessageProductAttachment {
  id: string;
  title: string;
  price: number;
  image: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentProduct?: MessageProductAttachment;
  offer?: MessageOffer;
}

export interface ConversationParticipant {
  name: string;
  avatar: string;
  role: UserRole;
  isOnline: boolean;
  storeName?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, ConversationParticipant>;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: Record<string, number>;
  relatedProductId?: string;
  relatedProductTitle?: string;
  relatedProductImage?: string;
}

export interface PlatformReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'product' | 'user' | 'message';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface FilterState {
  searchQuery: string;
  categoryId: string;
  subcategory: string;
  minPrice: number;
  maxPrice: number;
  conditions: ProductCondition[];
  location: string;
  minRating: number;
  freeShippingOnly: boolean;
  inStockOnly: boolean;
  sortBy: 'relevance' | 'newest' | 'price_low' | 'price_high' | 'popularity' | 'rating';
}
