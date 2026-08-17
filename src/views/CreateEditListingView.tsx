import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Save,
  Sparkles,
  DollarSign,
  Truck,
  Layers,
  MapPin,
  Shield,
  ShieldCheck,
  Star,
  Tag,
  User as UserIcon,
  Store,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, ProductCondition, ProductStatus } from '../types';

interface CreateEditListingViewProps {
  productId?: string;
}

export const CreateEditListingView: React.FC<CreateEditListingViewProps> = ({ productId }) => {
  const {
    products,
    categories,
    currentUser,
    users,
    addProduct,
    updateProduct,
    navigate,
    goBack,
    canGoBack,
    addToast
  } = useMarketplace();

  const existingProduct = productId ? products.find(p => p.id === productId) : null;
  const isAdmin = currentUser?.role === 'admin';

  // Form State
  const [title, setTitle] = useState(existingProduct?.title || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId || 'cat-electronics');
  const [subcategory, setSubcategory] = useState(existingProduct?.subcategory || 'Audio & Headphones');
  const [condition, setCondition] = useState<ProductCondition>(existingProduct?.condition || 'like_new');
  const [price, setPrice] = useState(existingProduct?.price ? String(existingProduct.price) : '249.99');
  const [originalPrice, setOriginalPrice] = useState(
    existingProduct?.originalPrice ? String(existingProduct.originalPrice) : '349.99'
  );
  const [stock, setStock] = useState(existingProduct?.stock ? String(existingProduct.stock) : '3');
  const [location, setLocation] = useState(
    existingProduct?.location || currentUser?.location || 'San Francisco, CA'
  );
  const [featured, setFeatured] = useState<boolean>(existingProduct?.featured || false);
  const [status, setStatus] = useState<ProductStatus>(existingProduct?.status || 'active');
  const [tagsInput, setTagsInput] = useState(existingProduct?.tags ? existingProduct.tags.join(', ') : 'electronics, premium, audio');

  // Admin Seller Assignment State
  const [assignedSellerMode, setAssignedSellerMode] = useState<'existing' | 'official' | 'custom' | 'user'>(
    existingProduct ? 'existing' : isAdmin ? 'official' : 'custom'
  );
  const [selectedUserId, setSelectedUserId] = useState<string>(existingProduct?.sellerId || currentUser?.id || 'user-seller-1');
  const [customSellerName, setCustomSellerName] = useState<string>(existingProduct?.sellerName || 'Meridian Direct');

  // Images list
  const [images, setImages] = useState<string[]>(
    existingProduct?.images || [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specifications
  const [specifications, setSpecifications] = useState<{ name: string; value: string }[]>(
    existingProduct?.specifications || [
      { name: 'Brand', value: 'Meridian Labs' },
      { name: 'Color', value: 'Matte Obsidian' },
      { name: 'Warranty', value: '1 Year Manufacturer Guarantee' }
    ]
  );

  // Shipping Options
  const [shippingOptions, setShippingOptions] = useState(
    existingProduct?.shippingOptions || [
      { id: 'ship-1', name: 'Standard Tracked Shipping', price: 0, estimatedDays: '3-5 business days', isFree: true },
      { id: 'ship-2', name: 'Priority Express Delivery', price: 14.99, estimatedDays: '1-2 business days', isFree: false }
    ]
  );

  // Sync state if existingProduct changes
  useEffect(() => {
    if (existingProduct) {
      setTitle(existingProduct.title);
      setDescription(existingProduct.description);
      setCategoryId(existingProduct.categoryId);
      setSubcategory(existingProduct.subcategory);
      setCondition(existingProduct.condition);
      setPrice(String(existingProduct.price));
      setOriginalPrice(existingProduct.originalPrice ? String(existingProduct.originalPrice) : '');
      setStock(String(existingProduct.stock));
      setLocation(existingProduct.location);
      setFeatured(existingProduct.featured || false);
      setStatus(existingProduct.status);
      setTagsInput(existingProduct.tags ? existingProduct.tags.join(', ') : '');
      setImages(existingProduct.images || []);
      setSpecifications(existingProduct.specifications || []);
      setShippingOptions(existingProduct.shippingOptions || []);
      setCustomSellerName(existingProduct.sellerName);
      setSelectedUserId(existingProduct.sellerId);
    }
  }, [existingProduct?.id]);

  const selectedCategoryObj = categories.find(c => c.id === categoryId);

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, field: 'name' | 'value', val: string) => {
    const next = [...specifications];
    next[index][field] = val;
    setSpecifications(next);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSaveListing = (targetStatus?: ProductStatus) => {
    if (!title.trim() || !description.trim()) {
      addToast('error', 'Missing Information', 'Please enter a product title and description.');
      return;
    }

    if (images.length === 0) {
      addToast('error', 'Image Required', 'Please provide at least 1 image for this listing.');
      return;
    }

    const finalStatus = targetStatus || status;
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    // Resolve seller attributes
    let finalSellerId = existingProduct?.sellerId || currentUser?.id || 'admin-official';
    let finalSellerName = existingProduct?.sellerName || currentUser?.storeName || currentUser?.name || 'Meridian Official Store';
    let finalSellerAvatar = existingProduct?.sellerAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    let finalSellerRating = existingProduct?.sellerRating || currentUser?.rating || 5.0;
    let finalSellerVerified = existingProduct ? existingProduct.sellerVerified : true;

    if (isAdmin) {
      if (assignedSellerMode === 'official') {
        finalSellerId = 'admin-official-store';
        finalSellerName = 'Meridian Direct (Official)';
        finalSellerAvatar = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80';
        finalSellerRating = 5.0;
        finalSellerVerified = true;
      } else if (assignedSellerMode === 'user') {
        const foundUser = users.find(u => u.id === selectedUserId);
        if (foundUser) {
          finalSellerId = foundUser.id;
          finalSellerName = foundUser.storeName || foundUser.name;
          finalSellerAvatar = foundUser.avatar;
          finalSellerRating = foundUser.rating || 5.0;
          finalSellerVerified = foundUser.verified ?? true;
        }
      } else if (assignedSellerMode === 'custom' && customSellerName.trim()) {
        finalSellerName = customSellerName.trim();
      }
    }

    const payload: Partial<Product> = {
      title: title.trim(),
      description: description.trim(),
      categoryId,
      subcategory,
      condition,
      price: Number(price) > 0 ? Number(price) : 10,
      originalPrice: originalPrice && Number(originalPrice) > 0 ? Number(originalPrice) : undefined,
      stock: Number(stock) >= 0 ? Number(stock) : 1,
      location: location.trim() || 'San Francisco, CA',
      images,
      specifications: specifications.filter(s => s.name.trim() && s.value.trim()),
      shippingOptions,
      status: finalStatus,
      featured,
      tags: parsedTags.length > 0 ? parsedTags : ['merchandise', 'featured'],
      sellerId: finalSellerId,
      sellerName: finalSellerName,
      sellerAvatar: finalSellerAvatar,
      sellerRating: finalSellerRating,
      sellerVerified: finalSellerVerified
    };

    if (existingProduct) {
      updateProduct({
        ...existingProduct,
        ...payload,
        updatedAt: new Date().toISOString()
      } as Product);
      addToast('success', 'Listing Updated', `"${title}" has been modified successfully.`);
    } else {
      addProduct(payload as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'soldCount' | 'rating' | 'reviewCount'>);
      addToast('success', 'Listing Created', `"${title}" has been published to the catalog!`);
    }

    if (isAdmin) {
      if (canGoBack) goBack();
      else navigate('admin-dashboard');
    } else {
      if (canGoBack) goBack();
      else navigate('seller-dashboard');
    }
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div id="create-edit-listing-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Super Admin Notice Banner */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              Super Administrator Product Control
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-semibold text-[10px]">
                Full Access
              </span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
              {existingProduct
                ? `You are editing listing "${existingProduct.title}" (ID: ${existingProduct.id}). You have global permissions to change pricing, stock, merchant assignment, status, and specifications.`
                : 'You are adding a new product listing as an Administrator. You can publish directly under the platform official store or assign it to any registered merchant.'}
            </p>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="create-edit-back-btn"
            type="button"
            onClick={() => {
              if (canGoBack) goBack();
              else if (isAdmin) navigate('admin-dashboard');
              else navigate('seller-dashboard');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold shadow-2xs group cursor-pointer transition-all"
            title="Back to previous page"
            aria-label="Back to previous page"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
              {existingProduct ? 'Edit Catalog Listing' : 'Create New Product Listing'}
              {existingProduct && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  {existingProduct.id}
                </span>
              )}
            </h1>
            <p className="text-xs text-zinc-500">
              {isAdmin
                ? 'Administer all catalog attributes, inventory levels, and live visibility'
                : 'List products for buyers worldwide with automated escrow protection'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {existingProduct && (
            <button
              type="button"
              onClick={() => navigate('product', { productId: existingProduct.id })}
              className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              <span>View Live</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSaveListing('draft')}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveListing()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            {existingProduct ? 'Save All Changes' : 'Publish Product'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Product Details & Categorization
          </h2>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Wireless Noise-Canceling Headphones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={e => {
                  setCategoryId(e.target.value);
                  const found = categories.find(c => c.id === e.target.value);
                  if (found && found.subcategories[0]) {
                    setSubcategory(found.subcategories[0]);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Subcategory
              </label>
              <select
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
              >
                {selectedCategoryObj?.subcategories.map(sub => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Item Condition *
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 capitalize font-medium"
              >
                <option value="brand_new">Brand New (Unopened in box)</option>
                <option value="like_new">Like New (Mint, zero flaws)</option>
                <option value="good">Good (Minor cosmetic wear)</option>
                <option value="fair">Fair (Visible signs of use)</option>
                <option value="refurbished">Certified Refurbished</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Item Location / City
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the condition, history, included accessories, packaging, and any technical highlights..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-zinc-500" />
              Search & Discovery Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. electronics, wireless, noise-cancelling, audio"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Section 2: Pricing, Stock & Visibility Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Pricing, Inventory & Catalog Status
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Selling Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Original / Retail Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                placeholder="Optional strike-through"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Listing Lifecycle Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as ProductStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold capitalize"
              >
                <option value="active">Active (Visible in public marketplace)</option>
                <option value="draft">Draft (Private, not visible in search)</option>
                <option value="paused">Paused (Temporarily hidden from buyers)</option>
                <option value="sold">Sold (Marked as completed / archived)</option>
                <option value="inactive">Inactive / Delisted</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-zinc-300 dark:border-zinc-700 focus:ring-amber-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Feature in Marketplace Highlights
                  </span>
                  <span className="text-[11px] text-zinc-500 block">
                    Showcases on homepage carousel and top search badges
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Admin Merchant / Seller Assignment (When Admin is active) */}
        {isAdmin && (
          <div className="p-6 rounded-3xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-4 text-xs">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-amber-200/60 dark:border-amber-900/60 flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Seller & Merchant Assignment (Admin Control)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setAssignedSellerMode('official')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  assignedSellerMode === 'official'
                    ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-950/60 font-bold text-zinc-900 dark:text-zinc-100 ring-1 ring-amber-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sellerMode"
                    checked={assignedSellerMode === 'official'}
                    onChange={() => setAssignedSellerMode('official')}
                    className="text-amber-600"
                  />
                  <span>Platform Official Store</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Meridian Direct Verified Official</p>
              </label>

              {existingProduct && (
                <label
                  onClick={() => setAssignedSellerMode('existing')}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    assignedSellerMode === 'existing'
                      ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-950/60 font-bold text-zinc-900 dark:text-zinc-100 ring-1 ring-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sellerMode"
                      checked={assignedSellerMode === 'existing'}
                      onChange={() => setAssignedSellerMode('existing')}
                      className="text-amber-600"
                    />
                    <span>Preserve Current Seller</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 truncate">{existingProduct.sellerName}</p>
                </label>
              )}

              <label
                onClick={() => setAssignedSellerMode('user')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  assignedSellerMode === 'user'
                    ? 'border-amber-500 bg-amber-100/50 dark:bg-amber-950/60 font-bold text-zinc-900 dark:text-zinc-100 ring-1 ring-amber-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sellerMode"
                    checked={assignedSellerMode === 'user'}
                    onChange={() => setAssignedSellerMode('user')}
                    className="text-amber-600"
                  />
                  <span>Registered Member</span>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">Assign to any registered user</p>
              </label>
            </div>

            {assignedSellerMode === 'user' && (
              <div className="pt-2">
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Select Registered Seller Profile:
                </label>
                <select
                  value={selectedUserId}
                  onChange={e => setSelectedUserId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role}) — {u.email} {u.storeName ? `[${u.storeName}]` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Product Photos */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            Product Gallery ({images.length} photos)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 group">
                <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-zinc-950/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddImage} className="flex gap-2 pt-2">
            <input
              type="url"
              placeholder="Paste image URL (https://...)"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold"
            >
              Add URL
            </button>
          </form>

          {/* Quick presets helper */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-zinc-400">Sample photos:</span>
            {sampleImages.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImages([...images, s])}
                className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 cursor-pointer"
              >
                + Photo {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Section 5: Specifications Key-Values */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Technical Specifications & Key Attributes
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Attribute
            </button>
          </div>

          <div className="space-y-2">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Spec name (e.g. Battery Life)"
                  value={spec.name}
                  onChange={e => handleUpdateSpec(idx, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 30 Hours)"
                  value={spec.value}
                  onChange={e => handleUpdateSpec(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-zinc-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Delivery & Shipping Options */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Shipping & Dispatch Methods
          </h2>

          <div className="space-y-3">
            {shippingOptions.map((opt) => (
              <div
                key={opt.id}
                className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{opt.name}</p>
                  <p className="text-zinc-500">{opt.estimatedDays}</p>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {opt.isFree || opt.price === 0 ? 'FREE' : `$${opt.price.toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              if (canGoBack) goBack();
              else if (isAdmin) navigate('admin-dashboard');
              else navigate('seller-dashboard');
            }}
            className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSaveListing('draft')}
            className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveListing()}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-98 cursor-pointer transition-all"
          >
            {existingProduct ? 'Save & Apply All Changes' : 'Publish Product to Catalog'}
          </button>
        </div>
      </div>
    </div>
  );
};
