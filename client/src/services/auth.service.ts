import { api } from './api.js';
import { User } from '../types/index.js';

export interface OtpResponse {
  success: boolean;
  message: string;
  debugOtp?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  isNewUser?: boolean;
  token: string;
  user: User;
}

export class AuthService {
  static async requestOtp(email: string, purpose: 'SIGNUP' | 'LOGIN' = 'SIGNUP'): Promise<OtpResponse> {
    const res = await api.post<OtpResponse>('/auth/request-otp', { email, purpose });
    return res.data;
  }

  static async verifyOtp(payload: {
    email: string;
    otp: string;
    name?: string;
    branch?: string;
    year?: string;
    userType?: string;
    hostel?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/verify-otp', payload);
    if (res.data.token) {
      localStorage.setItem('dtu_bazaar_token', res.data.token);
    }
    return res.data;
  }

  static async updateProfile(payload: {
    name?: string;
    branch?: string;
    year?: string;
    userType?: 'HOSTELER' | 'DAY_SCHOLAR';
    hostel?: string;
    roomNumber?: string;
    phone?: string;
  }): Promise<{ success: boolean; data: User }> {
    const res = await api.put<{ success: boolean; data: User }>('/users/profile', payload);
    return res.data;
  }

  static async getMe(): Promise<{ success: boolean; user: User }> {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  }

  static logout(): void {
    localStorage.removeItem('dtu_bazaar_token');
  }
}
