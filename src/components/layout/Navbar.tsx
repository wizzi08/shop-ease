import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  MessageSquare,
  PlusCircle,
  Sun,
  Moon,
  User as UserIcon,
  ChevronDown,
  Store,
  Shield,
  Layers,
  LogOut,
  Settings,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    isDarkMode,
    toggleTheme,
    categories,
    cartItemCount,
    setIsCartOpen,
    wishlist,
    unreadMessagesCount,
    navigate,
    openAuthModal,
    logout,
    activeFilter,
    setFilter,
    products,
    isFirebaseConnected,
    firebaseProjectId
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState(activeFilter.searchQuery);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search recommendations
  const searchSuggestions = products
    .filter(p =>
      searchQuery.trim().length > 1
        ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : false
    )
    .slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ searchQuery });
    setIsSearchFocused(false);
    navigate('browse');
  };

  const handleSelectCategory = (catId: string) => {
    setFilter({ categoryId: catId, searchQuery: '' });
    setIsCategoryMenuOpen(false);
    navigate('browse');
  };

  const handleCreateListingClick = () => {
    if (!currentUser) {
      openAuthModal('signup');
      return;
    }
    if (currentUser.role === 'buyer') {
      navigate('create-listing');
    } else {
      navigate('create-listing');
    }
  };

  // Close search suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      {/* Top Banner with Quick persona switcher & Free shipping note */}
      <div className="bg-zinc-900 dark:bg-zinc-900 text-zinc-300 text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
              <Sparkles className="w-3 h-3" />
              Summer Flash Sale:
            </span>
            <span className="hidden sm:inline">Use code <strong className="text-white">MERIDIAN15</strong> for 15% off orders</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[10px]">
              <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-zinc-300 font-medium">Firebase: {firebaseProjectId}</span>
            </div>
            <button
              onClick={() => navigate('help')}
              className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span className="hidden md:inline">Help Center</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Category Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  Meridian <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">MARKET</span>
                </div>
                <div className="text-[10px] text-zinc-500 tracking-wide font-medium">Curated Global Exchange</div>
              </div>
            </button>

            {/* Categories Menu Trigger */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span>Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryMenuOpen(false)} />
                  <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => handleSelectCategory('all')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                    >
                      <span>Explore All Products</span>
                      <ArrowRight className="w-3 h-3 text-zinc-400" />
                    </button>
                    <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat.id)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-colors"
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-zinc-400 font-normal">{cat.itemCount} items</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search Input Bar with live recommendations */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search headphones, vintage jackets, walnut chairs, cameras..."
                  className="w-full pl-10 pr-10 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-hidden transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilter({ searchQuery: '' });
                    }}
                    className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 1 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-3 z-50 animate-in fade-in zoom-in-95">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Matching Products & Tags:
                </p>
                {searchSuggestions.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-2">No matching products found. Press Enter to search catalog.</p>
                ) : (
                  <div className="space-y-1">
                    {searchSuggestions.map(item => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          navigate('product', { productId: item.id });
                        }}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-9 h-9 rounded-lg object-cover bg-zinc-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-zinc-500">${item.price.toFixed(2)} • {item.sellerName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Create Listing CTA */}
            <button
              onClick={handleCreateListingClick}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Sell Item</span>
            </button>

            {/* Dark/Light toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-90 transition-all cursor-pointer"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (!currentUser) openAuthModal('login');
                else navigate('wishlist');
              }}
              className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Messages */}
            <button
              onClick={() => {
                if (!currentUser) openAuthModal('login');
                else navigate('messaging');
              }}
              className="relative p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-all font-semibold text-xs"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cartItemCount}</span>
            </button>

            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
                  />
                  <ChevronDown className={`w-3 h-3 text-zinc-500 hidden sm:block transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Header */}
                      <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 truncate">{currentUser.email}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 capitalize">
                            {currentUser.role}
                          </span>
                          {currentUser.storeName && (
                            <span className="text-[10px] text-zinc-500 truncate">
                              • {currentUser.storeName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('buyer-dashboard');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                          <span>Buyer Dashboard & Orders</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('seller-dashboard');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Store className="w-3.5 h-3.5 text-purple-500" />
                          <span>Seller Dashboard & Store</span>
                        </button>

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              navigate('admin-dashboard');
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-semibold text-amber-600 dark:text-amber-400"
                          >
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                            <span>Platform Admin Control</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('profile', { userId: currentUser.id });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Public Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate('buyer-dashboard', { tab: 'settings' });
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Account Settings</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold text-xs transition-all shadow-xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navbar */}
        <nav className="hidden lg:flex items-center gap-6 pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 overflow-x-auto no-scrollbar text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
              activeFilter.categoryId === 'all' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
            }`}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap ${
                activeFilter.categoryId === cat.id ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                handleCreateListingClick();
              }}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Sell an Item
            </button>
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                navigate('browse');
              }}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200"
            >
              Browse All
            </button>
          </div>

          <div className="pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    handleSelectCategory(c.id);
                  }}
                  className="text-left p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 truncate"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
