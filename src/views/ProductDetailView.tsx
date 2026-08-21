import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle,
  ShieldCheck,
  Shield,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  MessageSquare,
  Share2,
  AlertTriangle,
  MapPin,
  ChevronRight,
  Plus,
  Minus,
  Check,
  Eye,
  ThumbsUp,
  Tag,
  ArrowRight,
  Edit3,
  Trash2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { ReviewModal } from '../components/common/ReviewModal';
import { ReportModal } from '../components/common/ReportModal';
import { BackButton } from '../components/common/BackButton';
import { ProductStatus } from '../types';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const {
    currentUser,
    getProduct,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    reviews,
    voteReviewHelpful,
    startConversationWithSeller,
    incrementProductViews,
    updateProduct,
    deleteProduct,
    navigate,
    addToast
  } = useMarketplace();

  const product = getProduct(productId) || products[0];
  const isAdmin = currentUser?.role === 'admin';
  const isSeller = currentUser?.id === product?.sellerId;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedShippingId, setSelectedShippingId] = useState(
    product?.shippingOptions[0]?.id || 'ship-1'
  );
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');

  // Track product view count on load
  useEffect(() => {
    if (product) {
      incrementProductViews(product.id);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
        <button
          onClick={() => navigate('browse')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const selectedShippingOption =
    product.shippingOptions.find(s => s.id === selectedShippingId) || product.shippingOptions[0];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedShippingId);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedShippingId);
    navigate('checkout');
  };

  const handleMessageSeller = () => {
    startConversationWithSeller(
      product.sellerId,
      `Hello! I'm inquiring about "${product.title}". Is this still available?`,
      product
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('info', 'Link Copied', 'Product link has been copied to your clipboard.');
  };

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Top Navigation Row: Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <BackButton variant="pill" label="Back" fallbackView="browse" />
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap">
            <button onClick={() => navigate('home')} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('browse')} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Marketplace
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-xs">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Admin / Seller Moderation Toolbar */}
      {(isAdmin || isSeller) && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                {isAdmin ? 'Super Admin Product Control' : 'Seller Listing Management'}
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold text-[10px] uppercase">
                  {product.status}
                </span>
                {product.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-semibold text-[10px]">
                    Featured
                  </span>
                )}
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                {isAdmin
                  ? 'You have global administrative rights to modify all product fields, pricing, inventory, and status.'
                  : 'You are the merchant of this listing and can make changes anytime.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={product.status}
              onChange={(e) => {
                const newStat = e.target.value as ProductStatus;
                updateProduct({ ...product, status: newStat });
                addToast('success', 'Status Updated', `Listing status is now ${newStat}.`);
              }}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 font-bold capitalize text-zinc-900 dark:text-zinc-100 cursor-pointer"
            >
              <option value="active">Active (Live)</option>
              <option value="draft">Draft (Private)</option>
              <option value="paused">Paused (Hidden)</option>
              <option value="sold">Sold Out</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              type="button"
              onClick={() => {
                updateProduct({ ...product, featured: !product.featured });
                addToast('info', 'Featured Toggled', `"${product.title}" featured flag is now ${!product.featured ? 'ON' : 'OFF'}.`);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                product.featured
                  ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-amber-500'
              }`}
              title="Toggle Featured on homepage"
            >
              <Star className={`w-4 h-4 ${product.featured ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => navigate('edit-listing', { productId: product.id })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Listing</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to permanently delete listing "${product.title}"?`)) {
                    deleteProduct(product.id);
                    navigate('admin-dashboard');
                  }
                }}
                className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                title="Delete Listing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Gallery + Purchasing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Photo */}
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-rose-600 text-white shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                isFavorited
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-300 hover:text-rose-500'
              }`}
              title="Save to wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-600/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Value Assurance Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Buyer Protection</p>
              <p className="text-[10px] text-zinc-500">Money back guarantee</p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Tracked Shipping</p>
              <p className="text-[10px] text-zinc-500">Fast carrier dispatch</p>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 text-center">
              <RotateCcw className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Authenticity</p>
              <p className="text-[10px] text-zinc-500">Verified seller audit</p>
            </div>
          </div>
        </div>

        {/* Right Column: Listing Details & Buy Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Seller Header Summary */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800">
            <div
              onClick={() => navigate('profile', { userId: product.sellerId })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="w-10 h-10 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600">
                    {product.sellerName}
                  </span>
                  {product.sellerVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{product.sellerRating.toFixed(2)} rating</span>
                  <span>•</span>
                  <span>{product.location}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleMessageSeller}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              <span>Inquire</span>
            </button>
          </div>

          {/* Title and Ratings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                {product.condition.replace('_', ' ')}
              </span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {product.views} views
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400">({product.reviewCount} customer reviews)</span>
              </div>
              <span>•</span>
              <span className="text-zinc-500">SKU: {product.id}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-zinc-400 line-through">
                    ${product.originalPrice!.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    Save ${(product.originalPrice! - product.price).toFixed(2)} ({discountPercent}%)
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-zinc-500">
              Tax calculated at checkout • Secure Stripe Payment
            </p>
          </div>

          {/* Delivery & Shipping Option Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Delivery Method
            </label>
            <div className="space-y-2">
              {product.shippingOptions.map(ship => (
                <label
                  key={ship.id}
                  onClick={() => setSelectedShippingId(ship.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedShippingId === ship.id
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 text-zinc-900 dark:text-zinc-100 ring-1 ring-blue-600'
                      : 'border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="shipping"
                      checked={selectedShippingId === ship.id}
                      onChange={() => setSelectedShippingId(ship.id)}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="text-xs font-bold">{ship.name}</div>
                      <div className="text-[11px] text-zinc-500">{ship.estimatedDays}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold">
                    {ship.isFree || ship.price === 0 ? 'FREE' : `$${ship.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Stock Alert */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Quantity
              </label>
              <span className={product.stock <= 3 ? 'text-rose-600 font-semibold' : 'text-zinc-500'}>
                {product.stock > 0 ? `${product.stock} items available in inventory` : 'Out of stock'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-zinc-900 dark:text-zinc-100 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Share & Report Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  title="Share item link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  title="Report listing"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-98 disabled:opacity-50"
            >
              Buy with 1-Click
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Reviews */}
      <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Specifications ({product.specifications.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'details' && (
            <div className="max-w-3xl space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>{product.description}</p>
              {product.deliveryInfo && (
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
                  <Truck className="w-5 h-5 text-blue-500 shrink-0" />
                  <span>{product.deliveryInfo}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {product.specifications.map((spec, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-zinc-50 dark:bg-zinc-900/50' : 'bg-white dark:bg-zinc-900'}
                    >
                      <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100 w-1/3 border-b border-zinc-100 dark:border-zinc-800">
                        {spec.name}
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-300 border-b border-zinc-100 dark:border-zinc-800">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Review Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-zinc-900 dark:text-zinc-100">
                    {product.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(product.rating) ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Based on {productReviews.length} verified ratings</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
                >
                  Write a Review
                </button>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4">No reviews yet. Be the first to review this product!</p>
                ) : (
                  productReviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.buyerAvatar}
                            alt={rev.buyerName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                {rev.buyerName}
                              </span>
                              {rev.verifiedPurchase && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-amber-400 mt-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= rev.rating ? 'fill-current' : 'text-zinc-300 dark:text-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] text-zinc-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{rev.title}</h4>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>

                      {rev.sellerResponse && (
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border-l-2 border-blue-600 text-xs mt-2">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            Seller Response ({product.sellerName}):
                          </p>
                          <p className="text-zinc-600 dark:text-zinc-300 mt-0.5">
                            {rev.sellerResponse.comment}
                          </p>
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-4 text-xs text-zinc-400">
                        <button
                          onClick={() => voteReviewHelpful(rev.id)}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({rev.helpfulVotes})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              More in {product.subcategory || 'this Department'}
            </h2>
            <button
              onClick={() => {
                navigate('browse');
              }}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType="product"
        targetId={product.id}
        targetTitle={product.title}
      />
    </div>
  );
};
