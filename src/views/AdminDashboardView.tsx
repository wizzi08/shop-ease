import React, { useState } from 'react';
import {
  Shield,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Star,
  Search,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
  Plus,
  PlusCircle,
  Edit3,
  Filter,
  Check,
  ExternalLink,
  Store,
  Tag
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, User, ProductStatus } from '../types';
import { BackButton } from '../components/common/BackButton';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    products,
    categories,
    orders,
    reports,
    resolveReport,
    deleteProduct,
    updateProduct,
    toggleProductStatus,
    updateUser,
    navigate,
    addToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'reports' | 'products' | 'users'>('products');
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Calculate platform totals
  const platformGMV = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const platformRevenue = platformGMV * 0.05; // 5% take rate
  const pendingReports = reports.filter(r => r.status === 'pending');
  const totalActiveListings = products.filter(p => p.status === 'active').length;
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.storeName && u.storeName.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(productSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleToggleVerified = (user: User) => {
    updateUser({ ...user, verified: !user.verified });
    addToast(
      'info',
      'Merchant Verification Updated',
      `${user.name}'s verified status is now ${!user.verified ? 'Verified' : 'Unverified'}.`
    );
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct({ ...product, featured: !product.featured });
    addToast('info', 'Feature Status Updated', `"${product.title}" featured flag toggled to ${!product.featured ? 'Featured' : 'Standard'}.`);
  };

  const handleQuickStatusChange = (product: Product, newStatus: ProductStatus) => {
    updateProduct({ ...product, status: newStatus });
    addToast('success', 'Status Changed', `"${product.title.slice(0, 24)}..." is now ${newStatus}.`);
  };

  const handleDeleteListing = (product: Product) => {
    if (window.confirm(`Are you sure you want to permanently delete listing "${product.title}"?`)) {
      deleteProduct(product.id);
      addToast('info', 'Listing Deleted', `"${product.title}" was removed from the catalog.`);
    }
  };

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton variant="pill" label="Back to previous page" fallbackView="home" />
        <button
          type="button"
          onClick={() => navigate('create-listing')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">Platform Moderation & Admin Control</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Logged in as {currentUser?.name || 'Administrator'} ({currentUser?.email}) • Global Catalog & Account Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('admin-prices')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer transition-all"
          >
            <DollarSign className="w-4 h-4" />
            <span>Edit Prices & Photos</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('create-listing')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('browse')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700/60 cursor-pointer transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Marketplace</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-zinc-500">Gross Merchandise Vol (GMV)</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            ${platformGMV.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Escrow volume cleared
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-zinc-500">Platform Fees Collected (5%)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            ${platformRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-zinc-400">Net marketplace revenue</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-zinc-500">Catalog Size & Inventory</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {products.length} <span className="text-xs font-normal text-zinc-500">({totalActiveListings} active)</span>
          </div>
          <p className="text-[11px] text-zinc-500">{totalStockCount} total units in stock</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-zinc-500">Pending User Reports</span>
          <div className={`text-2xl font-black ${pendingReports.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-zinc-500">Escrow & safety tickets</p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-8 text-sm font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Catalog & Moderation ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Trust & Safety Tickets</span>
          {pendingReports.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
              {pendingReports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Merchants ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Product Catalog & Moderation */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Category, Status, Add Product */}
          <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search listings by title, seller, ID or tag..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium capitalize"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="draft">Drafts</option>
                <option value="paused">Paused</option>
                <option value="sold">Sold</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigate('create-listing')}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          </div>

          {/* Catalog Table */}
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden text-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase">
                  <tr>
                    <th className="p-4">Product Listing</th>
                    <th className="p-4">Seller / Store</th>
                    <th className="p-4">Price & Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-zinc-400">
                        No products match the search or filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                            />
                            <div className="min-w-0 max-w-[240px]">
                              <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate hover:text-blue-600 cursor-pointer" onClick={() => navigate('product', { productId: prod.id })}>
                                {prod.title}
                              </p>
                              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5 flex-wrap">
                                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                                  {prod.id}
                                </span>
                                <span>•</span>
                                <span>{prod.subcategory}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={prod.sellerAvatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                            />
                            <div className="truncate max-w-[140px]">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {prod.sellerName}
                              </p>
                              <span className="text-[10px] text-zinc-400 capitalize">{prod.sellerId.startsWith('admin') ? 'Platform Admin' : 'Merchant'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-black text-zinc-900 dark:text-zinc-100">
                            ${prod.price.toFixed(2)}
                            {prod.originalPrice && prod.originalPrice > prod.price && (
                              <span className="ml-1 text-[11px] text-zinc-400 line-through font-normal">
                                ${prod.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] mt-0.5">
                            <span className={prod.stock <= 2 ? 'text-rose-600 font-bold' : 'text-zinc-500'}>
                              {prod.stock} in stock
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <select
                            value={prod.status}
                            onChange={e => handleQuickStatusChange(prod, e.target.value as ProductStatus)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border capitalize transition-colors ${
                              prod.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : prod.status === 'draft'
                                ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700'
                                : prod.status === 'paused'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="paused">Paused</option>
                            <option value="sold">Sold</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(prod)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              prod.featured
                                ? 'bg-amber-50 text-amber-500 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                                : 'text-zinc-400 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                            title={prod.featured ? 'Remove from Featured' : 'Feature Product'}
                          >
                            <Star className={`w-4 h-4 ${prod.featured ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => navigate('admin-prices')}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-semibold cursor-pointer transition-colors"
                              title="Edit price and pictures"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Price & Photos</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate('edit-listing', { productId: prod.id })}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold cursor-pointer transition-colors"
                              title="Edit all product attributes"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate('product', { productId: prod.id })}
                              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                              title="View live listing"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteListing(prod)}
                              className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
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

      {/* Tab 2: Trust & Safety Tickets */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">All Trust Tickets Resolved</h3>
              <p className="text-xs text-zinc-400 mt-1">Zero pending moderation reports in the queue.</p>
            </div>
          ) : (
            reports.map(rep => (
              <div
                key={rep.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                      {rep.targetType} Report: {rep.reason}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rep.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">{rep.details}</p>
                  <p className="text-[11px] text-zinc-400">Target ID: {rep.targetId} • Submitted {new Date(rep.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  {rep.status === 'pending' && (
                    <>
                      <button
                        onClick={() => resolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => resolveReport(rep.id, 'action_taken')}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                      >
                        Take Action
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Users Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name, email or store..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden text-xs shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Verified</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{u.name}</span>
                            <p className="text-[11px] text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-600 dark:text-zinc-400">
                        {u.storeName || '—'}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleVerified(u)}
                          className={`flex items-center gap-1 font-semibold cursor-pointer ${
                            u.verified ? 'text-emerald-600' : 'text-zinc-400'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{u.verified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate('profile', { userId: u.id })}
                          className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                        >
                          View Profile
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
    </div>
  );
};
