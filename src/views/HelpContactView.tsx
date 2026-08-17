import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ShieldCheck,
  RotateCcw,
  Truck,
  DollarSign,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackButton } from '../components/common/BackButton';

interface HelpContactViewProps {
  section?: string;
}

export const HelpContactView: React.FC<HelpContactViewProps> = () => {
  const { addToast } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Ticket Form
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Order Inquiries');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How does Meridian Escrow Buyer Protection work?',
      a: 'When you purchase an item on Meridian, your payment is placed in a secure Stripe escrow holding vault. The seller prepares and ships your parcel with full carrier tracking. The payout is only released to the seller after the carrier confirms delivery and you have inspected the merchandise for accuracy.'
    },
    {
      q: 'What are the selling fees on Meridian?',
      a: 'Listing items is 100% free with no monthly subscription required. We charge a flat 5% platform fee on completed sales, which covers Stripe processing, payment protection escrow, and 24/7 moderation support.'
    },
    {
      q: 'When do sellers receive their payout funds?',
      a: 'Funds become available in your Seller Dashboard within 24 hours of verified carrier delivery. You can transfer your funds directly to your bank account anytime using our Instant Payout button.'
    },
    {
      q: 'What should I do if an item arrives damaged or not as described?',
      a: 'You have 48 hours following carrier delivery to open a dispute. Simply visit your Buyer Dashboard, locate the order, and click "Open Resolution Ticket". Our Trust & Safety team will freeze the escrow and issue a return shipping label or refund.'
    },
    {
      q: 'Can I negotiate prices with sellers?',
      a: 'Yes! When viewing any product, you can click "Inquire / Contact Seller" to open a direct messaging thread and submit a "Make an Offer" proposal.'
    }
  ];

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;
    setIsSubmitted(true);
    addToast('success', 'Ticket Created', 'Support ticket #TKT-8942 received. Expect a response within 4 hours.');
  };

  return (
    <div id="help-contact-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div>
        <BackButton variant="pill" label="Back to previous page" fallbackView="home" />
      </div>

      {/* Hero Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Support & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          How can we help you today?
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Search frequently asked questions or submit a ticket directly to our 24/7 Trust & Safety team.
        </p>

        <div className="max-w-md mx-auto relative pt-4">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 mt-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. escrow, payouts, return labels)..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
          />
        </div>
      </div>

      {/* FAQs Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Ticket Submission */}
      <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Contact Support & Disputes
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Our dispute resolution team operates 24/7. Responses arrive via email.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
              Message Dispatched
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
              Our agent team has received your ticket and will follow up shortly at {ticketEmail}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={e => setTicketName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={e => setTicketEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Topic / Category
              </label>
              <select
                value={ticketSubject}
                onChange={e => setTicketSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              >
                <option value="Order Inquiries">Order Delivery & Tracking</option>
                <option value="Escrow Dispute">Escrow Dispute & Return Request</option>
                <option value="Seller Payouts">Seller Payouts & Stripe Account</option>
                <option value="Account Safety">Report Suspicious Activity / Fraud</option>
                <option value="General">Other Marketplace Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Describe Your Issue
              </label>
              <textarea
                required
                rows={4}
                value={ticketMessage}
                onChange={e => setTicketMessage(e.target.value)}
                placeholder="Include order numbers, item names, or carrier tracking codes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Support Ticket
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
