import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, ExternalLink, HelpCircle, X } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface DomainAuthNoticeProps {
  onDismiss?: () => void;
}

export const DomainAuthNotice: React.FC<DomainAuthNoticeProps> = ({ onDismiss }) => {
  const { firebaseProjectId, clearDomainAuthError } = useMarketplace();
  const [copied, setCopied] = useState(false);
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'run.app';

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hostname);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleClose = () => {
    clearDomainAuthError();
    if (onDismiss) onDismiss();
  };

  const consoleUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`;

  return (
    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/20 text-zinc-800 dark:text-zinc-200 text-xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Google Auth: Domain Authorization Step</span>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
        Firebase requires container URLs to be added to Authorized Domains for Google Sign-in.
      </p>

      {/* Copy domain bar */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-amber-500/20 dark:border-zinc-800">
        <span className="font-mono text-[11px] text-zinc-900 dark:text-zinc-100 truncate select-all">
          {hostname}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <a
          href={consoleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-[11px] hover:opacity-90 transition-opacity"
        >
          <span>Open Firebase Console Settings</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <span className="text-[10px] text-zinc-500">
          (Settings &rarr; Authorized domains &rarr; Add domain)
        </span>
      </div>

      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-amber-500/20 dark:border-zinc-800/80 pt-2 font-medium">
        ✨ <strong>Instant Alternative:</strong> Email & Password registration and sign-in below works immediately with zero domain restrictions!
      </div>
    </div>
  );
};
