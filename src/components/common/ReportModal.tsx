import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'product' | 'user' | 'message';
  targetId: string;
  targetTitle: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle
}) => {
  const { createReport, currentUser, openAuthModal, addToast } = useMarketplace();
  const [reason, setReason] = useState('Counterfeit or Replica');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const reasons = [
    'Counterfeit or Replica item',
    'Prohibited or restricted goods',
    'Inaccurate item description or condition',
    'Suspected fraudulent seller or scam',
    'Harassment, abusive language, or spam',
    'Copyright or trademark violation',
    'Other safety concern'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    if (!details) {
      addToast('error', 'Details Required', 'Please provide a short explanation for the moderation team.');
      return;
    }

    createReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType,
      targetId,
      targetTitle,
      reason,
      details
    });

    onClose();
  };

  return (
    <div id="report-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Report {targetType}
              </h2>
              <p className="text-xs text-zinc-500 truncate max-w-[240px]">{targetTitle}</p>
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
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Select Reason
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-rose-500 outline-hidden"
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Additional Details & Context
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Please provide any relevant details that will assist our Trust & Safety team in reviewing this listing..."
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-rose-500 outline-hidden resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              Reports are taken seriously and reviewed by administrators within 24 hours. False reports may affect account standing.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-all shadow-md active:scale-98"
            >
              Submit Report to Moderation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
