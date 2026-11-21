import apiClient from './client';
import { 
  BusinessRule, 
  BusinessRuleEvaluationRequest, 
  BusinessRuleEvaluationResult,
  PaginatedResponse
} from '../types/api.types';

/**
 * Admin API service for business rule management
 */
export const adminApi = {
  /**
   * Fetch all business rules with pagination
   */
  getBusinessRules: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<BusinessRule>> => {
    const response = await apiClient.get('/api/business-rules', {
      params: { page, pageSize }
    });
    return response.data;
  },

  /**
   * Create a new business rule
   */
  createBusinessRule: async (rule: Omit<BusinessRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusinessRule> => {
    const response = await apiClient.post('/api/business-rules', rule);
    return response.data;
  },

  /**
   * Update an existing business rule
   */
  updateBusinessRule: async (id: string, rule: Partial<BusinessRule>): Promise<BusinessRule> => {
    const response = await apiClient.put(`/api/business-rules/${id}`, rule);
    return response.data;
  },

  /**
   * Delete a business rule
   */
  deleteBusinessRule: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/business-rules/${id}`);
  },

  /**
   * Evaluate a business rule with test data
   */
  evaluateBusinessRule: async (
    request: BusinessRuleEvaluationRequest
  ): Promise<BusinessRuleEvaluationResult> => {
    const response = await apiClient.post('/api/business-rules/evaluate', request);
    return response.data;
  },

  /**
   * Get system metrics and KPIs for admin dashboard
   */
  getSystemMetrics: async (): Promise<any> => {
    const response = await apiClient.get('/api/admin/metrics');
    return response.data;
  },

  /**
   * Get user management data
   */
  getUsers: async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/api/users', {
      params: { page, pageSize }
    });
    return response.data;
  },

  /**
   * Create a new user
   */
  createUser: async (userData: any): Promise<any> => {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  },

  /**
   * Update user information
   */
  updateUser: async (id: string, userData: any): Promise<any> => {
    const response = await apiClient.put(`/api/users/${id}`, userData);
    return response.data;
  },

  /**
   * Get audit logs with filters
   */
  getAuditLogs: async (
    page: number = 1, 
    pageSize: number = 20,
    filters?: {
      actionType?: string;
      userId?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get('/api/audit-logs', {
      params: { page, pageSize, ...filters }
    });
    return response.data;
  }
};

export default adminApi;