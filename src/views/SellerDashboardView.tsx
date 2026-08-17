import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  TrendingUp,
  Star,
  PlusCircle,
  Edit,
  Trash2,
  Play,
  Pause,
  Truck,
  CheckCircle2,
  ExternalLink,
  Store,
  Wallet,
  Settings,
  AlertCircle,
  Eye,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, ProductStatus } from '../types';

interface SellerDashboardViewProps {
  tab?: 'listings' | 'orders' | 'payouts' | 'store';
}

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({ tab = 'listings' }) => {
  const {
    currentUser,
    products,
    orders,
    deleteProduct,
    updateProduct,
    updateOrderStatus,
    updateUser,
    navigate,
    openAuthModal,
    addToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'listings' | 'orders' | 'payouts' | 'store'>(tab);
  const [listingFilter, setListingFilter] = useState<'all' | ProductStatus>('all');
  const [shippingModalOrder, setShippingModalOrder] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Sync active tab with prop
  React.useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Store Settings
  const [storeName, setStoreName] = useState(currentUser?.storeName || currentUser?.name || 'My Store');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || 'San Francisco, CA');

  React.useEffect(() => {
    if (currentUser) {
      setStoreName(currentUser.storeName || currentUser.name || 'My Store');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || 'San Francisco, CA');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center mx-auto text-purple-600 dark:text-purple-400 shadow-sm">
          <Store className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Merchant Portal</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your seller account or register as a merchant to publish listings and manage escrow payouts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
          >
            Open Seller Account
          </button>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Seller's specific listings
  const sellerId = currentUser.id;
  const myListings = products.filter(p => p.sellerId === sellerId);
  const filteredListings = myListings.filter(p => {
    if (listingFilter === 'all') return true;
    return p.status === listingFilter;
  });

  // Orders that contain seller's products
  const mySalesOrders = orders.filter(o => o.items.some(i => i.sellerId === sellerId));

  // Compute analytics
  const totalRevenue = mySalesOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => {
      const myItemsTotal = o.items
        .filter(i => i.sellerId === sellerId)
        .reduce((s, it) => s + it.price * it.quantity, 0);
      return sum + myItemsTotal;
    }, 0);

  const pendingFulfillments = mySalesOrders.filter(
    o => o.status === 'processing' || o.status === 'pending'
  );

  const activeListingsCount = myListings.filter(p => p.status === 'active').length;

  const handleToggleListingStatus = (product: Product) => {
    const nextStatus: ProductStatus = product.status === 'active' ? 'inactive' : 'active';
    updateProduct(product.id, { status: nextStatus });
    addToast(
      'info',
      'Listing Status Changed',
      `"${product.title}" is now ${nextStatus === 'active' ? 'Active & Discoverable' : 'Paused'}.`
    );
  };

  const handleFulfillOrder = (orderId: string) => {
    if (!trackingNumberInput) {
      addToast('error', 'Tracking Required', 'Please enter a valid tracking number.');
      return;
    }
    updateOrderStatus(orderId, 'shipped', trackingNumberInput);
    setShippingModalOrder(null);
    setTrackingNumberInput('');
  };

  const handleRequestPayout = () => {
    addToast(
      'success',
      'Payout Initiated',
      'Your request for $1,420.00 has been sent to your verified Stripe bank account (arriving in 1-2 business days).'
    );
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUser({ storeName, bio, location });
      addToast('success', 'Storefront Updated', 'Your seller profile details have been saved.');
    }
  };

  return (
    <div id="seller-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Seller Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg border border-white/20">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{storeName || currentUser?.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Verified Merchant
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Rating: 4.95 ★ ({currentUser?.reviewCount || 48} reviews) • {location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('create-listing')}
            className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Listing
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">Total Revenue (Gross)</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            ${totalRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% this month
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">Active Inventory</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {activeListingsCount} <span className="text-xs font-normal text-zinc-400">/ {myListings.length} total</span>
          </div>
          <p className="text-[11px] text-zinc-500">Ready for instant purchasing</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">Pending Fulfillment</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {pendingFulfillments.length}
          </div>
          <p className="text-[11px] text-amber-600 font-medium">Orders requiring dispatch</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-semibold">Store Rating</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            4.95 ★
          </div>
          <p className="text-[11px] text-purple-600 font-medium">Top 2% of verified sellers</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-2 sm:gap-6 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'listings'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Listings ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Orders to Fulfill ({mySalesOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'payouts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Payouts & Stripe Escrow</span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'store'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Store Profile & Policies</span>
        </button>
      </div>

      {/* Tab 1: Product Listings Manager */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'active', 'inactive', 'draft', 'sold'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setListingFilter(st)}
                  className={`px-3 py-1 rounded-full capitalize font-semibold ${
                    listingFilter === st
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('create-listing')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5 w-fit"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Listing
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Views / Sales</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-500">
                        No listings found matching this status filter.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map(prod => (
                      <tr key={prod.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.title}
                              className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0"
                            />
                            <div>
                              <div
                                onClick={() => navigate('product', { productId: prod.id })}
                                className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 cursor-pointer line-clamp-1 max-w-xs"
                              >
                                {prod.title}
                              </div>
                              <span className="text-[11px] text-zinc-500 capitalize">
                                {prod.condition.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-bold text-zinc-900 dark:text-zinc-100">
                          ${prod.price.toFixed(2)}
                        </td>

                        <td className="p-4">
                          <input
                            type="number"
                            min="0"
                            value={prod.stock}
                            onChange={e => updateProduct({ ...prod, stock: Number(e.target.value) })}
                            className="w-16 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-medium text-center"
                          />
                        </td>

                        <td className="p-4 text-zinc-500">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-zinc-400" />
                            <span>{prod.views} views</span>
                            <span>•</span>
                            <span>{prod.soldCount} sold</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              prod.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : prod.status === 'draft'
                                ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                                : prod.status === 'sold'
                                ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleListingStatus(prod)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                              title={prod.status === 'active' ? 'Pause listing' : 'Activate listing'}
                            >
                              {prod.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => navigate('edit-listing', { productId: prod.id })}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-600"
                              title="Edit listing details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prod.title}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders to Fulfill */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {mySalesOrders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <Truck className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">No incoming orders yet</h3>
              <p className="text-xs text-zinc-500">
                When buyers purchase your items, customer shipping instructions will appear here.
              </p>
            </div>
          ) : (
            mySalesOrders.map(order => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      Order #{order.id}
                    </span>
                    <p className="text-zinc-500 text-[11px]">
                      Buyer: <strong className="text-zinc-700 dark:text-zinc-300">{order.shippingAddress.fullName}</strong> • Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : order.status === 'shipped'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      Status: {order.status}
                    </span>

                    {order.status !== 'shipped' && order.status !== 'delivered' && (
                      <button
                        onClick={() => setShippingModalOrder(order.id)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                      >
                        Enter Tracking & Ship
                      </button>
                    )}

                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map(it => (
                    <div key={it.productId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={it.productImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{it.productTitle}</p>
                          <p className="text-zinc-500 text-[11px]">Qty: {it.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping address recap */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 flex items-start gap-2">
                  <div className="flex-1">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      Deliver to: {order.shippingAddress.fullName}
                    </span>
                    <p className="text-zinc-500">
                      {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <div className="text-right">
                      <span className="font-semibold text-blue-600">Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Payouts & Stripe Escrow */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-zinc-900 text-white space-y-3">
              <span className="text-xs text-zinc-400 font-semibold">Available for Payout</span>
              <div className="text-3xl font-black">$1,420.00</div>
              <p className="text-[11px] text-zinc-400">Ready to transfer to bank</p>
              <button
                onClick={handleRequestPayout}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Instant Stripe Payout
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs text-zinc-500 font-semibold">Pending in Buyer Escrow</span>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">$840.00</div>
              <p className="text-[11px] text-zinc-400">Auto-released after carrier delivery</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% Insured Escrow
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
              <span className="text-xs text-zinc-500 font-semibold">Lifetime Earnings</span>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100">$18,650.00</div>
              <p className="text-[11px] text-zinc-400">Across 142 completed transactions</p>
            </div>
          </div>

          {/* Past Payouts Table */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Recent Payout Transfers
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Direct Deposit (Chase •••• 4912)</p>
                  <p className="text-zinc-500 text-[11px]">Transferred on Aug 10, 2026</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">+$2,150.00</span>
                  <span className="block text-[10px] text-zinc-400">Completed</span>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Direct Deposit (Chase •••• 4912)</p>
                  <p className="text-zinc-500 text-[11px]">Transferred on Jul 24, 2026</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-600">+$1,890.00</span>
                  <span className="block text-[10px] text-zinc-400">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Store Profile */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveStore} className="max-w-2xl space-y-6 text-xs">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              Public Storefront Settings
            </h3>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Store / Brand Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Storefront Bio & Specialization
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Dispatch Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Save Store Profile
            </button>
          </div>
        </form>
      )}

      {/* Enter Tracking Modal */}
      {shippingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={() => setShippingModalOrder(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 z-10 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Dispatch & Enter Tracking
            </h3>
            <p className="text-zinc-500">
              Enter carrier parcel tracking number (FedEx, UPS, USPS, DHL) to notify buyer:
            </p>
            <input
              type="text"
              placeholder="e.g. 9400 1000 0000 0000 0000 00"
              value={trackingNumberInput}
              onChange={e => setTrackingNumberInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShippingModalOrder(null)}
                className="flex-1 py-2.5 rounded-xl border font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFulfillOrder(shippingModalOrder)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold"
              >
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
