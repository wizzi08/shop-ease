import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Lock,
  RotateCcw,
  Truck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    updateCartShipping,
    clearCart,
    cartSubtotal,
    cartItemCount,
    navigate
  } = useMarketplace();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'MERIDIAN15') {
      setDiscountPercent(15);
      setCouponMessage('15% discount applied successfully!');
    } else if (couponCode.trim().toUpperCase() === 'SAVE10') {
      setDiscountPercent(10);
      setCouponMessage('10% discount applied successfully!');
    } else {
      setCouponMessage('Invalid code. Try "MERIDIAN15"');
    }
  };

  const discountAmount = Number(((cartSubtotal * discountPercent) / 100).toFixed(2));
  const shippingTotal = cart.reduce((sum, item) => {
    const selected = item.product.shippingOptions.find(s => s.id === item.selectedShippingId) || item.product.shippingOptions[0];
    return sum + (selected?.price || 0);
  }, 0);
  const estimatedTax = Number(((cartSubtotal - discountAmount) * 0.08).toFixed(2));
  const total = Number((cartSubtotal - discountAmount + shippingTotal + estimatedTax).toFixed(2));

  if (cart.length === 0) {
    return (
      <div id="cart-view" className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-zinc-500 max-w-sm mx-auto">
          Explore curated drops from independent sellers, artisans, and verified electronics refurbishers.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('browse')}
            className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md transition-all"
          >
            Explore Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-rose-500 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const currentShipping =
              item.product.shippingOptions.find(s => s.id === item.selectedShippingId) ||
              item.product.shippingOptions[0];

            return (
              <div
                key={item.productId}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row gap-5"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-full sm:w-32 h-32 rounded-2xl object-cover bg-zinc-100 dark:bg-zinc-800 shrink-0 cursor-pointer"
                  onClick={() => navigate('product', { productId: item.productId })}
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => navigate('product', { productId: item.productId })}
                        className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-zinc-400 hover:text-rose-500 rounded-lg"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-500 mt-0.5">
                      Sold by <strong className="text-zinc-700 dark:text-zinc-300">{item.product.sellerName}</strong> • {item.product.condition.replace('_', ' ')}
                    </p>
                  </div>

                  {/* Shipping option selector inside item */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                      Delivery Method:
                    </label>
                    <select
                      value={item.selectedShippingId}
                      onChange={e => updateCartShipping(item.productId, e.target.value)}
                      className="w-full sm:w-auto text-xs px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    >
                      {item.product.shippingOptions.map(ship => (
                        <option key={ship.id} value={ship.id}>
                          {ship.name} ({ship.isFree || ship.price === 0 ? 'FREE' : `$${ship.price.toFixed(2)}`})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price & Quantity Adjuster */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold min-w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-zinc-400">
                          ${item.product.price.toFixed(2)} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-5 sticky top-24">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
            <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon: MERIDIAN15"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs ${discountPercent > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-600'}`}>
                  {couponMessage}
                </p>
              )}
            </form>

            {/* Calculation Lines */}
            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">${cartSubtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {shippingTotal === 0 ? 'FREE' : `$${shippingTotal.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated State Tax (8%)</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">${estimatedTax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total Amount</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => navigate('checkout', { discount: discountAmount, couponCode: discountPercent > 0 ? couponCode : undefined })}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Stripe 256-bit encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
