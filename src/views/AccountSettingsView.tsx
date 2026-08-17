import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Settings,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  Flame,
  Store,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { UserAddress, UserPaymentMethod } from '../types';

export const AccountSettingsView: React.FC = () => {
  const {
    currentUser,
    updateUser,
    updateSettings,
    addAddress,
    removeAddress,
    setDefaultAddress,
    isFirebaseConnected,
    firebaseProjectId,
    sendPasswordReset,
    navigate,
    openAuthModal,
    logout,
    addToast
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payments' | 'notifications' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [storeName, setStoreName] = useState('');
  const [avatar, setAvatar] = useState('');

  // Notification Preferences State
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Address Modal State
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newPhone, setNewPhone] = useState('');
  const [isDefaultAddr, setIsDefaultAddr] = useState(false);

  // Sync state when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setLocation(currentUser.location || '');
      setBio(currentUser.bio || '');
      setStoreName(currentUser.storeName || '');
      setAvatar(currentUser.avatar || '');

      setOrderUpdates(
        currentUser.notificationPreferences?.orderUpdates ?? currentUser.settings?.orderUpdates ?? true
      );
      setPriceAlerts(currentUser.settings?.priceAlerts ?? true);
      setMarketingEmails(
        currentUser.notificationPreferences?.promotions ?? currentUser.settings?.marketingEmails ?? false
      );
      setCurrency(currentUser.settings?.currency || 'USD');
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 shadow-sm">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">Account Settings</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Please sign in or create an account to view and configure your profile settings, delivery addresses, and security preferences.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      phone,
      location,
      bio,
      storeName: currentUser.role === 'seller' ? storeName : currentUser.storeName,
      avatar
    });
    addToast('success', 'Profile Updated', 'Your personal account details have been saved.');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      notificationPreferences: {
        orderUpdates,
        promotions: marketingEmails
      },
      settings: {
        ...(currentUser.settings || {
          emailNotifications: true,
          orderUpdates: true,
          priceAlerts: true,
          marketingEmails: false,
          twoFactorAuth: false,
          currency: 'USD'
        }),
        orderUpdates,
        priceAlerts,
        marketingEmails,
        currency
      }
    });
    addToast('success', 'Preferences Saved', 'Your notification and currency preferences have been updated.');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newStreet || !newCity || !newPostalCode) {
      addToast('error', 'Incomplete Address', 'Please fill in all required address fields.');
      return;
    }

    addAddress({
      fullName: newFullName,
      street: newStreet,
      city: newCity,
      state: newState,
      postalCode: newPostalCode,
      country: newCountry,
      phone: newPhone || currentUser.phone || '',
      isDefault: isDefaultAddr || (currentUser.addresses?.length || 0) === 0
    });

    setIsAddAddressOpen(false);
    setNewFullName('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewPostalCode('');
    setNewPhone('');
    setIsDefaultAddr(false);
  };

  const handlePasswordReset = async () => {
    if (currentUser.email) {
      const res = await sendPasswordReset(currentUser.email);
      if (res) {
        addToast('success', 'Reset Link Sent', `Password reset instructions sent to ${currentUser.email}.`);
      }
    }
  };

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  ];

  return (
    <div id="account-settings-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-600 dark:border-blue-500 shadow-md"
            />
            {currentUser.verified && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100">
                {currentUser.name}
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 capitalize">
                {currentUser.role} Account
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {currentUser.email} • {currentUser.location || 'Global User'} • Member since {currentUser.joinDate || '2026'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'seller' ? (
            <button
              onClick={() => navigate('seller-dashboard')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchant Dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('buyer-dashboard')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>My Orders & Purchases</span>
            </button>
          )}

          <button
            onClick={() => navigate('profile', { userId: currentUser.id })}
            className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 text-xs font-bold transition-all"
          >
            View Public Profile
          </button>
        </div>
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="space-y-1 md:col-span-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Personal Info</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'addresses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Shipping Addresses ({currentUser.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'payments'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment & Escrow Methods</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications & Preferences</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Firebase Auth</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="md:col-span-3">
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 text-xs">
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Personal Information</h3>
                  <p className="text-[11px] text-zinc-500">Update your public profile display name, avatar, and contact details.</p>
                </div>

                {/* Avatar Chooser */}
                <div className="space-y-2">
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300">Avatar Image</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar || currentUser.avatar}
                      alt="Avatar preview"
                      className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        type="url"
                        value={avatar}
                        onChange={e => setAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-zinc-400">Quick presets:</span>
                    <div className="flex items-center gap-1.5">
                      {avatarOptions.map((opt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setAvatar(opt)}
                          className="w-6 h-6 rounded-full overflow-hidden border-2 hover:border-blue-500 transition-all cursor-pointer"
                        >
                          <img src={opt} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Display Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {currentUser.role === 'seller' && (
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Storefront / Merchant Brand Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      placeholder="e.g. Apex Timepieces"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Bio / About Me
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell other marketplace buyers and merchants about yourself..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Delivery Addresses</h3>
                    <p className="text-[11px] text-zinc-500">Saved shipping destinations for 1-click escrow checkout.</p>
                  </div>
                  <button
                    onClick={() => setIsAddAddressOpen(true)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
                  <div className="p-10 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                    <MapPin className="w-8 h-8 text-zinc-400 mx-auto" />
                    <p className="font-bold text-zinc-700 dark:text-zinc-300">No saved addresses yet</p>
                    <p className="text-[11px] text-zinc-500">Add an address to speed up order checkouts and parcel delivery.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentUser.addresses.map(addr => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-2xl border transition-all relative space-y-2 ${
                          addr.isDefault
                            ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 dark:border-blue-500'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-900 dark:text-zinc-100">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                                Default
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeAddress(addr.id)}
                            className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.postalCode}<br />
                          {addr.country}
                        </p>

                        {addr.phone && (
                          <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{addr.phone}</span>
                          </p>
                        )}

                        {!addr.isDefault && (
                          <div className="pt-2 border-t border-zinc-200/50 dark:border-zinc-700/50">
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                              Set as Default Delivery Address
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Address Modal / Form */}
              {isAddAddressOpen && (
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-blue-500 shadow-md space-y-4 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Add Shipping Address</h4>
                    <button
                      onClick={() => setIsAddAddressOpen(false)}
                      className="text-zinc-400 hover:text-zinc-600 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateAddress} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newFullName}
                          onChange={e => setNewFullName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={newPhone}
                          onChange={e => setNewPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newStreet}
                        onChange={e => setNewStreet(e.target.value)}
                        placeholder="123 Market St, Suite 400"
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={newCity}
                          onChange={e => setNewCity(e.target.value)}
                          placeholder="San Francisco"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">State / Region</label>
                        <input
                          type="text"
                          value={newState}
                          onChange={e => setNewState(e.target.value)}
                          placeholder="CA"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={newPostalCode}
                          onChange={e => setNewPostalCode(e.target.value)}
                          placeholder="94105"
                          className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDefaultAddr}
                        onChange={e => setIsDefaultAddr(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">Use as primary default shipping address</span>
                    </label>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 3. PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4 text-xs">
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Payment & Escrow Protection</h3>
                  <p className="text-[11px] text-zinc-500">Encrypted payment instruments held securely under Stripe Escrow guarantees.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">Active</span>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Card Number</p>
                      <p className="font-mono text-sm tracking-wider font-bold">•••• •••• •••• 4242</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400">
                      <span>Expires 12/28</span>
                      <span>{currentUser.name}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                        <Shield className="w-4 h-4" />
                        <span>Escrow Vault Guaranteed</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">
                        Every purchase on Meridian is held in automated escrow until tracking confirms carrier delivery and buyer satisfaction.
                      </p>
                    </div>
                    <button
                      onClick={() => addToast('info', 'Secure Checkout', 'You can manage or add new cards directly during checkout!')}
                      className="text-left text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      + Add payment method during checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 text-xs">
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notification Channels</h3>
                  <p className="text-[11px] text-zinc-500">Configure how and when Meridian delivers alerts to your devices.</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Order & Shipping Milestones</p>
                      <p className="text-zinc-500 text-[11px]">Real-time tracking notifications when shipments are dispatched and delivered.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={orderUpdates}
                      onChange={e => setOrderUpdates(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Wishlist & Price Drop Alerts</p>
                      <p className="text-zinc-500 text-[11px]">Instant notifications when items in your saved wishlist drop in price.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={priceAlerts}
                      onChange={e => setPriceAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Curated Drops & Promotional Offers</p>
                      <p className="text-zinc-500 text-[11px]">Exclusive flash sales, discount coupons, and weekly merchant highlights.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={e => setMarketingEmails(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                  </label>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                  <label className="block font-bold text-zinc-900 dark:text-zinc-100">Preferred Display Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                    <option value="AUD">AUD ($) - Australian Dollar</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 5. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5 text-xs">
                <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Security & Authentication</h3>
                  <p className="text-[11px] text-zinc-500">Manage your connected credentials, password updates, and session safety.</p>
                </div>

                {/* Firebase Status */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Firebase Authentication Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                    Project: <span className="font-mono">{firebaseProjectId}</span> • Session verified
                  </p>
                </div>

                {/* Password reset trigger */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">Password & Credentials</p>
                    <p className="text-[11px] text-zinc-500">Send a password reset email link to {currentUser.email}.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold shrink-0 transition-all cursor-pointer"
                  >
                    Send Reset Link
                  </button>
                </div>

                {/* Danger zone */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                  <h4 className="font-bold text-rose-600 dark:text-rose-400">Session Controls</h4>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                    <div>
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">Sign out of Meridian</p>
                      <p className="text-[11px] text-zinc-500">End your current session on this device.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
