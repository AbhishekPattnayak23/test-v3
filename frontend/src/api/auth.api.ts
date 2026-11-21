import type { ApiLoginRequest, ApiLoginResponse, ApiUser } from '../types/api.types';
import { apiClient } from './client';

/**
 * Authentication API service
 * Provides functions for user authentication and session management
 */
export const authApi = {
  /**
   * Authenticate user with email and password
   * @param credentials User login credentials
   * @returns Authentication response with user data and token
   */
  async login(credentials: ApiLoginRequest): Promise<ApiLoginResponse> {
    try {
      const response = await apiClient.post<ApiLoginResponse>('/auth/login', credentials);
      
      // Store token in sessionStorage if present
      if (response.data.token) {
        sessionStorage.setItem('auth_token', response.data.token);
        // Update axios client with new token
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      // Store user data
      if (response.data.user) {
        sessionStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Logout user and clear session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local session regardless of API success
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Get current authenticated user information
   * @returns Current user data
   */
  async getCurrentUser(): Promise<ApiUser> {
    try {
      const response = await apiClient.get<ApiUser>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      
      // Try to recover from sessionStorage if API fails
      const storedUser = sessionStorage.getItem('user_data');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Failed to parse stored user data:', parseError);
        }
      }
      
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns True if valid authentication token exists
   */
  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('auth_token');
    return !!token;
  },

  /**
   * Get stored authentication token
   * @returns JWT token or null
   */
  getToken(): string | null {
    return sessionStorage.getItem('auth_token');
  },

  /**
   * Get stored user data
   * @returns User object or null
   */
  getUser(): ApiUser | null {
    const storedUser = sessionStorage.getItem('user_data');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        return null;
      }
    }
    return null;
  }
};

// Export types used by this module
export type { ApiLoginRequest, ApiLoginResponse, ApiUser };