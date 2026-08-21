import { ProductCondition } from '../types';

export interface CategoryColorTheme {
  id: string;
  name: string;
  badge: string;
  badgeDark: string;
  badgeBorder: string;
  gradient: string;
  heroGradient: string;
  lightBg: string;
  darkBg: string;
  accentText: string;
  iconGradient: string;
  pillBg: string;
  borderHover: string;
  accent: string;
  dot: string;
}

export const CATEGORY_THEMES: Record<string, CategoryColorTheme> = {
  'cat-electronics': {
    id: 'cat-electronics',
    name: 'Electronics & Gadgets',
    badge: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80',
    badgeDark: 'bg-sky-950/70 text-sky-300 border-sky-800',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    heroGradient: 'from-sky-500/10 via-indigo-500/5 to-transparent',
    lightBg: 'bg-sky-50/70',
    darkBg: 'dark:bg-sky-950/30',
    accentText: 'text-sky-600 dark:text-sky-400',
    iconGradient: 'from-sky-500 to-indigo-600',
    pillBg: 'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200',
    borderHover: 'hover:border-sky-300 dark:hover:border-sky-700',
    accent: 'bg-sky-500',
    dot: 'bg-sky-500'
  },
  'cat-fashion': {
    id: 'cat-fashion',
    name: 'Fashion & Apparel',
    badge: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80',
    badgeDark: 'bg-rose-950/70 text-rose-300 border-rose-800',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    gradient: 'from-rose-500 via-pink-600 to-amber-600',
    heroGradient: 'from-rose-500/10 via-orange-500/5 to-transparent',
    lightBg: 'bg-rose-50/70',
    darkBg: 'dark:bg-rose-950/30',
    accentText: 'text-rose-600 dark:text-rose-400',
    iconGradient: 'from-rose-500 to-amber-600',
    pillBg: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200',
    borderHover: 'hover:border-rose-300 dark:hover:border-rose-700',
    accent: 'bg-rose-500',
    dot: 'bg-rose-500'
  },
  'cat-home': {
    id: 'cat-home',
    name: 'Home & Living',
    badge: 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    badgeDark: 'bg-amber-950/70 text-amber-300 border-amber-800',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    gradient: 'from-amber-600 via-orange-500 to-stone-700',
    heroGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    lightBg: 'bg-amber-50/70',
    darkBg: 'dark:bg-amber-950/30',
    accentText: 'text-amber-700 dark:text-amber-400',
    iconGradient: 'from-amber-600 to-orange-600',
    pillBg: 'bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    accent: 'bg-amber-500',
    dot: 'bg-amber-500'
  },
  'cat-collectibles': {
    id: 'cat-collectibles',
    name: 'Collectibles & Art',
    badge: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    badgeDark: 'bg-purple-950/70 text-purple-300 border-purple-800',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    gradient: 'from-purple-600 via-violet-600 to-pink-600',
    heroGradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    lightBg: 'bg-purple-50/70',
    darkBg: 'dark:bg-purple-950/30',
    accentText: 'text-purple-600 dark:text-purple-400',
    iconGradient: 'from-purple-600 to-pink-600',
    pillBg: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200',
    borderHover: 'hover:border-purple-300 dark:hover:border-purple-700',
    accent: 'bg-purple-500',
    dot: 'bg-purple-500'
  },
  'cat-sports': {
    id: 'cat-sports',
    name: 'Sports & Outdoors',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    badgeDark: 'bg-emerald-950/70 text-emerald-300 border-emerald-800',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    heroGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    lightBg: 'bg-emerald-50/70',
    darkBg: 'dark:bg-emerald-950/30',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    iconGradient: 'from-emerald-600 to-teal-600',
    pillBg: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200',
    borderHover: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-500'
  },
  'cat-beauty': {
    id: 'cat-beauty',
    name: 'Beauty & Wellness',
    badge: 'bg-pink-50 text-pink-800 border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800/80',
    badgeDark: 'bg-pink-950/70 text-pink-300 border-pink-800',
    badgeBorder: 'border-pink-200 dark:border-pink-800',
    gradient: 'from-pink-500 via-rose-400 to-purple-500',
    heroGradient: 'from-pink-500/10 via-rose-500/5 to-transparent',
    lightBg: 'bg-pink-50/70',
    darkBg: 'dark:bg-pink-950/30',
    accentText: 'text-pink-600 dark:text-pink-400',
    iconGradient: 'from-pink-500 to-rose-600',
    pillBg: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200',
    borderHover: 'hover:border-pink-300 dark:hover:border-pink-700',
    accent: 'bg-pink-500',
    dot: 'bg-pink-500'
  },
  'cat-vehicles': {
    id: 'cat-vehicles',
    name: 'Vehicles & Parts',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/80',
    badgeDark: 'bg-cyan-950/70 text-cyan-300 border-cyan-800',
    badgeBorder: 'border-cyan-200 dark:border-cyan-800',
    gradient: 'from-cyan-600 via-blue-600 to-teal-700',
    heroGradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    lightBg: 'bg-cyan-50/70',
    darkBg: 'dark:bg-cyan-950/30',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    iconGradient: 'from-cyan-600 to-blue-600',
    pillBg: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200',
    borderHover: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    accent: 'bg-cyan-500',
    dot: 'bg-cyan-500'
  },
  'cat-books': {
    id: 'cat-books',
    name: 'Books & Media',
    badge: 'bg-amber-50/90 text-stone-800 border-amber-200 dark:bg-stone-900/80 dark:text-amber-300 dark:border-amber-900/60',
    badgeDark: 'bg-stone-900/90 text-amber-300 border-amber-900/80',
    badgeBorder: 'border-amber-200 dark:border-amber-900/60',
    gradient: 'from-amber-700 via-stone-800 to-amber-900',
    heroGradient: 'from-amber-600/10 via-stone-500/5 to-transparent',
    lightBg: 'bg-stone-100/70',
    darkBg: 'dark:bg-stone-900/40',
    accentText: 'text-amber-800 dark:text-amber-300',
    iconGradient: 'from-amber-700 to-yellow-600',
    pillBg: 'bg-amber-100/80 dark:bg-stone-800 text-stone-800 dark:text-amber-200',
    borderHover: 'hover:border-amber-300 dark:hover:border-amber-700',
    accent: 'bg-amber-600',
    dot: 'bg-amber-600'
  }
};

