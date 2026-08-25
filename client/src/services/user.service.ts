import { api } from './api.js';
import { Listing, User } from '../types/index.js';

export interface MyListingsResponse {
  success: boolean;
  data: {
    all: Listing[];
    active: Listing[];
    sold: Listing[];
    stats: {
      totalListings: number;
      activeCount: number;
      soldCount: number;
    };
  };
}

export class UserService {
  static async getUserProfile(id: string): Promise<{ success: boolean; data: User & { listings: Listing[] } }> {
    const res = await api.get<{ success: boolean; data: User & { listings: Listing[] } }>(`/users/profile/${id}`);
    return res.data;
  }

  static async updateProfile(payload: Partial<User>): Promise<{ success: boolean; message: string; data: User }> {
    const res = await api.put<{ success: boolean; message: string; data: User }>('/users/profile', payload);
    return res.data;
  }

  static async getMyListings(): Promise<MyListingsResponse> {
    const res = await api.get<MyListingsResponse>('/users/my-listings');
    return res.data;
  }

  static async toggleSaveListing(listingId: string): Promise<{ success: boolean; saved: boolean; message: string }> {
    const res = await api.post<{ success: boolean; saved: boolean; message: string }>('/users/saved/toggle', { listingId });
    return res.data;
  }

  static async getSavedListings(): Promise<{ success: boolean; data: Listing[] }> {
    const res = await api.get<{ success: boolean; data: Listing[] }>('/users/saved');
    return res.data;
  }
}
