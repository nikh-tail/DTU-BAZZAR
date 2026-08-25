import { api } from './api.js';
import { Listing, ListingsQueryResponse } from '../types/index.js';

export interface ListingFiltersParams {
  search?: string;
  category?: string;
  condition?: string;
  campusLocation?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export class ListingService {
  static async getListings(params: ListingFiltersParams = {}): Promise<ListingsQueryResponse> {
    const res = await api.get<ListingsQueryResponse>('/listings', { params });
    return res.data;
  }

  static async getListingById(id: string): Promise<{ success: boolean; data: Listing; related: Listing[] }> {
    const res = await api.get<{ success: boolean; data: Listing; related: Listing[] }>(`/listings/${id}`);
    return res.data;
  }

  static async createListing(formData: FormData): Promise<{ success: boolean; message: string; data: Listing }> {
    const res = await api.post<{ success: boolean; message: string; data: Listing }>('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }

  static async updateListing(id: string, payload: Partial<Listing>): Promise<{ success: boolean; message: string; data: Listing }> {
    const res = await api.put<{ success: boolean; message: string; data: Listing }>(`/listings/${id}`, payload);
    return res.data;
  }

  static async markAsSold(id: string): Promise<{ success: boolean; message: string; data: Listing }> {
    const res = await api.patch<{ success: boolean; message: string; data: Listing }>(`/listings/${id}/sold`);
    return res.data;
  }

  static async deleteListing(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/listings/${id}`);
    return res.data;
  }

  static async getCategoriesSummary(): Promise<{ success: boolean; data: Record<string, number> }> {
    const res = await api.get<{ success: boolean; data: Record<string, number> }>('/listings/categories-summary');
    return res.data;
  }
}
