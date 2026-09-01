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
  | 'DRAWING_TOOLS'
  | 'ELECTRONICS'
  | 'BOOKS_NOTES'
  | 'FASHION'
  | 'HOSTEL_REQ'
  | 'HOBBY_SPORT'
  | 'OTHERS'
  // Legacy aliases
  | 'CYCLES'
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
    avatar?: string | null;
    branch?: string | null;
    year?: string | null;
    hostel?: string | null;
    rating?: number;
    reviewCount?: number;
    isVerified?: boolean;
    isProSeller?: boolean;
    phone?: string | null;
  };
  images: ListingImage[];
  isSaved?: boolean;
  _count?: {
    conversations?: number;
    savedBy?: number;
  };
}

export interface ListingsQueryResponse {
  success: boolean;
  data: Listing[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface Conversation {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
  partner?: {
    id: string;
    name: string;
    avatar?: string | null;
    branch?: string | null;
    hostel?: string | null;
    phone?: string | null;
  };
  listing: {
    id: string;
    title: string;
    price: number;
    status: ListingStatus;
    images: ListingImage[];
    sellerId: string;
  };
  buyer: {
    id: string;
    name: string;
    avatar?: string | null;
    hostel?: string | null;
  };
  seller: {
    id: string;
    name: string;
    avatar?: string | null;
    hostel?: string | null;
  };
  messages?: Message[];
  unreadCount?: number;
}
