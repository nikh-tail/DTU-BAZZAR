export type UserType = 'HOSTELER' | 'DAY_SCHOLAR';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  branch?: string | null;
  year?: string | null;
  userType: UserType;
  hostel?: string | null;
  roomNumber?: string | null;
  phone?: string | null;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  maxListings?: number;
  isProSeller?: boolean;
  upgradedAt?: string;
  totalListings?: number;
  savedCount?: number;
  createdAt?: string;
}

export type ListingCategory =
  | 'CYCLES'
  | 'ELECTRONICS'
  | 'BOOKS_ACADEMICS'
  | 'HOSTEL_ESSENTIALS'
  | 'LAB_STATIONERY'
  | 'SPORTS_FITNESS'
  | 'OTHER';

export type ListingCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'RESERVED' | 'ARCHIVED';

export interface ListingImage {
  id: string;
  url: string;
  order: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  condition: ListingCondition;
  status: ListingStatus;
  campusLocation?: string | null;
  viewsCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    email?: string;
    phone?: string | null;
    branch?: string | null;
    year?: string | null;
    userType?: string;
    hostel?: string | null;
    rating?: number;
    reviewCount?: number;
    avatar?: string | null;
    isProSeller?: boolean;
    maxListings?: number;
    _count?: {
      listings?: number;
    };
  };
  images: ListingImage[];
}

export interface ListingsQueryResponse {
  success: boolean;
  data: Listing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing: {
    id: string;
    title: string;
    price: number;
    status: ListingStatus;
    campusLocation?: string | null;
    images: ListingImage[];
  };
  partner: {
    id: string;
    name: string;
    phone?: string | null;
    branch?: string | null;
    year?: string | null;
    hostel?: string | null;
    avatar?: string | null;
  };
  isBuyer: boolean;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  unreadCount?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
  debugOtp?: string;
}
