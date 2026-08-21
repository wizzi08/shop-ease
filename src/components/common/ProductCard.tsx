import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, CheckCircle, ShieldCheck, MapPin, Edit3, Truck } from 'lucide-react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CONDITION_THEMES, getCategoryTheme } from '../../lib/colorThemes';

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

  const cond = CONDITION_THEMES[product.condition] || CONDITION_THEMES.good;
  const categoryTheme = getCategoryTheme(product.categoryId);
  const hasFreeShipping = product.shippingOptions.some(s => s.isFree || s.price === 0);

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
        className="group flex flex-col sm:flex-row gap-3.5 p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-400/60 dark:hover:border-amber-500/50 hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300 cursor-pointer"
      >
        <div className="relative w-full sm:w-44 h-40 sm:h-auto rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800/80 shrink-0">
          <img
            src={product.images[currentImageIndex] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('edit-listing', { productId: product.id });
                }}
                className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
                title="Admin: Edit Product"
                aria-label="Admin edit product"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                isFavorited
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-rose-500 shadow-xs'
              }`}
              aria-label="Save to wishlist"
            >
              <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryTheme.badge}`}>
                {categoryTheme.name}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${cond.badge}`}>
                {cond.label}
              </span>
              {hasFreeShipping && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Truck className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                  Free Ship
                </span>
              )}
              {product.featured && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Featured
                </span>
              )}
              {product.stock <= 3 && product.stock > 0 && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {product.stock} left
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-[15px] font-bold text-stone-900 dark:text-stone-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {product.title}
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-2.5 mt-2.5 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} <span className="font-normal text-stone-400">({product.reviewCount})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-400" />
                {product.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                <CheckCircle className="w-3 h-3 text-sky-500" />
                {product.sellerName}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-50">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60">
                  Save ${(product.originalPrice! - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3" />
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
      className="group relative flex flex-col rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 hover:border-amber-400/70 dark:hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 dark:bg-stone-800/60 overflow-hidden">
        <img
          src={product.images[currentImageIndex] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col items-start gap-1 z-10">
          <span className={`text-[8.5px] sm:text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded sm:rounded-md border shadow-2xs backdrop-blur-xs leading-tight ${cond.badge}`}>
            {cond.label}
          </span>
          {hasDiscount && (
            <span className="text-[8.5px] sm:text-[9px] font-black px-1.5 py-0.5 rounded sm:rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs leading-tight">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist and Admin Edit Buttons */}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-1 z-10">
          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('edit-listing', { productId: product.id });
              }}
              className="p-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
              title="Admin: Edit Product"
              aria-label="Admin edit product"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-md scale-105'
                : 'bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-300 hover:text-rose-500 shadow-2xs'
            }`}
            aria-label="Save to wishlist"
          >
            <Heart className={`w-3 h-3 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Multi-image indicator dots on hover */}
        {product.images.length > 1 && isHovered && (
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center gap-1 z-10">
            {product.images.map((_, idx) => (
              <button
                key={idx}
                onMouseEnter={e => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-1 rounded-full transition-all ${
                  currentImageIndex === idx ? 'w-3.5 bg-amber-400 shadow-xs' : 'w-1 bg-white/70'
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Fast Action Quick-Add Overlay */}
        <div className="absolute inset-x-2 bottom-2 hidden group-hover:flex items-center gap-1 z-20">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-stone-900/95 dark:bg-amber-500 dark:hover:bg-amber-400 hover:bg-stone-900 text-white dark:text-stone-950 text-[11px] font-bold shadow-md backdrop-blur-sm transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-2.5 sm:p-3">
        {/* Category Pill and Seller info */}
        <div className="flex items-center justify-between text-xs mb-1 gap-1">
          <span className={`text-[8.5px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full border truncate max-w-[80px] sm:max-w-none leading-none ${categoryTheme.badge}`}>
            {categoryTheme.name}
          </span>
          <span className="flex items-center gap-0.5 text-stone-700 dark:text-stone-300 text-[10px] sm:text-[11px] font-bold shrink-0">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-[13px] font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.title}
        </h3>

        {/* Seller name & location */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-stone-500 dark:text-stone-400 mt-1">
          <span className="flex items-center gap-0.5 truncate font-medium">
            {product.sellerName}
            {product.sellerVerified && (
              <CheckCircle className="w-2.5 h-2.5 text-sky-500 shrink-0" />
            )}
          </span>
          <span className="flex items-center gap-0.5 text-stone-400 shrink-0">
            <MapPin className="w-2.5 h-2.5" />
            {product.location.split(',')[0]}
          </span>
        </div>

        {/* Price and Stock Details */}
        <div className="mt-auto pt-1.5 sm:pt-2 flex items-baseline justify-between border-t border-stone-100 dark:border-stone-800/80 gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-[14px] md:text-[15px] font-black text-stone-900 dark:text-stone-50 shrink-0">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="hidden min-[380px]:inline text-[9px] sm:text-[10px] text-stone-400 line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {hasFreeShipping ? (
            <span className="text-[8px] sm:text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/60 leading-none">
              Free ship
            </span>
          ) : (
            <span className="text-[8px] sm:text-[9px] text-stone-400 font-medium">
              +{product.shippingOptions[0]?.price ? `$${product.shippingOptions[0].price.toFixed(0)}` : 'ship'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
