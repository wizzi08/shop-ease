import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  X,
  RotateCcw,
  Star,
  Check,
  ChevronDown,
  Filter,
  PackageX
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCondition } from '../types';

export const BrowseView: React.FC = () => {
  const { products, categories, activeFilter, setFilter, resetFilter, navigate } = useMarketplace();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const conditionsList: { id: ProductCondition; label: string }[] = [
    { id: 'brand_new', label: 'Brand New' },
    { id: 'like_new', label: 'Like New' },
    { id: 'good', label: 'Good Condition' },
    { id: 'fair', label: 'Fair Condition' },
    { id: 'refurbished', label: 'Certified Refurbished' }
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    // Search query filter
    if (activeFilter.searchQuery.trim()) {
      const q = activeFilter.searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
      const matchSeller = product.sellerName.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchTags && !matchSeller) return false;
    }

    // Category filter
    if (activeFilter.categoryId && activeFilter.categoryId !== 'all') {
      if (product.categoryId !== activeFilter.categoryId) return false;
    }

    // Subcategory filter
    if (activeFilter.subcategory && activeFilter.subcategory !== 'all') {
      if (product.subcategory !== activeFilter.subcategory) return false;
    }

    // Price range filter
    if (product.price < activeFilter.minPrice) return false;
    if (activeFilter.maxPrice > 0 && product.price > activeFilter.maxPrice) return false;

    // Condition filter
    if (activeFilter.conditions.length > 0) {
      if (!activeFilter.conditions.includes(product.condition)) return false;
    }

    // Location filter
    if (activeFilter.location.trim()) {
      if (!product.location.toLowerCase().includes(activeFilter.location.toLowerCase())) return false;
    }

    // Rating filter
    if (activeFilter.minRating > 0) {
      if (product.rating < activeFilter.minRating) return false;
    }

    // Free shipping filter
    if (activeFilter.freeShippingOnly) {
      const hasFree = product.shippingOptions.some(s => s.isFree || s.price === 0);
      if (!hasFree) return false;
    }

    // In stock only
    if (activeFilter.inStockOnly && product.stock <= 0) return false;

    // Active status only
    if (product.status !== 'active') return false;

    return true;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeFilter.sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (activeFilter.sortBy === 'price_low') {
      return a.price - b.price;
    }
    if (activeFilter.sortBy === 'price_high') {
      return b.price - a.price;
    }
    if (activeFilter.sortBy === 'popularity') {
      return b.views + b.soldCount * 2 - (a.views + a.soldCount * 2);
    }
    if (activeFilter.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // relevance default
    return b.views - a.views;
  });

  const handleConditionToggle = (cond: ProductCondition) => {
    const exists = activeFilter.conditions.includes(cond);
    if (exists) {
      setFilter({ conditions: activeFilter.conditions.filter(c => c !== cond) });
    } else {
      setFilter({ conditions: [...activeFilter.conditions, cond] });
    }
  };

  const selectedCategoryObj = categories.find(c => c.id === activeFilter.categoryId);

  return (
    <div id="browse-view" className="max-w-7xl mx-auto px-2 sm:px-4 sm:px-6 py-6 sm:py-8">
      {/* Header & Active filters strip */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {selectedCategoryObj ? selectedCategoryObj.name : 'Explore All Listings'}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Showing {sortedProducts.length} verified items matching your criteria
            </p>
          </div>

          {/* Controls: Sorting & View Switcher */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 hidden sm:inline">Sort:</span>
              <select
                value={activeFilter.sortBy}
                onChange={e => setFilter({ sortBy: e.target.value as any })}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="relevance">Featured & Relevant</option>
                <option value="newest">Newest Additions</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Grid / List Switcher */}
            <div className="hidden sm:flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl p-0.5 bg-zinc-100 dark:bg-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(activeFilter.searchQuery ||
          activeFilter.categoryId !== 'all' ||
          activeFilter.conditions.length > 0 ||
          activeFilter.freeShippingOnly ||
          activeFilter.inStockOnly ||
          activeFilter.minRating > 0 ||
          activeFilter.maxPrice < 5000) && (
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-zinc-400 font-medium">Active:</span>

            {activeFilter.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-medium">
                Keyword: &quot;{activeFilter.searchQuery}&quot;
                <button onClick={() => setFilter({ searchQuery: '' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategoryObj && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-medium">
                {selectedCategoryObj.name}
                <button onClick={() => setFilter({ categoryId: 'all', subcategory: 'all' })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeFilter.conditions.map(cond => (
              <span
                key={cond}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 font-medium capitalize"
              >
                {cond.replace('_', ' ')}
                <button onClick={() => handleConditionToggle(cond)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {activeFilter.freeShippingOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                Free Shipping
                <button onClick={() => setFilter({ freeShippingOnly: false })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeFilter.minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-medium">
                ★ {activeFilter.minRating}+ Stars
                <button onClick={() => setFilter({ minRating: 0 })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={resetFilter}
              className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1 ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Filter Catalog
            </span>
            <button
              onClick={resetFilter}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              Reset
            </button>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2.5">
              Categories
            </label>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setFilter({ categoryId: 'all', subcategory: 'all' })}
                className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between ${
                  activeFilter.categoryId === 'all'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>All Categories</span>
                <span>{products.length}</span>
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter({ categoryId: cat.id, subcategory: 'all' })}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition-colors flex items-center justify-between ${
                    activeFilter.categoryId === cat.id
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] text-zinc-400">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (if a category is active) */}
          {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                Subcategories
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setFilter({ subcategory: 'all' })}
                  className={`w-full text-left py-1 px-2 rounded-lg ${
                    activeFilter.subcategory === 'all'
                      ? 'font-semibold text-blue-600'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  All in {selectedCategoryObj.name}
                </button>
                {selectedCategoryObj.subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setFilter({ subcategory: sub })}
                    className={`w-full text-left py-1 px-2 rounded-lg ${
                      activeFilter.subcategory === sub
                        ? 'font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                Max Price: ${activeFilter.maxPrice}
              </label>
            </div>
            <input
              type="range"
              min="20"
              max="5000"
              step="20"
              value={activeFilter.maxPrice}
              onChange={e => setFilter({ maxPrice: Number(e.target.value) })}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
              <span>$0</span>
              <span>$2,500</span>
              <span>$5,000+</span>
            </div>
          </div>

          {/* Condition Multi-Check */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2.5">
              Condition
            </label>
            <div className="space-y-2 text-xs">
              {conditionsList.map(cond => {
                const isChecked = activeFilter.conditions.includes(cond.id);
                return (
                  <label
                    key={cond.id}
                    className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300 select-none hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleConditionToggle(cond.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
                    />
                    <span>{cond.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Seller Rating Filter */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
              Minimum Rating
            </label>
            <div className="space-y-1.5 text-xs">
              {[4.8, 4.5, 4.0].map(ratingVal => (
                <button
                  key={ratingVal}
                  onClick={() => setFilter({ minRating: activeFilter.minRating === ratingVal ? 0 : ratingVal })}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg transition-colors ${
                    activeFilter.minRating === ratingVal
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ratingVal}+ Stars</span>
                  </div>
                  {activeFilter.minRating === ratingVal && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Toggles: Free Shipping & In Stock */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">Free Shipping Only</span>
              <input
                type="checkbox"
                checked={activeFilter.freeShippingOnly}
                onChange={e => setFilter({ freeShippingOnly: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">In Stock Only</span>
              <input
                type="checkbox"
                checked={activeFilter.inStockOnly}
                onChange={e => setFilter({ inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
              />
            </label>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-xs bg-white dark:bg-zinc-900 p-5 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-base font-bold">Filter Options</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div>
                  <p className="text-xs font-bold uppercase mb-2">Category</p>
                  <select
                    value={activeFilter.categoryId}
                    onChange={e => setFilter({ categoryId: e.target.value, subcategory: 'all' })}
                    className="w-full p-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Max Price */}
                <div>
                  <p className="text-xs font-bold uppercase mb-2">Max Price: ${activeFilter.maxPrice}</p>
                  <input
                    type="range"
                    min="20"
                    max="5000"
                    step="50"
                    value={activeFilter.maxPrice}
                    onChange={e => setFilter({ maxPrice: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>

                {/* Mobile Conditions */}
                <div>
                  <p className="text-xs font-bold uppercase mb-2">Condition</p>
                  <div className="space-y-2 text-xs">
                    {conditionsList.map(c => (
                      <label key={c.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={activeFilter.conditions.includes(c.id)}
                          onChange={() => handleConditionToggle(c.id)}
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={resetFilter}
                    className="flex-1 py-2.5 rounded-xl border text-xs font-semibold"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Results List / Grid */}
        <main className="lg:col-span-9">
          {sortedProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                No matching listings found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Try widening your price range, clearing specific condition filters, or searching for broader terms.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={resetFilter}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold"
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => navigate('create-listing')}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold"
                >
                  Sell This Item Instead
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-3 lg:gap-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
