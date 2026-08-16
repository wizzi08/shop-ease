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
  MapPin
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product, ProductCondition, ProductStatus } from '../types';

interface CreateEditListingViewProps {
  productId?: string;
}

export const CreateEditListingView: React.FC<CreateEditListingViewProps> = ({ productId }) => {
  const { products, categories, currentUser, addProduct, updateProduct, navigate, addToast } =
    useMarketplace();

  const existingProduct = productId ? products.find(p => p.id === productId) : null;

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

  const handleSaveListing = (targetStatus: ProductStatus) => {
    if (!title.trim() || !description.trim()) {
      addToast('error', 'Missing Information', 'Please enter a product title and description.');
      return;
    }

    if (images.length === 0) {
      addToast('error', 'Image Required', 'Please provide at least 1 image for this listing.');
      return;
    }

    const payload: Partial<Product> = {
      title,
      description,
      categoryId,
      subcategory,
      condition,
      price: Number(price) || 10,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock) || 1,
      location,
      images,
      specifications: specifications.filter(s => s.name && s.value),
      shippingOptions,
      status: targetStatus,
      sellerId: currentUser?.id || 'user-seller-1',
      sellerName: currentUser?.storeName || currentUser?.name || 'TechVault Pro',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      sellerRating: currentUser?.rating || 4.95,
      sellerVerified: true
    };

    if (existingProduct) {
      updateProduct({
        ...existingProduct,
        ...payload
      } as Product);
      addToast('success', 'Listing Updated', `"${title}" has been updated.`);
    } else {
      addProduct(payload as Omit<Product, 'id' | 'createdAt' | 'views' | 'soldCount' | 'rating' | 'reviewCount'>);
      addToast('success', 'Listing Published', `"${title}" is now live on the marketplace!`);
    }

    navigate('seller-dashboard');
  };

  const sampleImages = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?w=800&auto=format&fit=crop&q=80'
  ];

  return (
    <div id="create-edit-listing-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('seller-dashboard')}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              {existingProduct ? 'Edit Marketplace Listing' : 'Create New Listing'}
            </h1>
            <p className="text-xs text-zinc-500">
              List products for buyers worldwide with automated escrow protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSaveListing('draft')}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSaveListing('active')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
          >
            {existingProduct ? 'Update Listing' : 'Publish to Marketplace'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Basic Details & Categorization
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 capitalize"
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
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Selling Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
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
                min="1"
                required
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Product Photos */}
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
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-zinc-950/70 hover:bg-rose-600 text-white transition-colors"
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
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold"
            >
              Add URL
            </button>
          </form>

          {/* Quick presets helper */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-zinc-400">Sample photos:</span>
            {sampleImages.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setImages([...images, s])}
                className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-blue-600"
              >
                + Photo {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Specifications Key-Values */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Technical Specifications
            </h2>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
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
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 30 Hours)"
                  value={spec.value}
                  onChange={e => handleUpdateSpec(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  className="p-2 text-zinc-400 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Delivery & Shipping Options */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pb-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Shipping Options for Buyers
          </h2>

          <div className="space-y-3">
            {shippingOptions.map((opt, i) => (
              <div
                key={opt.id}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between"
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
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('seller-dashboard')}
            className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSaveListing('draft')}
            className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveListing('active')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
          >
            {existingProduct ? 'Save & Update' : 'Publish Listing'}
          </button>
        </div>
      </div>
    </div>
  );
};
