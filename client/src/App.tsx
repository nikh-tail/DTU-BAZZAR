import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { SocketProvider } from './context/SocketContext.js';
import { ChatProvider } from './context/ChatContext.js';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { BottomNav } from './components/common/BottomNav.js';
import { AuthModal } from './pages/AuthModal.js';
import { ChatDrawer } from './components/chat/ChatDrawer.js';
import { HomePage } from './pages/HomePage.js';
import { BrowsePage } from './pages/BrowsePage.js';
import { ListingDetailPage } from './pages/ListingDetailPage.js';
import { CreateListingPage } from './pages/CreateListingPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});

  // Sync with browser URL hash for friendly shareable navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('listing/')) {
        const id = hash.replace('listing/', '');
        setCurrentPage('listing-detail');
        setPageParams({ id });
      } else if (hash.startsWith('browse')) {
        const queryParams = new URLSearchParams(hash.replace('browse?', ''));
        setCurrentPage('browse');
        setPageParams({
          search: queryParams.get('search') || '',
          category: queryParams.get('category') || '',
        });
      } else if (hash === 'sell') {
        setCurrentPage('create-listing');
        setPageParams({});
      } else if (hash.startsWith('profile')) {
        setCurrentPage('profile');
        setPageParams({});
      } else {
        setCurrentPage('home');
        setPageParams({});
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);

    if (page === 'home') {
      window.location.hash = '';
    } else if (page === 'browse') {
      const sp = new URLSearchParams();
      if (params.search) sp.set('search', params.search);
      if (params.category) sp.set('category', params.category);
      window.location.hash = sp.toString() ? `browse?${sp.toString()}` : 'browse';
    } else if (page === 'listing-detail' && params.id) {
      window.location.hash = `listing/${params.id}`;
    } else if (page === 'create-listing') {
      window.location.hash = 'sell';
    } else if (page === 'profile') {
      window.location.hash = 'profile';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-campus-bg text-slate-100 flex flex-col justify-between selection:bg-campus-lime selection:text-black pb-16 sm:pb-0">
      {/* Sticky Top Navigation (Desktop & Mobile Header) */}
      <Navbar
        onNavigate={navigate}
        activePage={currentPage}
        onSearch={(query) => navigate('browse', { search: query })}
      />

      {/* Main Routed Page */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={navigate} />}

        {currentPage === 'browse' && (
          <BrowsePage initialParams={pageParams} onNavigate={navigate} />
        )}

        {currentPage === 'listing-detail' && pageParams.id && (
          <ListingDetailPage listingId={pageParams.id} onNavigate={navigate} />
        )}

        {currentPage === 'create-listing' && (
          <CreateListingPage onNavigate={navigate} />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            userId={pageParams.userId}
            initialTab={pageParams.tab}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Global Campus Footer */}
      <Footer onNavigate={navigate} />

      {/* Mobile-First App Navigation Bar */}
      <BottomNav currentPage={currentPage} onNavigate={navigate} />

      {/* Global In-App Chat Drawer */}
      <ChatDrawer
        onNavigateListing={(listingId) => navigate('listing-detail', { id: listingId })}
      />

      {/* Global DTU Email OTP Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <AppContent />
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
