import React from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let borderClass = 'border-blue-500/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl shadow-blue-500/5';
        let iconClass = 'text-blue-500 bg-blue-50 dark:bg-blue-950/50';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl shadow-emerald-500/5';
          iconClass = 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl shadow-amber-500/5';
          iconClass = 'text-amber-500 bg-amber-50 dark:bg-amber-950/50';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-500/20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xl shadow-rose-500/5';
          iconClass = 'text-rose-500 bg-rose-50 dark:bg-rose-950/50';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border ${borderClass} transition-all duration-300 transform translate-y-0`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1 rounded-md"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
