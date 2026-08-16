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
    <footer id="main-footer" className="bg-zinc-900 text-zinc-300 pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-zinc-800">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Buyer Protection</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Full refund if item is not as described or never arrives.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Stripe Verified Escrow</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Bank-level 256-bit encryption. Funds held securely until delivery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Tracked Express Shipping</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Real-time tracking and verified carrier scans across the globe.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-800/40 border border-zinc-800">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Simple Direct Returns</h4>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Hassle-free 14 to 30 day return policies on qualified items.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-zinc-800">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-base">
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Meridian Marketplace</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              The modern, decentralized marketplace connecting independent creators, collectors, and certified refurbishers with discerning buyers worldwide.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
              <p className="text-xs font-semibold text-white mb-2">Get Curated Weekly Drops:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Cols */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Shop Categories</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button
                  onClick={() => {
                    setFilter({ categoryId: 'cat-electronics' });
                    navigate('browse');
                  }}
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  E-Bikes & Vehicles
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Selling & Hub</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => navigate('create-listing')} className="hover:text-white transition-colors">
                  Create a Listing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-dashboard')} className="hover:text-white transition-colors">
                  Seller Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-dashboard', { tab: 'payouts' })} className="hover:text-white transition-colors">
                  Seller Payouts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help', { section: 'seller-fees' })} className="hover:text-white transition-colors">
                  Fee Structure (4-7%)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin-dashboard')} className="hover:text-white transition-colors text-amber-400">
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Support & Trust</h5>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => navigate('help')} className="hover:text-white transition-colors">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('buyer-dashboard')} className="hover:text-white transition-colors">
                  Track My Orders
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('help', { section: 'contact' })} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Meridian Marketplace Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Stripe Payments & Express Logistics</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for commerce
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
