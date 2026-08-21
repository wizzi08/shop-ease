import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, ArrowRight, Mail, Heart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Footer: React.FC = () => {
  const { navigate, setFilter, addToast } = useMarketplace();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast('success', 'Subscribed!', 'You are now on our weekly VIP marketplace curation newsletter.');
    setEmail('');
  };

  return (
    <footer id="main-footer" className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Banners with Soft Chromatic Glow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-12 mb-12 border-b border-stone-800/80">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-sky-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 shrink-0 border border-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-100">Buyer Protection</h4>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Full refund guarantee if item is not as described or never arrives.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-purple-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 shrink-0 border border-purple-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-100">Escrow Security</h4>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                256-bit encryption. Seller payouts released upon verified buyer delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-emerald-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0 border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-100">Express Tracked Carrier</h4>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Real-time tracking and verified carrier scans across global destinations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0 border border-amber-500/20">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-100">Simple Direct Returns</h4>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                Hassle-free 14 to 30 day return policies on verified listings.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                M
              </div>
              <span className="text-lg font-black text-white tracking-tight">Meridian Marketplace</span>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              The modern, curated marketplace connecting independent creators, collectors, and certified refurbishers with discerning buyers worldwide.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <p className="text-xs font-bold text-stone-200 mb-2">Get Curated Weekly Drops:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700/80 text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Cols */}
          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-3.5">Shop Categories</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-electronics' });
                    navigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  Electronics & Tech
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-home' });
                    navigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  Home & Furniture
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-fashion' });
                    navigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  Fashion & Vintage
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-collectibles' });
                    navigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  Collectibles & Art
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-vehicles' });
                    navigate('browse');
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  E-Bikes & Vehicles
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-3.5">Selling & Hub</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('create-listing')} className="hover:text-amber-300 transition-colors">
                  Create a Listing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-dashboard')} className="hover:text-amber-300 transition-colors">
                  Seller Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-dashboard', { tab: 'payouts' })} className="hover:text-amber-300 transition-colors">
                  Seller Payouts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help', { section: 'seller-fees' })} className="hover:text-amber-300 transition-colors">
                  Fee Structure (4-7%)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-dashboard')} className="hover:text-amber-300 transition-colors text-amber-400 font-semibold">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-3.5">Support & Trust</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('help')} className="hover:text-amber-300 transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('buyer-dashboard')} className="hover:text-amber-300 transition-colors">
                  Track My Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-amber-300 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-amber-300 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help', { section: 'contact' })} className="hover:text-amber-300 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Meridian Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Stripe Payments Verified</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for creators & buyers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
