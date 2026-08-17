import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Star,
  Settings,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bell,
  Trash2,
  Eye,
  User as UserIcon,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { ReviewModal } from '../components/common/ReviewModal';
import { Product } from '../types';
import { BackButton } from '../components/common/BackButton';

interface BuyerDashboardViewProps {
  tab?: 'orders' | 'wishlist' | 'reviews' | 'settings';
}

export const BuyerDashboardView: React.FC<BuyerDashboardViewProps> = ({ tab = 'orders' }) => {
  const {
    currentUser,
    orders,
    products,
    wishlist,
    reviews,
    updateUser,
    cancelOrder,
    navigate,
    openAuthModal,
    addToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'reviews' | 'settings'>(tab);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);

  // Sync active tab when navigation prop changes
  React.useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Settings form state
  const [name, setName] = useState(currentUser?.name || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [emailNotifications, setEmailNotifications] = useState(
    currentUser?.notificationPreferences?.orderUpdates ?? currentUser?.settings?.orderUpdates ?? true
  );
  const [promoNotifications, setPromoNotifications] = useState(
    currentUser?.notificationPreferences?.promotions ?? currentUser?.settings?.marketingEmails ?? false
  );

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setLocation(currentUser.location || '');
      setEmailNotifications(
        currentUser.notificationPreferences?.orderUpdates ?? currentUser.settings?.orderUpdates ?? true
      );
      setPromoNotifications(
        currentUser.notificationPreferences?.promotions ?? currentUser.settings?.marketingEmails ?? false
      );
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Buyer Account</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to view your orders, tracking information, saved wishlist, and personal preferences.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Buyer's specific orders
  const myOrders = orders.filter(o => o.buyerId === currentUser.id);
  const filteredOrders = myOrders.filter(o => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  // Buyer's saved wishlist products
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Buyer's written reviews
  const myReviews = reviews.filter(r => r.buyerId === currentUser.id);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      location,
      notificationPreferences: {
        orderUpdates: emailNotifications,
        promotions: promoNotifications
      },
      settings: {
        ...(currentUser.settings || {
          emailNotifications: true,
          orderUpdates: true,
          priceAlerts: true,
          marketingEmails: false,
          twoFactorAuth: false,
          currency: 'USD'
        }),
        orderUpdates: emailNotifications,
        marketingEmails: promoNotifications
      }
    });
    addToast('success', 'Profile Updated', 'Your personal account preferences have been saved.');
  };

  const memberSinceText = currentUser.joinDate
    ? currentUser.joinDate
    : currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString()
    : '2026';

  return (
    <div id="buyer-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton variant="pill" label="Back to previous page" fallbackView="home" />
      </div>

      {/* Buyer Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{currentUser.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
                Buyer Account
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5">
              {currentUser.email} • Member since {memberSinceText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('seller-dashboard')}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-sm transition-all"
          >
            Switch to Seller Hub
          </button>
        </div>
      </div>

      {/* Dashboard Navigation Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 sm:gap-6 overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders & Purchases ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>My Written Reviews ({myReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings & Preferences</span>
        </button>
      </div>

      {/* Tab Contents */}
      {/* 1. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full capitalize font-semibold transition-all ${
                  orderStatusFilter === st
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Package className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No orders found</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Items you purchase across Meridian with escrow protection will appear here.
              </p>
              <button
                onClick={() => navigate('browse')}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Explore Catalogue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        Order #{order.id}
                      </span>
                      <span className="text-zinc-400">•</span>
                      <span className="text-zinc-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {order.status}
                      </span>

                      <button
                        onClick={() => navigate('order-confirmation', { orderId: order.id })}
                        className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs font-semibold"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {order.items.map(item => {
                      const matchedProd = products.find(p => p.id === item.productId);
                      return (
                        <div
                          key={item.productId}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3 first:pt-0"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productImage}
                              alt={item.productTitle}
                              className="w-14 h-14 rounded-xl object-cover bg-zinc-100 shrink-0"
                            />
                            <div>
                              <h4
                                onClick={() => navigate('product', { productId: item.productId })}
                                className="text-xs font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 cursor-pointer"
                              >
                                {item.productTitle}
                              </h4>
                              <p className="text-[11px] text-zinc-500">
                                Sold by {item.sellerName} • Qty: {item.quantity}
                              </p>
                              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            {matchedProd && (
                              <button
                                onClick={() => setReviewModalProduct(matchedProd)}
                                className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                              >
                                Write Review
                              </button>
                            )}
                            <button
                              onClick={() => navigate('product', { productId: item.productId })}
                              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold"
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Footer with Tracking & Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>
                        {order.trackingNumber
                          ? `Carrier Tracking: ${order.trackingNumber}`
                          : 'Awaiting carrier dispatch scan'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-rose-600 hover:underline font-semibold"
                        >
                          Cancel Order
                        </button>
                      )}
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                        Total: ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. WISHLIST TAB */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Heart className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Your wishlist is empty
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Save interesting tech, rare vintage clothing, or furniture pieces to track price changes.
              </p>
              <button
                onClick={() => navigate('browse')}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {myReviews.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Star className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                No reviews written yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Share your feedback on delivered items to help the Meridian community shop confidently.
              </p>
            </div>
          ) : (
            myReviews.map(rev => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-zinc-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-zinc-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{rev.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-300">{rev.comment}</p>
                {rev.sellerResponse && (
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-l-2 border-blue-600 mt-2">
                    <span className="font-bold">Seller reply:</span> {rev.sellerResponse.comment}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Personal Information
            </h3>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Notification Preferences
            </h3>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Order & Shipment Tracking Updates
                </p>
                <p className="text-zinc-500">
                  Receive email and in-app alerts when tracking milestones change
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={e => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1 border-t border-zinc-100 dark:border-zinc-800 pt-2">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Curated Drops & Flash Sale Promos
                </p>
                <p className="text-zinc-500">
                  Receive our weekly editor drops and flash coupons
                </p>
              </div>
              <input
                type="checkbox"
                checked={promoNotifications}
                onChange={e => setPromoNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
            </label>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
          >
            Save Account Preferences
          </button>
        </form>
      )}

      {/* Review Modal if triggered */}
      {reviewModalProduct && (
        <ReviewModal
          product={reviewModalProduct}
          isOpen={!!reviewModalProduct}
          onClose={() => setReviewModalProduct(null)}
        />
      )}
    </div>
  );
};