export const DEFAULT_CATEGORY_THEME: CategoryColorTheme = {
  id: 'default',
  name: 'Curated Goods',
  badge: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700',
  badgeDark: 'bg-stone-800 text-stone-200 border-stone-700',
  badgeBorder: 'border-stone-200 dark:border-stone-700',
  gradient: 'from-indigo-600 via-blue-600 to-sky-600',
  heroGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
  lightBg: 'bg-stone-50/80',
  darkBg: 'dark:bg-stone-900/30',
  accentText: 'text-indigo-600 dark:text-indigo-400',
  iconGradient: 'from-indigo-600 to-blue-600',
  pillBg: 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200',
  borderHover: 'hover:border-stone-300 dark:hover:border-stone-700',
  accent: 'bg-indigo-500',
  dot: 'bg-indigo-500'
};

export function getCategoryTheme(categoryId?: string): CategoryColorTheme {
  if (!categoryId) return DEFAULT_CATEGORY_THEME;
  return CATEGORY_THEMES[categoryId] || DEFAULT_CATEGORY_THEME;
}

export const CONDITION_THEMES: Record<
  ProductCondition,
  { label: string; badge: string; dot: string }
> = {
  brand_new: {
    label: 'Brand New',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    dot: 'bg-emerald-500'
  },
  like_new: {
    label: 'Like New',
    badge: 'bg-sky-50 text-sky-800 border-sky-200/90 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80',
    dot: 'bg-sky-500'
  },
  good: {
    label: 'Good Condition',
    badge: 'bg-amber-50 text-amber-900 border-amber-200/90 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    dot: 'bg-amber-500'
  },
  fair: {
    label: 'Fair Condition',
    badge: 'bg-orange-50 text-orange-900 border-orange-200/90 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/80',
    dot: 'bg-orange-500'
  },
  refurbished: {
    label: 'Certified Refurbished',
    badge: 'bg-purple-50 text-purple-900 border-purple-200/90 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/80',
    dot: 'bg-purple-500'
  }
};
