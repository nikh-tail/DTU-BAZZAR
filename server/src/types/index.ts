import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  branch?: string | null;
  year?: string | null;
  userType: string;
  hostel?: string | null;
  maxListings?: number;
  isProSeller?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
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
