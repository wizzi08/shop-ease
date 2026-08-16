import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Category,
  Conversation,
  FilterState,
  ListingStatus,
  Message,
  Order,
  OrderStatus,
  PlatformReport,
  Product,
  ProductCondition,
  Review,
  ShippingOption,
  User,
  UserAddress,
  UserSettings
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REPORTS,
  INITIAL_REVIEWS,
  INITIAL_USERS
} from '../data/mockData';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  sendPasswordResetEmail,
  trackEvent,
  testFirestoreConnection,
  firebaseConfig,
  setDoc,
  doc
} from '../lib/firebase';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface MarketplaceContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Firebase
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  domainAuthError: string | null;
  clearDomainAuthError: () => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string, userData: Partial<User>, role: 'buyer' | 'seller') => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<boolean>;

  // Auth / Current User
  currentUser: User | null;
  users: User[];
  login: (email: string, password?: string) => boolean;
  signup: (userData: Partial<User>, role: 'buyer' | 'seller') => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Products
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'rating' | 'reviewCount' | 'soldCount'>) => string;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string, status: ListingStatus) => void;
  getProduct: (id: string) => Product | undefined;
  incrementProductViews: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'itemCount'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedShippingId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartShipping: (productId: string, shippingId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    items: { product: Product; quantity: number; shippingOption: ShippingOption }[];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    couponCode?: string;
    discount?: number;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingInfo?: { carrier?: string; trackingNumber?: string; note?: string }) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  requestRefund: (orderId: string, reason: string) => void;
  getOrder: (orderId: string) => Order | undefined;

  // Reviews
  reviews: Review[];
  addReview: (reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
  voteReviewHelpful: (reviewId: string) => void;
  replyToReview: (reviewId: string, comment: string) => void;

  // Messages
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (
    conversationId: string,
    text: string,
    attachmentProduct?: { id: string; title: string; price: number; image: string },
    offer?: { amount: number; status: 'pending' | 'accepted' | 'declined' }
  ) => void;
  startConversationWithSeller: (sellerId: string, initialMessage: string, product?: Product) => string;
  markConversationAsRead: (conversationId: string) => void;
  respondToOffer: (messageId: string, action: 'accepted' | 'declined') => void;
  unreadMessagesCount: number;

  // Admin Moderation
  reports: PlatformReport[];
  createReport: (reportData: Omit<PlatformReport, 'id' | 'createdAt' | 'status'>) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;
  toggleUserSuspension: (userId: string) => void;
  toggleUserVerification: (userId: string) => void;
  toggleFeaturedProduct: (productId: string) => void;

  // Search & Navigation Filters
  activeFilter: FilterState;
  setFilter: (updates: Partial<FilterState>) => void;
  resetFilter: () => void;

  // Active View / Page routing
  currentView: string;
  currentViewParams: Record<string, any>;
  navigate: (view: string, params?: Record<string, any>) => void;

  // Modals & Notifications
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot_password';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot_password') => void;
  closeAuthModal: () => void;
  toasts: ToastNotification[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Reset to initial demo data
  resetToDefaultData: () => void;
}

