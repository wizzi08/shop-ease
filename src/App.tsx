import React, { useEffect } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/layout/CartDrawer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';

// Views
import { HomeView } from './views/HomeView';
import { BrowseView } from './views/BrowseView';
import { ProductDetailView } from './views/ProductDetailView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { BuyerDashboardView } from './views/BuyerDashboardView';
import { SellerDashboardView } from './views/SellerDashboardView';
import { CreateEditListingView } from './views/CreateEditListingView';
import { MessagingView } from './views/MessagingView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { UserProfileView } from './views/UserProfileView';
import { HelpContactView } from './views/HelpContactView';
import { LegalView } from './views/LegalView';

const MainContent: React.FC = () => {
  const { currentView, viewParams, isDarkMode } = useMarketplace();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, viewParams]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'browse':
        return <BrowseView />;
      case 'product':
        return <ProductDetailView productId={viewParams?.productId || 'prod-1'} />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return (
          <CheckoutView
            discount={viewParams?.discount}
            couponCode={viewParams?.couponCode}
          />
        );
      case 'order-confirmation':
        return <OrderConfirmationView orderId={viewParams?.orderId} />;
      case 'buyer-dashboard':
        return <BuyerDashboardView tab={viewParams?.tab} />;
      case 'wishlist':
        return <BuyerDashboardView tab="wishlist" />;
      case 'seller-dashboard':
        return <SellerDashboardView tab={viewParams?.tab} />;
      case 'create-listing':
        return <CreateEditListingView />;
      case 'edit-listing':
        return <CreateEditListingView productId={viewParams?.productId} />;
      case 'messaging':
        return <MessagingView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'profile':
        return <UserProfileView userId={viewParams?.userId || 'user-seller-1'} />;
      case 'help':
        return <HelpContactView section={viewParams?.section} />;
      case 'terms':
        return <LegalView type="terms" />;
      case 'privacy':
        return <LegalView type="privacy" />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <MarketplaceProvider>
      <MainContent />
    </MarketplaceProvider>
  );
}

export default App;
