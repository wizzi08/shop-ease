import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  DollarSign,
  Tag,
  ShoppingBag,
  Check,
  CheckCheck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Conversation, Product } from '../types';
import { BackButton } from '../components/common/BackButton';

export const MessagingView: React.FC = () => {
  const {
    currentUser,
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    products,
    navigate,
    openAuthModal,
    addToast
  } = useMarketplace();

  const [messageText, setMessageText] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeConversationId]);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please sign in to access your messages</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Filter conversations for current user
  const userConversations = conversations.filter(c =>
    c.participants.includes(currentUser.id)
  );

  const activeConv = userConversations.find(c => c.id === activeConversationId) || userConversations[0];
  const linkedProduct = activeConv?.productId ? products.find(p => p.id === activeConv.productId) : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageText.trim());
    setMessageText('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount || !activeConv || !linkedProduct) return;
    const numericOffer = Number(offerAmount);
    if (isNaN(numericOffer) || numericOffer <= 0) return;

    sendMessage(
      activeConv.id,
      `OFFER PROPOSAL: I'd like to offer $${numericOffer.toFixed(2)} for "${linkedProduct.title}". (Regular Price: $${linkedProduct.price.toFixed(2)})`
    );
    setIsOfferModalOpen(false);
    setOfferAmount('');
    addToast('success', 'Offer Sent', `Your offer of $${numericOffer.toFixed(2)} was sent to the seller.`);
  };

  return (
    <div id="messaging-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-4">
      <div>
        <BackButton variant="pill" label="Back to previous page" fallbackView="home" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Direct Inquiries & Messages
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Chat securely with buyers and sellers with protected transaction escrow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[600px]">
        {/* Left Col: Conversation List */}
        <div className="lg:col-span-4 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Conversations ({userConversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {userConversations.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs">
                No active conversations. Start one from any product listing page.
              </div>
            ) : (
              userConversations.map(conv => {
                const otherParticipantName =
                  conv.participantNames.find(n => n !== currentUser.name) || 'User';
                const otherParticipantAvatar =
                  conv.participantAvatars.find(a => a !== currentUser.avatar) ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                const isSelected = activeConv?.id === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600'
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <img
                      src={otherParticipantAvatar}
                      alt={otherParticipantName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {otherParticipantName}
                        </h4>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(conv.updatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {conv.productTitle && (
                        <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                          Item: {conv.productTitle}
                        </p>
                      )}

                      <p className="text-xs text-zinc-500 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Active Chat Window */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {activeConv ? (
            <>
              {/* Chat Header with Linked Product Context */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      activeConv.participantAvatars.find(a => a !== currentUser.avatar) ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {activeConv.participantNames.find(n => n !== currentUser.name) || 'User'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Online • Direct Response</span>
                    </div>
                  </div>
                </div>

                {/* Linked Product Bar & Make Offer */}
                {linkedProduct && (
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-2xs">
                    <img
                      src={linkedProduct.images[0]}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div className="min-w-0 pr-2">
                      <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px]">
                        {linkedProduct.title}
                      </p>
                      <p className="text-[10px] text-zinc-500">${linkedProduct.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => setIsOfferModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-100 text-[11px] font-bold whitespace-nowrap"
                    >
                      Make Offer
                    </button>
                    <button
                      onClick={() => navigate('product', { productId: linkedProduct.id })}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-[11px] font-bold"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[420px]">
                {/* Encrypted Protection Banner */}
                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 text-center text-zinc-500 text-[11px] flex items-center justify-center gap-1.5 max-w-md mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Never transact outside Meridian to maintain Escrow Buyer Guarantee.</span>
                </div>

                {activeConv.messages.map(msg => {
                  const isMine = msg.senderId === currentUser.id;
                  const isOffer = msg.text.startsWith('OFFER PROPOSAL');

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isOffer
                            ? 'bg-purple-600 text-white shadow-md'
                            : isMine
                            ? 'bg-blue-600 text-white rounded-br-xs'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs'
                        }`}
                      >
                        {isOffer && (
                          <div className="flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider text-purple-200 mb-1">
                            <Tag className="w-3 h-3" /> Special Price Proposal
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <div
                          className={`text-[10px] text-right mt-1 flex items-center justify-end gap-1 ${
                            isMine || isOffer ? 'text-white/80' : 'text-zinc-400'
                          }`}
                        >
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMine && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message, question about dimensions, or shipment timing..."
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400 text-xs">
              <MessageSquare className="w-12 h-12 mb-2 text-zinc-300" />
              <p className="font-bold text-zinc-700 dark:text-zinc-300">Select a conversation</p>
              <p>Choose an inquiry from the left to start messaging.</p>
            </div>
          )}
        </div>
      </div>

      {/* Make Offer Modal */}
      {isOfferModalOpen && linkedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs" onClick={() => setIsOfferModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Propose Custom Price
            </h3>
            <p className="text-zinc-500">
              Propose a fair offer for <strong>{linkedProduct.title}</strong> (Listing Price: ${linkedProduct.price.toFixed(2)}).
            </p>

            <div className="relative">
              <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="1"
                placeholder="Enter offer in USD"
                value={offerAmount}
                onChange={e => setOfferAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-bold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
