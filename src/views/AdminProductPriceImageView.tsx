import React, { useState } from 'react';
import {
  Shield,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  Check,
  Eye,
  Search,
  ArrowUpDown,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  Tag,
  RefreshCw,
  Sliders,
  CheckCircle2,
  X,
  UploadCloud,
  ChevronRight
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, ProductCondition, ProductStatus } from '../types';
import { BackButton } from '../components/common/BackButton';

export const AdminProductPriceImageView: React.FC = () => {
  const {
    currentUser,
    products,
    categories,
    updateProduct,
    navigate,
    addToast
  } = useMarketplace();

  // Search, filter, sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'price_asc' | 'price_desc' | 'updated'>('updated');

  // Currently selected product for dedicated Modal editor
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick inline edits tracker: key = productId
  const [inlineChanges, setInlineChanges] = useState<
    Record<
      string,
      {
        price?: number;
        originalPrice?: number;
        images?: string[];
        isSaving?: boolean;
        isSaved?: boolean;
      }
    >
  >({});

  // Batch Quick Adjust tool state
  const [batchPercent, setBatchPercent] = useState<string>('');
  const [batchCategory, setBatchCategory] = useState<string>('all');
  const [isBatchOpen, setIsBatchOpen] = useState(false);

  // New Image URL input inside modal editor
  const [modalNewImageUrl, setModalNewImageUrl] = useState('');

  // Curated Preset Stock Images for quick substitution
  const PRESET_STOCK_IMAGES = [
    { label: 'Sony Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80' },
    { label: 'MacBook Pro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80' },
    { label: 'iPhone 15 Pro', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=80' },
    { label: 'PlayStation 5', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900&auto=format&fit=crop&q=80' },
    { label: 'Camera / Leica', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&auto=format&fit=crop&q=80' },
    { label: 'Fujifilm Camera', url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=900&auto=format&fit=crop&q=80' },
    { label: 'DJI Drone', url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=900&auto=format&fit=crop&q=80' },
    { label: 'Aeron Office Chair', url: 'https://images.unsplash.com/photo-1580481077197-28d8dae76161?w=900&auto=format&fit=crop&q=80' },
    { label: 'Modern Lounge Chair', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&auto=format&fit=crop&q=80' },
    { label: 'Air Jordan 1s', url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=900&auto=format&fit=crop&q=80' },
    { label: 'Dyson Airwrap', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=900&auto=format&fit=crop&q=80' },
    { label: 'Leather Duffel Bag', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80' },
    { label: 'Mechanical Keyboard', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900&auto=format&fit=crop&q=80' },
    { label: 'Ceramic Table Lamp', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=80' },
    { label: 'Japanese Teapot Set', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900&auto=format&fit=crop&q=80' }
  ];

  // Filter and sort products
  const filteredProducts = products
    .filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });

  // Handle inline price change
  const handleInlinePriceChange = (productId: string, field: 'price' | 'originalPrice', value: string) => {
    const numVal = parseFloat(value);
    setInlineChanges(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: isNaN(numVal) ? undefined : numVal,
        isSaved: false
      }
    }));
  };

  // Save inline change for a single product
  const handleSaveInlineProduct = (product: Product) => {
    const change = inlineChanges[product.id];
    if (!change) return;

    const newPrice = change.price !== undefined ? change.price : product.price;
    const newOrig = change.originalPrice !== undefined ? change.originalPrice : product.originalPrice;
    const newImages = change.images !== undefined ? change.images : product.images;

    updateProduct({
      ...product,
      price: newPrice,
      originalPrice: newOrig,
      images: newImages,
      updatedAt: new Date().toISOString()
    });

    setInlineChanges(prev => ({
      ...prev,
      [product.id]: {
        ...prev[product.id],
        isSaved: true
      }
    }));

    addToast('success', 'Product Updated', `Updated price & photos for "${product.title.slice(0, 28)}..."`);

    setTimeout(() => {
      setInlineChanges(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }, 2000);
  };

  // Quick Replace Main Image via Prompt/URL
  const handleQuickChangeMainImage = (product: Product, newImageUrl: string) => {
    if (!newImageUrl.trim()) return;
    const nextImages = [newImageUrl.trim(), ...product.images.slice(1)];
    updateProduct({
      ...product,
      images: nextImages,
      updatedAt: new Date().toISOString()
    });
    addToast('success', 'Cover Photo Changed', `Main photo updated for "${product.title.slice(0, 24)}..."`);
  };

  // Batch adjust prices by percentage
  const handleApplyBatchAdjustment = () => {
    const percent = parseFloat(batchPercent);
    if (isNaN(percent) || percent === 0) {
      addToast('warning', 'Invalid Percentage', 'Please enter a valid percentage adjustment (e.g. 10 or -5).');
      return;
    }

    const targets = products.filter(
      p => batchCategory === 'all' || p.categoryId === batchCategory
    );

    targets.forEach(prod => {
      const multiplier = 1 + percent / 100;
      const updatedPrice = Math.max(1, Math.round(prod.price * multiplier * 100) / 100);
      updateProduct({
        ...prod,
        price: updatedPrice,
        originalPrice: prod.originalPrice ? Math.round(prod.originalPrice * multiplier * 100) / 100 : undefined,
        updatedAt: new Date().toISOString()
      });
    });

    addToast(
      'success',
      'Batch Adjustment Applied',
      `Adjusted prices by ${percent > 0 ? '+' : ''}${percent}% across ${targets.length} product listings.`
    );
    setBatchPercent('');
    setIsBatchOpen(false);
  };

  // Modal Editor Handlers
  const handleModalAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !modalNewImageUrl.trim()) return;
    setEditingProduct({
      ...editingProduct,
      images: [...editingProduct.images, modalNewImageUrl.trim()]
    });
    setModalNewImageUrl('');
  };

  const handleModalRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const nextImages = editingProduct.images.filter((_, i) => i !== index);
    if (nextImages.length === 0) {
      addToast('warning', 'Photo Required', 'A product must have at least one valid image.');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      images: nextImages
    });
  };

  const handleModalMoveCover = (index: number) => {
    if (!editingProduct || index === 0) return;
    const target = editingProduct.images[index];
    const rest = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({
      ...editingProduct,
      images: [target, ...rest]
    });
  };

  const handleSaveModalProduct = () => {
    if (!editingProduct) return;
    if (editingProduct.price <= 0) {
      addToast('error', 'Invalid Price', 'Product price must be greater than zero.');
      return;
    }
    if (editingProduct.images.length === 0) {
      addToast('error', 'Image Missing', 'Please provide at least one photo for this product.');
      return;
    }

    updateProduct({
      ...editingProduct,
      updatedAt: new Date().toISOString()
    });

    addToast('success', 'Changes Saved', `Updated "${editingProduct.title}" prices and picture gallery.`);
    setEditingProduct(null);
  };

  return (
    <div id="admin-price-image-editor-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BackButton variant="pill" label="Back to Admin Dashboard" fallbackView="admin-dashboard" />
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500">
            <button onClick={() => navigate('home')} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('admin-dashboard')} className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Admin Control
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              Price & Picture Manager
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBatchOpen(!isBatchOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isBatchOpen ? 'Close Batch Tool' : 'Batch Price Adjuster'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('create-listing')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Main Admin Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                Admin Management Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Product Prices & Pictures Control Center
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
              Directly edit product selling prices, original retail MSRPs, cover photos, and gallery images across the entire marketplace catalog with instant live updates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-center">
              <div className="text-xl font-black text-blue-400">{products.length}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Total Products</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-center">
              <div className="text-xl font-black text-emerald-400">
                ${(products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1)).toFixed(0)}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Avg Price</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-center">
              <div className="text-xl font-black text-amber-400">
                {products.reduce((acc, p) => acc + p.images.length, 0)}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold">Live Photos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Batch Price Adjuster Drawer (Collapsible) */}
      {isBatchOpen && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Batch Price Modifier (Percentage Markup or Discount)
              </h2>
            </div>
            <button
              onClick={() => setIsBatchOpen(false)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Apply a blanket percentage adjustment to all products in a chosen category. For example: enter <strong>10</strong> to increase prices by 10%, or <strong>-15</strong> to apply a 15% flash sale discount.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category:</label>
              <select
                value={batchCategory}
                onChange={e => setBatchCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium"
              >
                <option value="all">All Categories ({products.length} items)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Adjustment %:</label>
              <input
                type="number"
                placeholder="e.g. 10 or -10"
                value={batchPercent}
                onChange={e => setBatchPercent(e.target.value)}
                className="w-32 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-bold"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyBatchAdjustment}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm active:scale-95 cursor-pointer transition-all"
            >
              Apply Batch Adjustment
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, ID, or seller name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active (Live)</option>
            <option value="draft">Drafts</option>
            <option value="paused">Paused</option>
            <option value="sold">Sold</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
          >
            <option value="updated">Sort: Recently Updated</option>
            <option value="title">Sort: Title (A-Z)</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
          </select>
        </div>

        <div className="text-zinc-400 font-medium self-center">
          Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</span> of {products.length} listings
        </div>
      </div>

      {/* Products Grid with Dedicated Price & Picture Editing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const currentChanges = inlineChanges[product.id] || {};
          const livePrice = currentChanges.price !== undefined ? currentChanges.price : product.price;
          const liveOrigPrice =
            currentChanges.originalPrice !== undefined ? currentChanges.originalPrice : product.originalPrice || '';
          const hasUnsavedChanges =
            (currentChanges.price !== undefined && currentChanges.price !== product.price) ||
            (currentChanges.originalPrice !== undefined && currentChanges.originalPrice !== (product.originalPrice || 0));

          return (
            <div
              key={product.id}
              className={`p-5 rounded-3xl bg-white dark:bg-zinc-900 border transition-all flex flex-col justify-between shadow-xs ${
                hasUnsavedChanges
                  ? 'border-amber-400 ring-2 ring-amber-400/20'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-4">
                {/* Top Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                      {product.id}
                    </span>
                    <h3
                      onClick={() => navigate('product', { productId: product.id })}
                      className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate mt-1 hover:text-blue-600 cursor-pointer"
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Seller: {product.sellerName} • {product.subcategory}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      product.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Picture Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>Photos ({product.images.length})</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                    >
                      Manage Gallery
                    </button>
                  </div>

                  {/* Main Image Thumbnail with Quick Change Overlay */}
                  <div className="relative group rounded-2xl overflow-hidden aspect-video bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-1.5 rounded-xl bg-white text-zinc-900 text-xs font-bold shadow-lg hover:bg-zinc-100 cursor-pointer flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Change Pictures</span>
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                      Cover Photo
                    </div>
                  </div>

                  {/* Photo Thumbnails Carousel */}
                  {product.images.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {product.images.slice(0, 5).map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => setEditingProduct(product)}
                          className={`relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border cursor-pointer ${
                            idx === 0
                              ? 'border-blue-500 ring-1 ring-blue-500'
                              : 'border-zinc-200 dark:border-zinc-700 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {product.images.length > 5 && (
                        <div
                          onClick={() => setEditingProduct(product)}
                          className="w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-500 shrink-0 cursor-pointer"
                        >
                          +{product.images.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Price Management Section */}
                <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Price & Discount Settings</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Live Selling Price */}
                    <div>
                      <label className="text-[11px] font-medium text-zinc-500 block mb-1">
                        Selling Price ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={livePrice}
                          onChange={e => handleInlinePriceChange(product.id, 'price', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>

                    {/* Original Retail MSRP */}
                    <div>
                      <label className="text-[11px] font-medium text-zinc-500 block mb-1">
                        Retail MSRP ($)
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Optional"
                          value={liveOrigPrice}
                          onChange={e => handleInlinePriceChange(product.id, 'originalPrice', e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profit / Discount Indicator */}
                  {Number(liveOrigPrice) > Number(livePrice) && (
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                      <span>Buyer Discount:</span>
                      <span className="font-bold">
                        {Math.round(((Number(liveOrigPrice) - Number(livePrice)) / Number(liveOrigPrice)) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(product)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Full Editor</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {currentChanges.isSaved ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  ) : hasUnsavedChanges ? (
                    <button
                      type="button"
                      onClick={() => handleSaveInlineProduct(product)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('product', { productId: product.id })}
                      className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      title="View live product"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Full Modal for Editing Pictures and Detailed Pricing */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 animate-scaleIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Shield className="w-4 h-4" />
                  </span>
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Edit Product Prices & Photo Gallery
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  {editingProduct.title} (ID: {editingProduct.id})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1 text-xs">
              {/* 1. Pricing Section */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span>Pricing Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Selling Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 font-bold text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Original Retail MSRP ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-zinc-400">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Optional strike-through"
                        value={editingProduct.originalPrice || ''}
                        onChange={e =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: e.target.value ? parseFloat(e.target.value) : undefined
                          })
                        }
                        className="w-full pl-7 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 dark:text-zinc-300 block mb-1.5">
                      Stock Inventory Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Photo Gallery Management */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span>Product Images & Cover Photo</span>
                  </h3>
                  <span className="text-[11px] text-zinc-500">First image is the primary cover</span>
                </div>

                {/* Add Image by URL Form */}
                <form onSubmit={handleModalAddImage} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={modalNewImageUrl}
                      onChange={e => setModalNewImageUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </form>

                {/* Quick Presets Carousel */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500">
                    Or select from curated high-resolution photography presets:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {PRESET_STOCK_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            images: [...editingProduct.images, preset.url]
                          });
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 text-zinc-700 dark:text-zinc-300 font-medium whitespace-nowrap text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <img src={preset.url} alt="" className="w-4 h-4 rounded-xs object-cover" />
                        <span>+ {preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Image Gallery List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {editingProduct.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-2xl border bg-white dark:bg-zinc-900 space-y-2 relative group ${
                        idx === 0
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px] uppercase shadow-xs">
                            Primary Cover
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1">
                        {idx > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleModalMoveCover(idx)}
                            className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            Set as Cover
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-zinc-400">Cover Photo</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleModalRemoveImage(idx)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModalProduct}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
