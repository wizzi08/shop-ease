import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export interface BackButtonProps {
  label?: string;
  fallbackView?: string;
  className?: string;
  variant?: 'subtle' | 'pill' | 'outline' | 'card';
  showAlways?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackView,
  className = '',
  variant = 'subtle',
  showAlways = false
}) => {
  const { goBack, canGoBack, navigate } = useMarketplace();

  if (!canGoBack && !fallbackView && !showAlways) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoBack) {
      goBack();
    } else if (fallbackView) {
      navigate(fallbackView);
    } else {
      navigate('home');
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white shadow-2xs text-xs font-semibold transition-all group cursor-pointer ${className}`}
        aria-label={label}
        title={label}
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-all group cursor-pointer ${className}`}
        aria-label={label}
        title={label}
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-all group cursor-pointer ${className}`}
        aria-label={label}
        title={label}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors group cursor-pointer ${className}`}
      aria-label={label}
      title={label}
    >
      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
      <span>{label}</span>
    </button>
  );
};
