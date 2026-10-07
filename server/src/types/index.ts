import { Request } from 'express';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  branch?: string | null;
  year?: string | null;
  userType: string;
  hostel?: string | null;
  roomNumber?: string | null;
  phone?: string | null;
  isVerified?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export type ListingCategory =
  | 'CYCLES'
  | 'ELECTRONICS'
  | 'BOOKS_ACADEMICS'
  | 'HOSTEL_ESSENTIALS'
  | 'LAB_STATIONERY'
  | 'SPORTS_FITNESS'
  | 'OTHER'
  // Extended aliases
  | 'DRAWING_TOOLS'
  | 'BOOKS_NOTES'
  | 'FASHION'
  | 'HOSTEL_REQ'
  | 'HOBBY_SPORT'
  | 'OTHERS';

export type ListingCondition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'RESERVED' | 'ARCHIVED';
