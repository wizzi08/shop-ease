import React, { useState } from 'react';
import { Users, Shield, Store, ShoppingBag, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const QuickDemoSwitcher: React.FC = () => {
  const { currentUser, users, switchUser, logout, resetToDefaultData } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="quick-demo-switcher" className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all"
        title="Switch between demo accounts"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">Role:</span>
        <span className="font-semibold capitalize">
          {currentUser ? `${currentUser.role} (${currentUser.name.split(' ')[0]})` : 'Guest'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <p className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                Quick Persona Switcher
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Test buyer, seller, and admin experiences seamlessly
              </p>
            </div>

            <div className="py-1 space-y-1">
              {users.map(u => {
                const isCurrent = currentUser?.id === u.id;
                let RoleIcon = ShoppingBag;
                let roleColor = 'text-blue-500 bg-blue-50 dark:bg-blue-950/40';

                if (u.role === 'seller') {
                  RoleIcon = Store;
                  roleColor = 'text-purple-500 bg-purple-50 dark:bg-purple-950/40';
                } else if (u.role === 'admin') {
                  RoleIcon = Shield;
                  roleColor = 'text-amber-500 bg-amber-50 dark:bg-amber-950/40';
                }

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 font-medium'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg ${roleColor}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-zinc-500 capitalize">
                          {u.role === 'seller' ? `${u.storeName || 'Seller'}` : u.role}
                        </div>
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-all ${
                  !currentUser
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 font-medium'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <div className="p-1.5 rounded-lg text-zinc-500 bg-zinc-100 dark:bg-zinc-800">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Guest Visitor</span>
                  <span className="block text-[10px] text-zinc-500">Unauthenticated mode</span>
                </div>
                {!currentUser && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
            </div>

            <div className="pt-2 mt-1 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => {
                  resetToDefaultData();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample Database
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
