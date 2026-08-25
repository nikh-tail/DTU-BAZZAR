import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { ProfileCard } from '../components/profile/ProfileCard.js';
import { UserListingsTabs } from '../components/profile/UserListingsTabs.js';
import { UserService } from '../services/user.service.js';
import { Listing, User } from '../types/index.js';

interface ProfilePageProps {
  userId?: string;
  initialTab?: 'active' | 'sold' | 'saved';
  onNavigate: (page: string, params?: any) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
  initialTab = 'active',
  onNavigate,
}) => {
  const { user: currentUser, isAuthenticated, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [activeListings, setActiveListings] = useState<Listing[]>([]);
  const [soldListings, setSoldListings] = useState<Listing[]>([]);
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = !userId || (currentUser && currentUser.id === userId);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      if (isOwner && currentUser) {
        setProfileUser(currentUser);
        // Fetch user's listings and saved items
        const [listingsRes, savedRes] = await Promise.all([
          UserService.getMyListings(),
          UserService.getSavedListings(),
        ]);

        if (listingsRes.success) {
          setActiveListings(listingsRes.data.active);
          setSoldListings(listingsRes.data.sold);
        }
        if (savedRes.success) {
          setSavedListings(savedRes.data);
        }
      } else if (userId) {
        // Fetch public student seller profile
        const res = await UserService.getUserProfile(userId);
        if (res.success && res.data) {
          const { listings, ...u } = res.data;
          setProfileUser(u);
          setActiveListings(listings || []);
          setSoldListings([]);
          setSavedListings([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, currentUser]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="h-48 rounded-3xl bg-slate-900 animate-pulse" />
        <div className="h-64 rounded-3xl bg-slate-900 animate-pulse" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Student profile not found</h2>
        <p className="text-sm text-slate-400 mb-6">Please log in with your DTU student email to view your profile dashboard.</p>
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-full bg-campus-lime text-black font-bold text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 min-h-screen">
      {/* Student Profile Card */}
      <ProfileCard
        user={profileUser}
        isOwner={Boolean(isOwner)}
        onUpdate={(updated) => {
          setProfileUser({ ...profileUser, ...updated });
          if (isOwner) updateUser(updated);
        }}
      />

      {/* Tabs & Listings Management */}
      <div className="bg-campus-card/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <UserListingsTabs
          activeListings={activeListings}
          soldListings={soldListings}
          savedListings={savedListings}
          onSelectListing={(id) => onNavigate('listing-detail', { id })}
          onRefresh={fetchData}
          initialTab={initialTab}
        />
      </div>
    </div>
  );
};
