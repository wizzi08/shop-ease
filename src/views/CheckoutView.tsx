import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShippingAddress, PaymentDetails } from '../types';

interface CheckoutViewProps {
  discount?: number;
  couponCode?: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ discount = 0, couponCode }) => {
  const { cart, cartSubtotal, currentUser, createOrder, navigate, openAuthModal, addToast } =
    useMarketplace();

  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || 'Alex Morgan',
    streetAddress: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
    phone: '+1 (555) 234-5678'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardholderName: currentUser?.name || 'Alex Morgan',
    expiryDate: '08/28',
    cvv: '888'
  });

  const [orderNotes, setOrderNotes] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate('browse')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const shippingCost = cart.reduce((sum, item) => {
    const selected =
      item.product.shippingOptions.find(s => s.id === item.selectedShippingId) ||
      item.product.shippingOptions[0];
    return sum + (selected?.price || 0);
  }, 0);

  const tax = Number(((cartSubtotal - discount) * 0.08).toFixed(2));
  const grandTotal = Number((cartSubtotal - discount + shippingCost + tax).toFixed(2));

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingAddress.fullName || !shippingAddress.streetAddress || !shippingAddress.city) {
      addToast('error', 'Incomplete Address', 'Please complete all required shipping fields.');
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway latency (Stripe / Escrow processor)
    setTimeout(() => {
      const payment: PaymentDetails = {
        method: paymentMethod,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        last4: paymentMethod === 'card' ? '4242' : undefined,
        brand: paymentMethod === 'card' ? 'Visa' : paymentMethod,
        amount: grandTotal,
        currency: 'USD',
        status: 'completed',
        timestamp: new Date().toISOString()
      };

      const newOrder = createOrder({
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
          shippingOption:
            item.product.shippingOptions.find(s => s.id === item.selectedShippingId) ||
            item.product.shippingOptions[0]
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          street: shippingAddress.streetAddress || shippingAddress.street || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone
        },
        paymentMethod: {
          type: paymentMethod === 'apple_pay' ? 'apple_pay' : 'card',
          brand: paymentMethod === 'card' ? 'Visa' : paymentMethod === 'apple_pay' ? 'Apple Pay' : 'PayPal',
          last4: paymentMethod === 'card' ? (payment.last4 || '4242') : 'N/A'
        },
        couponCode,
        discount
      });

      setIsProcessing(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback if canvas-confetti doesn't fire
      }

      navigate('order-confirmation', { orderId: newOrder.id });
    }, 1500);
  };

  return (
    <div id="checkout-view" className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 mb-6 text-xs text-zinc-500">
        <button onClick={() => navigate('cart')} className="flex items-center gap-1 hover:text-zinc-900">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left 7 cols: Checkout Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Step 1: Shipping Address */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Shipping Destination
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={e => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Street Address & Apt / Suite *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.streetAddress}
                    onChange={e => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Postal / ZIP *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Contact Phone Number (For Courier Updates)
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method (Stripe Escrow) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Payment & Escrow Protection
                  </h2>
                  <p className="text-[11px] text-zinc-500">Funds are held safely until verified delivery</p>
                </div>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="font-black text-sm italic text-blue-600">PayPal</span>
                  <span>PayPal Balance</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'apple_pay'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <span className="font-bold text-sm"> Pay</span>
                  <span>Apple Pay</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={e => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={e => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300">
                  You will complete your authentication securely with your linked PayPal account upon clicking Authorize.
                </div>
              )}

              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-800 dark:text-zinc-200">
                  Biometric authorization will be prompted on your Apple Wallet device.
                </div>
              )}
            </div>

            {/* Step 3: Instructions for Seller */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
              <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Special Delivery Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                placeholder="Gate code, buzzer instructions, or handling requests..."
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment & Authorizing Escrow...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Authorize & Place Order (${grandTotal.toFixed(2)})
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 5 cols: Order Items & Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Review Items ({cart.length})
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto space-y-3 pr-1">
              {cart.map(item => (
                <div key={item.productId} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-14 h-14 rounded-xl object-cover bg-zinc-100 shrink-0 border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {item.product.title}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Qty: {item.quantity} • ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Seller: {item.product.sellerName}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">${cartSubtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>State Tax</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total Due</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-600 dark:text-zinc-300">
                <strong className="text-zinc-900 dark:text-zinc-100">Escrow Protected:</strong> Funds will only be released to the seller once the carrier marks the parcel as safely delivered.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
