import React from 'react';
import {
  Star,
  CheckCircle,
  MapPin,
  Calendar,
  Package,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { BackButton } from '../components/common/BackButton';

interface UserProfileViewProps {
  userId: string;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ userId }) => {
  const { currentUser, users, products, reviews, startConversationWithSeller, navigate } = useMarketplace();

  let user = users.find(u => u.id === userId);
  if (!user && currentUser && currentUser.id === userId) {
    user = currentUser;
  }
  if (!user) {
    const sampleProduct = products.find(p => p.sellerId === userId);
    if (sampleProduct) {
      user = {
        id: sampleProduct.sellerId,
        name: sampleProduct.sellerName,
        storeName: sampleProduct.sellerName,
        email: `${sampleProduct.sellerName.toLowerCase().replace(/\s+/g, '')}@store.meridian`,
        avatar: sampleProduct.sellerAvatar,
        role: 'seller',
        bio: `Verified merchant for ${sampleProduct.sellerName} on Meridian Marketplace.`,
        location: sampleProduct.location,
        joinDate: 'Verified Merchant',
        rating: sampleProduct.sellerRating,
        reviewCount: sampleProduct.reviewCount,
        verified: sampleProduct.sellerVerified,
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
        balance: { available: 0, pending: 0 },
        isSuspended: false
      };
    }
  }
  const userProducts = products.filter(p => p.sellerId === user?.id && p.status === 'active');
  const userReviews = reviews.filter(r => r.sellerId === user?.id);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">User profile not found</h2>
        <button
          onClick={() => navigate('browse')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs rounded-xl"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div id="user-profile-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <BackButton variant="pill" label="Back to Previous Page" fallbackView="browse" />
      </div>

      {/* Profile Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Cover / Header backdrop */}
        <div className="h-44 sm:h-52 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-zinc-900 shadow-xl bg-white"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
                    {user.storeName || user.name}
                  </h1>
                  {(user.isVerified || user.verified) && (
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {user.location || 'United States'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {user.joinDate || (user.createdAt ? new Date(user.createdAt).getFullYear() : '2026')}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  startConversationWithSeller(
                    user.id,
                    `Hello! I'm reaching out through your storefront profile.`
                  )
                }
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Contact Seller
              </button>
            </div>
          </div>

          {/* Bio & Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                About the Merchant
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {user.bio || 'Verified merchant offering curated items with verified authentic guarantees and expedited global shipping.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Merchant Rating</span>
                <div className="flex items-center gap-1 font-bold text-zinc-900 dark:text-zinc-100">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{(user.rating || 5.0).toFixed(2)}</span>
                  <span className="text-zinc-400 font-normal">({user.reviewCount || 0})</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Active Listings</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{userProducts.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Buyer Protection</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Active Listings */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Current Inventory ({userProducts.length})
          </h2>
        </div>

        {userProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            This merchant currently has no active listings.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {userProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* User's Customer Reviews */}
      <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Buyer Feedback & Reviews ({userReviews.length})
        </h2>

        {userReviews.length === 0 ? (
          <p className="text-xs text-zinc-500">No public reviews recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userReviews.map(rev => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={rev.buyerAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{rev.buyerName}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-zinc-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{rev.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-zinc-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