const defaultFilter: FilterState = {
  searchQuery: '',
  categoryId: 'all',
  subcategory: 'all',
  minPrice: 0,
  maxPrice: 5000,
  conditions: [],
  location: '',
  minRating: 0,
  freeShippingOnly: false,
  inStockOnly: false,
  sortBy: 'relevance'
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('meridian_theme');
    return saved ? saved === 'dark' : false;
  });

  // Apply dark mode class to root HTML and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('meridian_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('meridian_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // Core Data States with localStorage persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('meridian_users');
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        // Exclude hardcoded legacy default demo users
        return parsed.filter(u => !u.id.startsWith('user-buyer-') && !u.id.startsWith('user-seller-') && !u.id.startsWith('user-admin-'));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem('meridian_current_user_id');
    if (saved && !saved.startsWith('user-buyer-') && !saved.startsWith('user-seller-') && !saved.startsWith('user-admin-')) {
      return saved;
    }
    return null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('meridian_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('meridian_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('meridian_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('meridian_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('meridian_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('meridian_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('meridian_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('meridian_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [reports, setReports] = useState<PlatformReport[]>(() => {
    const saved = localStorage.getItem('meridian_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Navigation / View state
  const [currentView, setCurrentView] = useState<string>(() => {
    const savedUserId = localStorage.getItem('meridian_current_user_id');
    if (savedUserId && !savedUserId.startsWith('user-buyer-') && !savedUserId.startsWith('user-seller-') && !savedUserId.startsWith('user-admin-')) {
      return 'home';
    }
    return 'welcome-auth';
  });
  const [currentViewParams, setCurrentViewParams] = useState<Record<string, any>>({});

  // Filter state
  const [activeFilter, setActiveFilter] = useState<FilterState>(defaultFilter);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');

  // Firebase connection state
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
  const firebaseProjectId = firebaseConfig.projectId;

  // Check Firebase connection and listen to Auth state changes
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsFirebaseConnected(connected);
    });

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const existing = users.find(
          u => u.id === fbUser.uid || u.email.toLowerCase() === (fbUser.email || '').toLowerCase()
        );
        if (existing) {
          setCurrentUserId(existing.id);
        } else {
          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Firebase User',
            email: fbUser.email || `${fbUser.uid}@shop-net.com`,
            avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
            role: 'buyer',
            location: 'United States',
            joinDate: 'Just now',
            rating: 5.0,
            reviewCount: 0,
            verified: fbUser.emailVerified || true,
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
            balance: { available: 0, pending: 0 },
            isSuspended: false
          };
          setUsers(prev => [...prev, newUser]);
          setCurrentUserId(newUser.id);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('meridian_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUserId) localStorage.setItem('meridian_current_user_id', currentUserId);
    else localStorage.removeItem('meridian_current_user_id');
  }, [currentUserId]);
  useEffect(() => { localStorage.setItem('meridian_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('meridian_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('meridian_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('meridian_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('meridian_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('meridian_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('meridian_conversations', JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { localStorage.setItem('meridian_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('meridian_reports', JSON.stringify(reports)); }, [reports]);

  // Current User Object
  const currentUser = users.find(u => u.id === currentUserId) || null;

  // Toast Helpers
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigation
  const navigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setCurrentViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Functions
  const [domainAuthError, setDomainAuthError] = useState<string | null>(null);

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      setDomainAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      trackEvent('login', { method: 'google' });
      addToast('success', 'Google Sign-In Successful', `Welcome, ${fbUser.displayName || 'User'}! Connected via Firebase.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      if (error?.code === 'auth/unauthorized-domain' || error?.message?.includes('unauthorized-domain')) {
        const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setDomainAuthError(currentHostname);
        addToast(
          'warning',
          'Domain Authorization Needed',
          `Google Sign-In requires adding "${currentHostname}" to your Firebase Console Authorized Domains. You can use Email/Password to sign in or register instantly!`
        );
      } else if (error?.code === 'auth/popup-closed-by-user') {
        addToast('info', 'Sign-In Cancelled', 'The Google sign-in window was closed.');
      } else {
        addToast('error', 'Google Sign-In Error', error.message || 'Failed to authenticate with Google');
      }
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      trackEvent('login', { method: 'email' });
      setIsAuthModalOpen(false);
      addToast('success', 'Firebase Sign-In', `Logged in via Firebase Auth!`);
      return true;
    } catch (error: any) {
      console.warn('Firebase email login fallback to local profile:', error.message);
      return login(email, pass);
    }
  };

  const signupWithEmail = async (email: string, pass: string, userData: Partial<User>, role: 'buyer' | 'seller'): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (userData.name) {
        await fbUpdateProfile(result.user, { displayName: userData.name });
      }
      trackEvent('sign_up', { method: 'email', role });
      signup(userData, role);
      setIsAuthModalOpen(false);
      addToast('success', 'Account Created', `Firebase account registered for ${userData.name || email}!`);
      return true;
    } catch (error: any) {
      console.warn('Firebase email signup fallback to local profile:', error.message);
      return signup(userData, role);
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      addToast('success', 'Reset Link Dispatched', `Firebase password recovery email sent to ${email}.`);
      setIsAuthModalOpen(false);
      return true;
    } catch (error: any) {
      addToast('info', 'Password Reset', `Password reset instructions initiated for ${email}.`);
      setIsAuthModalOpen(false);
      return true;
    }
  };

  const login = (email: string, _password?: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.isSuspended) {
        addToast('error', 'Account Suspended', 'This account has been suspended by an administrator.');
        return false;
      }
      setCurrentUserId(existing.id);
      setIsAuthModalOpen(false);
      trackEvent('login', { method: 'mock_switch', userId: existing.id });
      addToast('success', 'Welcome Back!', `Logged in as ${existing.name} (${existing.role})`);
      return true;
    }

    // If new demo email, auto-create a buyer user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
      email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      role: 'buyer',
      location: 'United States',
      joinDate: 'Just now',
      rating: 5.0,
      reviewCount: 0,
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
      balance: { available: 0, pending: 0 },
      isSuspended: false
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    trackEvent('sign_up', { method: 'demo_auto_create' });
    addToast('success', 'Account Created', `Welcome to Meridian Marketplace, ${newUser.name}!`);
    return true;
  };

  const signup = (userData: Partial<User>, role: 'buyer' | 'seller') => {
    const existing = users.find(u => u.email.toLowerCase() === userData.email?.toLowerCase());
    if (existing) {
      addToast('error', 'Account Exists', 'An account with this email address already exists. Please log in.');
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'user@example.com',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80`,
      role: role,
      storeName: role === 'seller' ? userData.storeName || `${userData.name}'s Shop` : undefined,
      storeBanner: role === 'seller' ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80' : undefined,
      bio: userData.bio || (role === 'seller' ? 'Official seller on Meridian Marketplace.' : 'Marketplace explorer.'),
      location: userData.location || 'United States',
      joinDate: 'Just now',
      rating: 5.0,
      reviewCount: 0,
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
      balance: { available: 0, pending: 0 },
      isSuspended: false
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthModalOpen(false);
    addToast('success', 'Registration Complete', `Welcome to Meridian, ${newUser.name}! You are registered as a ${role}.`);
    return true;
  };

  const logout = () => {
    signOut(auth).catch(() => {});
    setCurrentUserId(null);
    setCurrentView('welcome-auth');
    trackEvent('logout');
    addToast('info', 'Logged Out', 'You have been signed out successfully.');
  };

  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      addToast('info', 'Switched Account', `Now browsing as ${target.name} (${target.role.toUpperCase()})`);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? { ...u, ...updates } : u)));
    addToast('success', 'Profile Updated', 'Your profile details have been saved.');
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? { ...u, settings: { ...u.settings, ...settings } } : u)));
    addToast('success', 'Settings Saved', 'Your account preferences were updated.');
  };

  const addAddress = (addressData: Omit<UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddress: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updated = currentUser.addresses.map(a => addressData.isDefault ? { ...a, isDefault: false } : a);
    updateProfile({ addresses: [...updated, newAddress] });
    addToast('success', 'Address Added', 'Your delivery address has been saved.');
  };

  const removeAddress = (addressId: string) => {
    if (!currentUser) return;
    updateProfile({ addresses: currentUser.addresses.filter(a => a.id !== addressId) });
    addToast('info', 'Address Removed', 'Delivery address was deleted.');
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const updated = currentUser.addresses.map(a => ({ ...a, isDefault: a.id === addressId }));
    updateProfile({ addresses: updated });
  };

  // Products
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'rating' | 'reviewCount' | 'soldCount'>) => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1,
      rating: 5.0,
      reviewCount: 0,
      soldCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    // update category item count
    setCategories(prev => prev.map(c => c.id === productData.categoryId ? { ...c, itemCount: c.itemCount + 1 } : c));
    addToast('success', 'Listing Published', `"${productData.title.slice(0, 30)}..." is now live on the marketplace!`);
    return newId;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)));
    addToast('success', 'Listing Updated', 'Product listing changes have been saved.');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (prod) {
      setCategories(prev => prev.map(c => c.id === prod.categoryId ? { ...c, itemCount: Math.max(0, c.itemCount - 1) } : c));
    }
    // Remove from cart and wishlist if present
    setCart(prev => prev.filter(item => item.productId !== id));
    setWishlist(prev => prev.filter(wId => wId !== id));
    addToast('info', 'Listing Deleted', 'The product listing has been removed.');
  };

  const toggleProductStatus = (id: string, status: ListingStatus) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
    addToast('info', 'Status Changed', `Listing status updated to ${status}.`);
  };

  const getProduct = (id: string) => products.find(p => p.id === id);

  const incrementProductViews = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, views: p.views + 1 } : p)));
  };

  // Categories
  const addCategory = (cat: Omit<Category, 'id' | 'itemCount'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    addToast('success', 'Category Created', `New category "${cat.name}" added to marketplace.`);
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...cat } : c)));
    addToast('success', 'Category Updated', 'Category details were saved.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Category Deleted', 'Category removed.');
  };

  // Cart
  const addToCart = (product: Product, quantity = 1, selectedShippingId?: string) => {
    const defaultShip = selectedShippingId || (product.shippingOptions && product.shippingOptions[0] ? product.shippingOptions[0].id : 'default');
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, selectedShippingId: defaultShip, product }];
    });
    setIsCartOpen(true);
    addToast('success', 'Added to Cart', `${product.title.slice(0, 28)}... has been added.`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addToast('info', 'Item Removed', 'Product removed from your shopping bag.');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: Math.min(item.product.stock, quantity) } : item
      )
    );
  };

  const updateCartShipping = (productId: string, shippingId: string) => {
    setCart(prev =>
      prev.map(item => (item.productId === productId ? { ...item, selectedShippingId: shippingId } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('info', 'Removed from Wishlist', 'Item removed from your saved items.');
        return prev.filter(id => id !== productId);
      } else {
        addToast('success', 'Saved to Wishlist', 'Item added to your saved wishlist.');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const clearWishlist = () => setWishlist([]);

  // Orders & Checkout
  const createOrder = (orderData: {
    items: { product: Product; quantity: number; shippingOption: ShippingOption }[];
    shippingAddress: Order['shippingAddress'];
    paymentMethod: Order['paymentMethod'];
    couponCode?: string;
    discount?: number;
  }) => {
    const newOrderId = `ord-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = orderData.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
    const shippingFee = orderData.items.reduce((s, i) => s + (i.shippingOption?.price || 0), 0);
    const discount = orderData.discount || 0;
    const tax = Number(((subtotal - discount) * 0.08).toFixed(2));
    const total = Number((subtotal + shippingFee + tax - discount).toFixed(2));

    const firstSeller = orderData.items[0]?.product;

    const newOrder: Order = {
      id: newOrderId,
      buyerId: currentUser ? currentUser.id : 'guest-buyer',
      buyerName: currentUser ? currentUser.name : orderData.shippingAddress.fullName,
      buyerEmail: currentUser ? currentUser.email : 'guest@meridian.test',
      sellerId: firstSeller ? firstSeller.sellerId : 'user-seller-1',
      sellerName: firstSeller ? firstSeller.sellerName : 'TechVault Pro',
      items: orderData.items.map(i => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        sellerId: i.product.sellerId,
        sellerName: i.product.sellerName,
        shippingOptionName: i.shippingOption?.name || 'Standard Ground',
        shippingPrice: i.shippingOption?.price || 0
      })),
      subtotal,
      shippingFee,
      tax,
      discount,
      couponCode: orderData.couponCode,
      total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      status: 'processing',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
      carrier: 'FedEx Express',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      statusHistory: [
        { status: 'pending_payment', timestamp: new Date().toISOString(), note: 'Payment verified with Stripe Card' },
        { status: 'processing', timestamp: new Date().toISOString(), note: 'Order sent to merchant fulfillment' }
      ],
      canReview: false
    };

    // Update stock and sold counts
    orderData.items.forEach(i => {
      setProducts(prev =>
        prev.map(p =>
          p.id === i.product.id
            ? { ...p, stock: Math.max(0, p.stock - i.quantity), soldCount: p.soldCount + i.quantity }
            : p
        )
      );
    });

    // Update seller balances
    const sellerRevenue = total - (total * 0.05); // minus 5% platform fee
    setUsers(prev =>
      prev.map(u =>
        u.id === newOrder.sellerId
          ? {
              ...u,
              balance: {
                ...u.balance,
                pending: u.balance.pending + sellerRevenue
              }
            }
          : u
      )
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    addToast('success', 'Order Placed!', `Your order #${newOrderId} is confirmed and processing.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingInfo?: { carrier?: string; trackingNumber?: string; note?: string }) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const newHistory = [
            ...ord.statusHistory,
            {
              status,
              timestamp: new Date().toISOString(),
              note: trackingInfo?.note || `Status updated to ${status.replace('_', ' ')}`
            }
          ];

          // If delivered, move funds from pending to available
          if (status === 'delivered') {
            const sellerRev = ord.total * 0.95;
            setUsers(uList =>
              uList.map(u =>
                u.id === ord.sellerId
                  ? {
                      ...u,
                      balance: {
                        available: u.balance.available + sellerRev,
                        pending: Math.max(0, u.balance.pending - sellerRev)
                      }
                    }
                  : u
              )
            );
          }

          return {
            ...ord,
            status,
            trackingNumber: trackingInfo?.trackingNumber || ord.trackingNumber,
            carrier: trackingInfo?.carrier || ord.carrier,
            statusHistory: newHistory,
            canReview: status === 'delivered'
          };
        }
        return ord;
      })
    );
    addToast('info', 'Order Updated', `Order #${orderId} marked as ${status.replace('_', ' ')}.`);
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'cancelled', { note: reason || 'Cancelled by customer' });
  };

  const requestRefund = (orderId: string, reason: string) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: 'refunded', refundReason: reason } : ord))
    );
    addToast('info', 'Refund Requested', `Refund initiated for Order #${orderId}.`);
  };

  const getOrder = (orderId: string) => orders.find(o => o.id === orderId);

  // Reviews
  const addReview = (reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }
    const targetProduct = products.find(p => p.id === reviewData.productId);
    if (!targetProduct) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId: reviewData.productId,
      productTitle: targetProduct.title,
      productImage: targetProduct.images[0] || '',
      sellerId: targetProduct.sellerId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
      helpfulVotes: 0
    };

    setReviews(prev => [newReview, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter(r => r.productId === targetProduct.id), newReview];
    const avgRating = Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length).toFixed(1));

    setProducts(prev =>
      prev.map(p =>
        p.id === targetProduct.id ? { ...p, rating: avgRating, reviewCount: prodReviews.length } : p
      )
    );

    addToast('success', 'Review Submitted', 'Thank you for rating your purchase!');
  };

  const voteReviewHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
    addToast('info', 'Feedback Noted', 'Thank you for your feedback.');
  };

  const replyToReview = (reviewId: string, comment: string) => {
    setReviews(prev =>
      prev.map(r =>
        r.id === reviewId
          ? { ...r, sellerResponse: { comment, createdAt: new Date().toISOString() } }
          : r
      )
    );
    addToast('success', 'Response Published', 'Your response to the customer review is now visible.');
  };

  // Messaging
  const startConversationWithSeller = (sellerId: string, initialText: string, product?: Product) => {
    if (!currentUser) {
      openAuthModal('login');
      return '';
    }

    const sellerUser = users.find(u => u.id === sellerId);
    if (!sellerUser) return '';

    // Check if conversation already exists between these 2 users
    const existing = conversations.find(
      c => c.participants.includes(currentUser.id) && c.participants.includes(sellerId)
    );

    let convId = existing ? existing.id : `conv-${Date.now()}`;

    if (!existing) {
      const newConv: Conversation = {
        id: convId,
        participants: [currentUser.id, sellerId],
        participantDetails: {
          [currentUser.id]: {
            name: currentUser.name,
            avatar: currentUser.avatar,
            role: currentUser.role,
            isOnline: true
          },
          [sellerId]: {
            name: sellerUser.storeName || sellerUser.name,
            storeName: sellerUser.storeName,
            avatar: sellerUser.avatar,
            role: sellerUser.role,
            isOnline: true
          }
        },
        lastMessage: initialText,
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: {
          [sellerId]: 1,
          [currentUser.id]: 0
        },
        relatedProductId: product?.id,
        relatedProductTitle: product?.title,
        relatedProductImage: product?.images[0]
      };
      setConversations(prev => [newConv, ...prev]);
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId: currentUser.id,
      receiverId: sellerId,
      text: initialText,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentProduct: product ? { id: product.id, title: product.title, price: product.price, image: product.images[0] } : undefined
    };

    setMessages(prev => [...prev, newMsg]);
    setActiveConversationId(convId);
    navigate('messaging', { conversationId: convId });
    addToast('success', 'Message Sent', `Inquiry sent to ${sellerUser.storeName || sellerUser.name}.`);
    return convId;
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    attachmentProduct?: { id: string; title: string; price: number; image: string },
    offer?: { amount: number; status: 'pending' | 'accepted' | 'declined' }
  ) => {
    if (!currentUser) return;
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;

    const recipientId = conv.participants.find(pId => pId !== currentUser.id) || '';

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      receiverId: recipientId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentProduct,
      offer
    };

    setMessages(prev => [...prev, newMsg]);

    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: offer ? `Offered $${offer.amount}: ${text}` : text,
              lastMessageTimestamp: new Date().toISOString(),
              unreadCount: {
                ...c.unreadCount,
                [recipientId]: (c.unreadCount[recipientId] || 0) + 1
              }
            }
          : c
      )
    );
  };

  const markConversationAsRead = (conversationId: string) => {
    if (!currentUser) return;
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, unreadCount: { ...c.unreadCount, [currentUser.id]: 0 } }
          : c
      )
    );
    setMessages(prev =>
      prev.map(m =>
        m.conversationId === conversationId && m.receiverId === currentUser.id
          ? { ...m, isRead: true }
          : m
      )
    );
  };

  const respondToOffer = (messageId: string, action: 'accepted' | 'declined') => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId && m.offer
          ? { ...m, offer: { ...m.offer, status: action } }
          : m
      )
    );
    addToast(action === 'accepted' ? 'success' : 'info', `Offer ${action}`, `You have ${action} the price offer.`);
  };

  const unreadMessagesCount = currentUser
    ? conversations.reduce((sum, c) => sum + (c.unreadCount[currentUser.id] || 0), 0)
    : 0;

  // Admin Moderation
  const createReport = (reportData: Omit<PlatformReport, 'id' | 'createdAt' | 'status'>) => {
    const newReport: PlatformReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    addToast('success', 'Report Submitted', 'Our trust and safety team will review this item.');
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports(prev => prev.map(r => (r.id === reportId ? { ...r, status: action } : r)));
    addToast('info', 'Report Updated', `Report status changed to ${action}.`);
  };

  const toggleUserSuspension = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u))
    );
    const target = users.find(u => u.id === userId);
    addToast('warning', 'User Status Changed', `${target?.name} suspension toggled.`);
  };

  const toggleUserVerification = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, verified: !u.verified } : u))
    );
    addToast('success', 'Verification Updated', 'Seller verification status updated.');
  };

  const toggleFeaturedProduct = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, featured: !p.featured } : p))
    );
    addToast('info', 'Featured Status Updated', 'Product spotlight placement updated.');
  };

  // Search & Filter state
  const setFilter = (updates: Partial<FilterState>) => {
    setActiveFilter(prev => ({ ...prev, ...updates }));
  };

  const resetFilter = () => setActiveFilter(defaultFilter);

  // Auth Modal
  const openAuthModal = (mode: 'login' | 'signup' | 'forgot_password' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Reset to default seed data
  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers([]);
    setCurrentUserId(null);
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setReviews(INITIAL_REVIEWS);
    setConversations([]);
    setMessages([]);
    setReports(INITIAL_REPORTS);
    setActiveFilter(defaultFilter);
    addToast('success', 'Reset Complete', 'Marketplace session reset to clean state.');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        isFirebaseConnected,
        firebaseProjectId,
        domainAuthError,
        clearDomainAuthError: () => setDomainAuthError(null),
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        sendPasswordReset,
        currentUser,
        users,
        login,
        signup,
        logout,
        switchUser,
        updateProfile,
        updateSettings,
        addAddress,
        removeAddress,
        setDefaultAddress,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        getProduct,
        incrementProductViews,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartShipping,
        clearCart,
        cartSubtotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        requestRefund,
        getOrder,
        reviews,
        addReview,
        voteReviewHelpful,
        replyToReview,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startConversationWithSeller,
        markConversationAsRead,
        respondToOffer,
        unreadMessagesCount,
        reports,
        createReport,
        resolveReport,
        toggleUserSuspension,
        toggleUserVerification,
        toggleFeaturedProduct,
        activeFilter,
        setFilter,
        resetFilter,
        currentView,
        currentViewParams,
        navigate,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        toasts,
        addToast,
        removeToast,
        resetToDefaultData
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
