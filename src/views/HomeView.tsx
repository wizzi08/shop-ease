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
  ShoppingBag,
  Award,
  Layers
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { CATEGORY_THEMES, getCategoryTheme } from '../lib/colorThemes';

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

  const quickSearchTags = [
    { label: 'Sony ANC', catId: 'cat-electronics' },
    { label: 'Solid Walnut', catId: 'cat-home' },
    { label: 'Selvedge Denim', catId: 'cat-fashion' },
    { label: 'MacBook Pro', catId: 'cat-electronics' },
    { label: 'Niche Fragrance', catId: 'cat-beauty' },
    { label: 'E-Bikes', catId: 'cat-vehicles' }
  ];

  return (
    <div id="home-view" className="space-y-14 sm:space-y-20 pb-20">
      {/* Hero Section with Soothing Warm Gradient and Ambient Lights */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-stone-50/70 to-white dark:from-stone-900/90 dark:via-stone-950 dark:to-stone-950 border-b border-stone-200/80 dark:border-stone-800/80 pt-10 pb-16 sm:py-20">
        {/* Subtle Ambient Color Blobs for Depth */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-400/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-wide shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Verified Independent Creators, Artisans & Collectors</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-50 tracking-tight leading-[1.1]">
                Buy & sell exceptional goods with confidence.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                A warm, refined peer-to-peer marketplace featuring authenticated tech, handcrafted furniture, rare vintage apparel, and curated collectibles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('browse')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-extrabold text-sm shadow-xl shadow-stone-900/10 dark:shadow-amber-500/20 hover:shadow-2xl transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('create-listing')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 border border-stone-300/80 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold text-sm transition-all hover:border-amber-400/70 active:scale-98 shadow-xs"
                >
                  Start Selling
                </button>
              </div>

              {/* Popular Tags with Category-matching styles */}
              <div className="pt-3 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-stone-500 font-medium">Trending Picks:</span>
                {quickSearchTags.map(tag => {
                  const theme = getCategoryTheme(tag.catId);
                  return (
                    <button
                      key={tag.label}
                      onClick={() => {
                        setFilter({ searchQuery: tag.label, categoryId: tag.catId });
                        navigate('browse');
                      }}
                      className={`px-3 py-1 rounded-full border text-xs font-semibold transition-all hover:scale-105 ${theme.badge}`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden bg-stone-900 p-2 shadow-2xl shadow-stone-900/20 border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Featured item"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent rounded-2xl pointer-events-none" />

                {/* Floating pill highlight */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-stone-900/90 dark:bg-stone-900/95 backdrop-blur-md border border-stone-700/80 shadow-2xl flex items-center justify-between text-white">
                  <div className="min-w-0 pr-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                      Editor&apos;s Spotlight
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-stone-100 truncate">
                      Sony WH-1000XM5 ANC Headphones
                    </h3>
                    <p className="text-xs text-stone-400 font-medium">$348.00 • TechVault Pro (4.95★)</p>
                  </div>
                  <button
                    onClick={() => navigate('product', { productId: 'prod-1' })}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold shrink-0 transition-all active:scale-95 shadow-md"
                  >
                    View Drop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid with Refined Department Themes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Browse by Department</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Explore Popular Categories
            </h2>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            All Departments <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const theme = getCategoryTheme(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setFilter({ categoryId: cat.id, searchQuery: '' });
                  navigate('browse');
                }}
                className={`group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 ${theme.borderHover}`}
              >
                <img
                  src={cat.bannerImage}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-75 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-transparent" />
                
                {/* Category pill indicator */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-xs ${theme.badge}`}>
                    {cat.itemCount} items
                  </span>
                </div>

                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 opacity-90 mt-0.5 line-clamp-1">
                    {cat.subcategories.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Flash Sale Section with Warm Midnight Embers Palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white border border-amber-900/40 shadow-2xl relative overflow-hidden">
          {/* Glowing ember highlights */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-md">
                <Zap className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                  Daily Limited Deals
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Flash Discounts of the Day
                </h2>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-2.5 bg-stone-900/90 px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-lg">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-stone-300">Ending in:</span>
              <div className="flex items-center gap-1 font-mono text-sm font-black text-amber-300">
                <span className="bg-stone-950 px-2 py-0.5 rounded-lg border border-amber-500/20">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span className="text-amber-500">:</span>
                <span className="bg-stone-950 px-2 py-0.5 rounded-lg border border-amber-500/20">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span className="text-amber-500">:</span>
                <span className="bg-stone-950 px-2 py-0.5 rounded-lg border border-amber-500/20">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4 relative z-10">
            {flashDeals.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Curated Featured Products */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Featured Marketplace Listings
            </h2>
          </div>
          <button
            onClick={() => navigate('browse')}
            className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors shrink-0"
          >
            View All ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
          {featuredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Top Verified Sellers Spotlight with Soft Card Palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-b from-stone-100/90 to-stone-50/60 dark:from-stone-900/90 dark:to-stone-950 border border-stone-200/90 dark:border-stone-800">
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Trusted Merchants</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Top-Rated Verified Sellers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              Every verified merchant undergoes identity validation, quality vetting, and active buyer feedback monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topSellers.map(seller => (
              <div
                key={seller.id}
                onClick={() => navigate('profile', { userId: seller.id })}
                className="group p-5 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/90 dark:border-stone-700 hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={seller.avatar}
                      alt={seller.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/40 shadow-xs"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {seller.storeName || seller.name}
                        </h4>
                        <CheckCircle className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      </div>
                      <p className="text-xs text-stone-500">{seller.location}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {seller.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 text-xs">
                  <div className="flex items-center gap-1 font-bold text-stone-800 dark:text-stone-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{seller.rating.toFixed(2)}</span>
                    <span className="text-stone-400 font-normal">({seller.reviewCount} reviews)</span>
                  </div>
                  <span className="text-amber-700 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Visit Shop <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Fresh Arrivals</span>
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
              Latest Additions to the Marketplace
            </h2>
          </div>
          <button
            onClick={() => {
              setFilter({ sortBy: 'newest' });
              navigate('browse');
            }}
            className="text-xs font-bold text-rose-700 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 flex items-center gap-1 transition-colors shrink-0"
          >
            See All New <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
          {latestListings.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Sell With Us CTA Banner with Rich Royal Indigo & Amber Gold */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-950 via-indigo-950 to-stone-950 text-white p-8 sm:p-12 shadow-2xl border border-indigo-900/40">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="max-w-xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Direct Creator & Seller Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Turn your craft or curated goods into thriving revenue.
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              List in minutes with zero upfront fees. Benefit from automated buyer escrow, instant payouts, and integrated messaging.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => navigate('create-listing')}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shadow-lg transition-all active:scale-95"
              >
                Create First Listing
              </button>
              <button
                onClick={() => navigate('help', { section: 'seller-fees' })}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all backdrop-blur-xs border border-white/20"
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
