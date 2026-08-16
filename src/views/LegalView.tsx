import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface LegalViewProps {
  type?: 'terms' | 'privacy';
}

export const LegalView: React.FC<LegalViewProps> = ({ type = 'terms' }) => {
  const { navigate } = useMarketplace();

  return (
    <div id="legal-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          {type === 'terms' ? 'Terms of Service & Escrow Agreement' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-xs text-zinc-500">Last updated: August 14, 2026 • Version 3.4</p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            1. Marketplace Escrow Protection
          </h2>
          <p>
            Meridian Marketplace operates as a secure intermediary. When a buyer initiates a checkout, funds are deposited into an encrypted escrow holding sub-account. Funds are held in trust until the carrier provides verified delivery confirmation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            2. Seller Listing Standards & Prohibited Items
          </h2>
          <p>
            Sellers guarantee that all listed products are authentic and accurately represent condition (Brand New, Like New, Good, Fair, Refurbished). Counterfeit goods, weapons, hazardous materials, and unauthorized replicas are strictly prohibited and subject to immediate forfeiture and account termination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            3. Platform Fee Structure
          </h2>
          <p>
            Meridian charges a uniform 5% fee on completed merchandise transactions. This covers payment gateway fees, carrier dispute insurance, fraud prevention screening, and customer support.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            4. Returns, Disputes, and Buyer Guarantee
          </h2>
          <p>
            Buyers have a 48-hour inspection period following parcel delivery. If an item is significantly not as described or damaged during transit, buyers may file a resolution request. Meridian will freeze escrow release and facilitate a full refund upon verified return shipment.
          </p>
        </section>
      </div>
    </div>
  );
};
