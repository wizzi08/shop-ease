import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';

export const HomeView: React.FC = () => {
  const { products, categories, users, navigate, setFilter } = useMarketplace();

  // Flash Sale Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.featured && p.status === 'active').slice(0, 8);
  const latestListings = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);
  const flashDeals = products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4);
  const topSellers = users.filter(u => u.role === 'seller' && u.rating >= 4.8);

  const quickSearchTags = ['Noise-Canceling', 'Solid Walnut', 'Selvedge Denim', 'MacBook Pro', 'Mechanical Keyboard', 'Leica'];

  return (
    <div id="home-view" className="space-y-14 sm:space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-900/60 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800/80 pt-10 pb-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Independent Creators & Retailers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-[1.1]">
                Buy & sell exceptional goods with confidence.
              </h1>

              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-xl leading-relaxed">
                A modern peer-to-peer marketplace featuring authenticated electronics, handcrafted furniture, rare vintage apparel, and collectibles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('browse')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-sm shadow-xl hover:shadow-2xl transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('create-listing')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold text-sm transition-all"
                >
                  Start Selling
                </button>
              </div>

              {/* Popular Tags */}
              <div className="pt-3 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-500 font-medium">Trending:</span>
                {quickSearchTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setFilter({ searchQuery: tag, categoryId: 'all' });
                      navigate('browse');
                    }}
                    className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-zinc-900 p-2 shadow-2xl border border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Featured item"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent rounded-2xl pointer-events-none" />

                {/* Floating pill highlight */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-xl flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Editor&apos;s Spotlight
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      Sony WH-1000XM5 ANC Headphones
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">$329.99 • TechVault Pro (4.95★)</p>
                  </div>
                  <button
                    onClick={() => navigate('product', { productId: 'prod-1' })}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0 transition-all"
                  >
                    View Drop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Browse by Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => {
                setFilter({ categoryId: cat.id, searchQuery: '' });
                navigate('browse');
              }}
              className="group relative h-36 sm:h-44 rounded-2xl overflow-hidden cursor-pointer border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.bannerImage}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <h3 className="text-sm font-bold tracking-tight group-hover:text-blue-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-300 opacity-90 mt-0.5">{cat.itemCount} items listed</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Section with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Limited Availability
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Flash Deals of the Day
                </h2>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2 bg-zinc-800/80 px-4 py-2 rounded-2xl border border-zinc-700">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-400">Ends in:</span>
              <div className="flex items-center gap-1 font-mono text-sm font-bold text-amber-300">
                <span className="bg-zinc-900 px-2 py-0.5 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-zinc-900 px-2 py-0.5 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-zinc-900 px-2 py-0.5 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashDeals.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
              Featured Marketplace Listings
            </h2>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All ({products.length}) <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Top Verified Sellers Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Trusted Merchants
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
              Top-Rated Verified Sellers
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Every verified seller undergoes identity verification, quality audits, and buyer feedback monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topSellers.map(seller => (
              <div
                key={seller.id}
                onClick={() => navigate('profile', { userId: seller.id })}
                className="group p-5 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600">
                          {seller.storeName || seller.name}
                        </h4>
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                      <p className="text-xs text-zinc-500">{seller.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {seller.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-700/60 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{seller.rating.toFixed(2)} rating</span>
                    <span className="text-zinc-400 font-normal">({seller.reviewCount})</span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Visit Shop <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Fresh Arrivals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
              Latest Additions to the Marketplace
            </h2>
          </div>
          <button
            onClick={() => {
              setFilter({ sortBy: 'newest' });
              navigate('browse');
            }}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            See All New <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestListings.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Sell With Us CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-8 sm:p-12 shadow-2xl">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Seller Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Turn your craft or rare goods into thriving revenue.
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              List in minutes with zero upfront fees. Benefit from automated buyer escrow, instant payouts, and integrated messaging.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => navigate('create-listing')}
                className="px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-lg transition-all active:scale-95"
              >
                Create First Listing
              </button>
              <button
                onClick={() => navigate('help', { section: 'seller-fees' })}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all backdrop-blur-xs"
              >
                Learn About Fees
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
