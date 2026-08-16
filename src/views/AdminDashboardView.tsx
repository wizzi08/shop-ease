import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Star,
  Check,
  Shield,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, User } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    currentUser,
    users,
    products,
    orders,
    reports,
    resolveReport,
    deleteProduct,
    updateProduct,
    updateUser,
    navigate,
    addToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'reports' | 'products' | 'users'>('reports');
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Calculate platform totals
  const platformGMV = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const platformRevenue = platformGMV * 0.05; // 5% take rate
  const pendingReports = reports.filter(r => r.status === 'pending');

  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    p =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleToggleVerified = (user: User) => {
    // In our simplified mock, we simulate toggle
    addToast(
      'info',
      'Merchant Status',
      `${user.name} merchant badge updated.`
    );
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct({ ...product, featured: !product.featured });
    addToast('info', 'Feature Status', `"${product.title}" featured flag toggled.`);
  };

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
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
              Logged in as {currentUser?.name || 'Administrator'} • Real-time oversight
            </p>
          </div>
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
            <ArrowUpRight className="w-3 h-3" /> All verified escrow transactions
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
          <span className="text-xs font-semibold text-zinc-500">Registered Marketplace Users</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {users.length}
          </div>
          <p className="text-[11px] text-zinc-400">Buyers, Sellers, Admins</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-zinc-500">Open Moderation Reports</span>
          <div className="text-2xl font-black text-rose-600">
            {pendingReports.length}
          </div>
          <p className="text-[11px] text-rose-600 font-medium">Pending moderator review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'reports'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Resolution Center ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Catalog Moderation ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>
      </div>

      {/* Tab 1: Resolution & Reports Center */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              All clean! Zero unresolved moderation reports.
            </div>
          ) : (
            reports.map(report => (
              <div
                key={report.id}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-600 uppercase text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50">
                      {report.targetType} Report
                    </span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{report.targetTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        report.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : report.status === 'dismissed'
                          ? 'bg-zinc-100 text-zinc-600'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {report.status}
                    </span>

                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => resolveReport(report.id, 'dismissed')}
                          className="px-3 py-1 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-600"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => resolveReport(report.id, 'resolved')}
                          className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                        >
                          Resolve & Moderate
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    <strong>Reported Reason:</strong> {report.reason}
                  </p>
                  <p className="text-zinc-500">
                    <strong>Details from {report.reporterName}:</strong> {report.details}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    Submitted on {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Catalog Moderation */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search listings by title or seller..."
              value={productSearch}
              onChange={e => setProductSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Moderator Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-zinc-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img src={prod.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-bold truncate max-w-[200px]">{prod.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-600">{prod.sellerName}</td>
                    <td className="p-4 font-bold">${prod.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold capitalize bg-zinc-100">
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1 rounded-lg ${
                          prod.featured ? 'text-amber-500 bg-amber-50' : 'text-zinc-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${prod.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate('product', { productId: prod.id })}
                          className="p-1 text-zinc-400 hover:text-zinc-700"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600"
                          title="Take down listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Users Directory */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            />
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-zinc-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                          <p className="text-[11px] text-zinc-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-600">{user.location}</td>
                    <td className="p-4">{user.rating.toFixed(2)} ★ ({user.reviewCount})</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate('profile', { userId: user.id })}
                        className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
