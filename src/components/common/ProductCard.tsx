import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, CheckCircle, ShieldCheck, MapPin, Eye, Edit3 } from 'lucide-react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { currentUser, navigate, addToCart, toggleWishlist, isInWishlist } = useMarketplace();
  const isAdmin = currentUser?.role === 'admin';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const conditionLabels: Record<string, { label: string; color: string }> = {
    brand_new: { label: 'Brand New', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    like_new: { label: 'Like New', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    good: { label: 'Good Condition', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    fair: { label: 'Fair Condition', color: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    refurbished: { label: 'Certified Refurbished', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
  };

  const cond = conditionLabels[product.condition] || conditionLabels.good;

  const handleCardClick = () => {
    navigate('product', { productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  if (viewMode === 'list') {
    return (
      <div
        id={`product-card-${product.id}`}
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="relative w-full sm:w-56 h-48 sm:h-auto rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
          <img
            src={product.images[currentImageIndex] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('edit-listing', { productId: product.id });
                }}
                className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                title="Admin: Edit Product"
                aria-label="Admin edit product"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:text-rose-500'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cond.color}`}>
                {cond.label}
              </span>
              {product.featured && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Featured
                </span>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  Only {product.stock} left
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.title}
            </h3>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1 font-medium text-zinc-800 dark:text-zinc-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {product.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                {product.sellerName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-zinc-400 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-sm transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800/50 overflow-hidden">
        <img
          src={product.images[currentImageIndex] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <span className={`text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full border shadow-sm ${cond.color}`}>
            {cond.label}
          </span>
          {hasDiscount && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist and Admin Edit Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('edit-listing', { productId: product.id });
              }}
              className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
              title="Admin: Edit Product"
              aria-label="Admin edit product"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/85 dark:bg-zinc-900/85 text-zinc-700 dark:text-zinc-300 hover:text-rose-500'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Multi-image indicator dots on hover */}
        {product.images.length > 1 && isHovered && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={e => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentImageIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Fast Action Quick-Add Overlay */}
        <div className="absolute inset-x-2 bottom-2 hidden group-hover:flex items-center gap-1.5 z-20">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-100/95 hover:bg-zinc-900 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-lg backdrop-blur-sm transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-4">
        {/* Seller info */}
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
          <span className="flex items-center gap-1 truncate font-medium hover:text-zinc-800 dark:hover:text-zinc-200">
            {product.sellerName}
            {product.sellerVerified && (
              <CheckCircle className="w-3 h-3 text-blue-500 shrink-0" />
            )}
          </span>
          <span className="flex items-center gap-0.5 text-zinc-700 dark:text-zinc-300 font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>

        {/* Price and Stock Details */}
        <div className="mt-auto pt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{product.location.split(',')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
