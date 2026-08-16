import React, { useState } from 'react';
import { X, Star, CheckCircle, Upload } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Product } from '../../types';

interface ReviewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ product, isOpen, onClose }) => {
  const { addReview, currentUser, openAuthModal, addToast } = useMarketplace();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    if (!title || !comment) {
      addToast('error', 'Incomplete Review', 'Please provide a title and your written experience.');
      return;
    }

    addReview({
      productId: product.id,
      rating,
      title,
      comment
    });

    onClose();
  };

  return (
    <div id="review-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-12 h-12 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
            />
            <div className="min-w-0">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Review: {product.title}
              </h2>
              <p className="text-xs text-zinc-500">Sold by {product.sellerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-zinc-300 dark:text-zinc-700 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-300 dark:text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-2">
                {rating === 5 && 'Outstanding (5/5)'}
                {rating === 4 && 'Very Good (4/5)'}
                {rating === 3 && 'Average (3/5)'}
                {rating === 2 && 'Below Expectations (2/5)'}
                {rating === 1 && 'Poor Experience (1/5)'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Headline Summary
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Flawless build quality, exactly as described"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Written Review
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="What did you like or dislike? How was the packaging and shipping time? Would you recommend this seller?"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="recommend"
              checked={wouldRecommend}
              onChange={e => setWouldRecommend(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            />
            <label htmlFor="recommend" className="text-xs text-zinc-700 dark:text-zinc-300">
              I recommend this product and seller to other buyers
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-sm transition-all shadow-md active:scale-98"
            >
              Submit Verified Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
