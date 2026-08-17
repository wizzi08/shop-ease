import React, { useState } from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  FileText,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { BackButton } from '../components/common/BackButton';

interface OrderConfirmationViewProps {
  orderId?: string;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ orderId }) => {
  const { orders, navigate, addToast, startConversationWithSeller } = useMarketplace();

  const order = orders.find(o => o.id === orderId) || orders[0];
  const [showTrackingDetail, setShowTrackingDetail] = useState(false);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">No recent order found</h2>
        <button onClick={() => navigate('home')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs">
          Return Home
        </button>
      </div>
    );
  }

  const handleDownloadInvoice = () => {
    addToast('success', 'Invoice Downloaded', `PDF receipt for Order #${order.id} generated.`);
  };

  return (
    <div id="order-confirmation-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <BackButton variant="pill" label="Back to Marketplace" fallbackView="browse" />
      </div>

      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Payment Authorized & Order Confirmed!
        </h1>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          Thank you for shopping on Meridian. Your order has been dispatched to the seller for packaging and priority dispatch.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
          Order ID: #{order.id}
        </div>
      </div>

      {/* Tracking Tracker Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Carrier Delivery Progress
              </h3>
              <p className="text-xs text-zinc-500">
                {order.trackingNumber ? `FedEx / UPS: ${order.trackingNumber}` : 'Tracking will update shortly'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTrackingDetail(!showTrackingDetail)}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              {showTrackingDetail ? 'Hide Live Timeline' : 'View Live Tracking'}
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
              title="Download Invoice"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold mx-auto flex items-center justify-center">
              ✓
            </div>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">Confirmed</p>
            <p className="text-[10px] text-zinc-400">Payment Escrowed</p>
          </div>

          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold mx-auto flex items-center justify-center animate-pulse">
              2
            </div>
            <p className="font-bold text-zinc-900 dark:text-zinc-100">Processing</p>
            <p className="text-[10px] text-zinc-400">Seller Packaging</p>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 font-bold mx-auto flex items-center justify-center">
              3
            </div>
            <p className="font-bold text-zinc-700 dark:text-zinc-300">In Transit</p>
            <p className="text-[10px] text-zinc-400">Carrier Scanned</p>
          </div>

          <div className="space-y-1 opacity-50">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 font-bold mx-auto flex items-center justify-center">
              4
            </div>
            <p className="font-bold text-zinc-700 dark:text-zinc-300">Delivered</p>
            <p className="text-[10px] text-zinc-400">Signature Confirmed</p>
          </div>
        </div>

        {/* Live Timeline Expansion */}
        {showTrackingDetail && (
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  Order placed and seller alerted
                </span>
                <p className="text-zinc-500 text-[11px]">{new Date().toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 mt-1.5 shrink-0" />
              <div>
                <span className="text-zinc-500">Carrier dispatch pickup scheduled</span>
                <p className="text-zinc-400 text-[11px]">Expected within 24 hours</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Items Breakdown & Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Purchased Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Items in this Shipment
          </h3>

          <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800">
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-3 pt-3 first:pt-0">
                <img
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-14 h-14 rounded-xl object-cover bg-zinc-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.productTitle}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Qty: {item.quantity} • ${item.price.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-zinc-400">Sold by {item.sellerName}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5 text-zinc-600 dark:text-zinc-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span>Total Paid</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Escrow Assurance */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Delivery Address</span>
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-zinc-400 mt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Full Meridian Buyer Protection Active</span>
            </div>
            <p className="leading-relaxed">
              Your payment is locked in Stripe escrow and insured up to $10,000 against loss or inaccurate condition.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={() => navigate('buyer-dashboard')}
          className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all"
        >
          View in Buyer Dashboard
        </button>
        <button
          onClick={() => navigate('browse')}
          className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold text-xs transition-all"
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
};
