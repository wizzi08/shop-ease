import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { DomainAuthNotice } from '../components/common/DomainAuthNotice';

export const WelcomeAuthView: React.FC = () => {
  const {
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    sendPasswordReset,
    navigate,
    addToast,
    isDarkMode,
    toggleTheme,
    isFirebaseConnected,
    firebaseProjectId,
    domainAuthError
  } = useMarketplace();

  const [showDomainHelp, setShowDomainHelp] = useState(false);

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        navigate('home');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email) {
          addToast('error', 'Required Field', 'Please enter your email.');
          setIsLoading(false);
          return;
        }
        const ok = await loginWithEmail(email, password || 'password123');
        if (ok) {
          navigate('home');
        }
      } else if (mode === 'signup') {
        if (!email || !name) {
          addToast('error', 'Required Fields', 'Please fill in your name and email.');
          setIsLoading(false);
          return;
        }
        const ok = await signupWithEmail(
          email,
          password || 'password123',
          { name, email, storeName: selectedRole === 'seller' ? storeName : undefined },
          selectedRole
        );
        if (ok) {
          navigate(selectedRole === 'seller' ? 'seller-dashboard' : 'home');
        }
      } else if (mode === 'forgot_password') {
        if (!email) {
          addToast('error', 'Required Field', 'Please enter your account email.');
          setIsLoading(false);
          return;
        }
        await sendPasswordReset(email);
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-xl shadow-md">
            M
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
              Meridian
            </span>
            <span className="text-[10px] ml-1.5 font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded-md">
              Marketplace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* Skip / Guest exploration */}
          <button
            onClick={() => navigate('home')}
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            Explore as Guest &rarr;
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero & Feature Highlights (Lg screen) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Next-Generation Peer & Merchant Commerce</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                Curated marketplace for verified goods.
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                Join thousands of verified buyers and boutique sellers trading premium electronics, audio, artisan homecrafts, and authentic collectibles.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Escrow Payout Guarantee</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Buyer funds held securely until delivery inspection is confirmed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mt-0.5">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Boutique & Artisan Stores</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Direct creator storefronts with real-time stock and logistics tracking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Live Firebase Cloud Sync</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Instant real-time offers, secure authentication, and active order updates.</p>
                </div>
              </div>
            </div>

            {/* Connection badge */}
            <div className="pt-2 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Connected to Firebase: <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">{firebaseProjectId}</span>
              </span>
            </div>
          </div>

          {/* Right Auth Card */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
              {/* Top Navigation Tabs */}
              <div className="grid grid-cols-2 border-b border-zinc-100 dark:border-zinc-800 p-1.5 bg-zinc-50/70 dark:bg-zinc-900/50">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {mode === 'login' && 'Welcome back'}
                    {mode === 'signup' && 'Join Meridian Marketplace'}
                    {mode === 'forgot_password' && 'Password recovery'}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {mode === 'login' && 'Sign in to access your orders, store inventory, and messages.'}
                    {mode === 'signup' && 'Register your buyer or seller account in seconds.'}
                    {mode === 'forgot_password' && "Enter your email and we'll send password recovery instructions."}
                  </p>
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-98 cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                      <span>Continue with Google (Firebase)</span>
                    </>
                  )}
                </button>

                {/* Domain Auth Notice / Instructions */}
                {(domainAuthError || showDomainHelp) && (
                  <DomainAuthNotice onDismiss={() => setShowDomainHelp(false)} />
                )}

                <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                  <span>Firebase Google Auth</span>
                  <button
                    type="button"
                    onClick={() => setShowDomainHelp(prev => !prev)}
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Domain setup help</span>
                  </button>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
                  <span className="bg-white dark:bg-zinc-900 px-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider absolute">
                    or continue with email
                  </span>
                </div>

                {/* Form fields */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <>
                      {/* Role selection */}
                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                          I want to:
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedRole('buyer')}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedRole === 'buyer'
                                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 ring-1 ring-blue-600'
                                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0" />
                            <div>
                              <div className="text-xs font-bold">Shop & Buy</div>
                              <div className="text-[10px] text-zinc-500">Discover goods</div>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedRole('seller')}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              selectedRole === 'seller'
                                ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 ring-1 ring-purple-600'
                                : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                            }`}
                          >
                            <Store className="w-4 h-4 text-purple-600 shrink-0" />
                            <div>
                              <div className="text-xs font-bold">Sell Goods</div>
                              <div className="text-[10px] text-zinc-500">Store & payouts</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Jordan Hayes"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Store name if seller */}
                      {selectedRole === 'seller' && (
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Store or Brand Name
                          </label>
                          <div className="relative">
                            <Store className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              value={storeName}
                              onChange={e => setStoreName(e.target.value)}
                              placeholder="e.g. Pacific Artisan Lab"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-purple-500 outline-hidden"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  {mode !== 'forgot_password' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Password
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => setMode('forgot_password')}
                            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs sm:text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>
                          {mode === 'login' && 'Sign In to Account'}
                          {mode === 'signup' && (selectedRole === 'seller' ? 'Create Merchant Account' : 'Create Buyer Account')}
                          {mode === 'forgot_password' && 'Send Reset Link'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer mode toggle & Guest link */}
                <div className="pt-2 flex flex-col items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 text-center">
                  {mode === 'login' && (
                    <div>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setMode('signup')}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Create an account
                      </button>
                    </div>
                  )}
                  {mode === 'signup' && (
                    <div>
                      Already registered?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Sign in instead
                      </button>
                    </div>
                  )}
                  {mode === 'forgot_password' && (
                    <div>
                      Remember your password?{' '}
                      <button
                        onClick={() => setMode('login')}
                        className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Back to sign in
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 w-full flex items-center justify-center">
                    <button
                      onClick={() => navigate('home')}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Continue browsing as guest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-3">
        <p>&copy; {new Date().getFullYear()} Meridian Marketplace. Secured by Firebase Cloud Firestore.</p>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('terms')} className="hover:underline">Terms of Service</button>
          <button onClick={() => navigate('privacy')} className="hover:underline">Privacy Policy</button>
          <button onClick={() => navigate('help')} className="hover:underline">Trust & Safety</button>
        </div>
      </footer>
    </div>
  );
};
