import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartItemCount,
    navigate
  } = useMarketplace();

  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MERIDIAN15') {
      setAppliedDiscount(15);
      setPromoMessage('15% discount applied!');
    } else if (promoCode.trim().toUpperCase() === 'FREESHIP') {
      setAppliedDiscount(10);
      setPromoMessage('$10 shipping discount applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try "MERIDIAN15"');
    }
  };

  const finalTotal = Math.max(0, cartSubtotal - (cartSubtotal * (appliedDiscount / 100)));

  return (
    <div id="cart-drawer" className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Your Cart ({cartItemCount})
                </h2>
                <p className="text-xs text-zinc-500">Free buyer protection guaranteed</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Your cart is empty
                </h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Discover one-of-a-kind tech, crafted furniture, and fashion from verified sellers.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('browse');
                  }}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-xs"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.productId}
                  className="flex gap-3.5 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-white dark:bg-zinc-800 shrink-0 border border-zinc-200/50 dark:border-zinc-700"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            navigate('product', { productId: item.productId });
                          }}
                          className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 hover:text-blue-600 cursor-pointer"
                        >
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-zinc-400 hover:text-rose-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Sold by {item.product.sellerName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals and checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80 space-y-3">
              {/* Promo code mini form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => setPromoCode(e.target.value)}
                    placeholder="Coupon: MERIDIAN15"
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-hidden uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p className={`text-[11px] font-medium ${appliedDiscount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                  {promoMessage}
                </p>
              )}

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">${cartSubtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>-${(cartSubtotal * (appliedDiscount / 100)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping & Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <span>Estimated Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Encrypted 256-bit checkout & Stripe payment protection</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('cart');
                  }}
                  className="py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 text-center transition-all"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('checkout');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md transition-all active:scale-98"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
