import apiClient from './client';
import type { Assignment, AssignmentCompletionRequest } from '../types/api.types';

/**
 * Assignment management API functions
 */
export const assignmentApi = {
  /**
   * Get assignments with optional filtering and pagination
   * @param params Filtering and pagination parameters
   * @returns List of assignments
   */
  async getAssignments(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await apiClient.get<{ assignments: Assignment[]; total: number; page: number; limit: number }>(
      '/api/assignments',
      { params }
    );
    return response.data;
  },

  /**
   * Get a specific assignment by ID
   * @param id Assignment ID
   * @returns Assignment details
   */
  async getAssignmentById(id: string) {
    const response = await apiClient.get<Assignment>(`/api/assignments/${id}`);
    return response.data;
  },

  /**
   * Complete an assignment
   * @param id Assignment ID
   * @param completionData Completion data including output and comments
   * @returns Updated assignment
   */
  async completeAssignment(id: string, completionData: AssignmentCompletionRequest) {
    const response = await apiClient.put<Assignment>(
      `/api/assignments/${id}/complete`,
      completionData
    );
    return response.data;
  },

  /**
   * Get assignments assigned to the current user
   * @param params Filtering parameters
   * @returns User's assignments
   */
  async getMyAssignments(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await apiClient.get<{ assignments: Assignment[]; total: number }>(
      '/api/assignments/my',
      { params }
    );
    return response.data;
  },

  /**
   * Search assignments by various criteria
   * @param query Search query
   * @param filters Additional filters
   * @returns Search results
   */
  async searchAssignments(query: string, filters?: Record<string, any>) {
    const response = await apiClient.post<{ assignments: Assignment[]; total: number }>(
      '/api/assignments/search',
      { query, filters }
    );
    return response.data;
  },

  /**
   * Get assignment statistics (e.g., completion rates, pending counts)
   * @returns Assignment statistics
   */
  async getAssignmentStats() {
    const response = await apiClient.get<{
      total: number;
      completed: number;
      pending: number;
      overdue: number;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
    }>('/api/assignments/stats');
    return response.data;
  },

  /**
   * Create a new assignment (admin only)
   * @param assignmentData Assignment creation data
   * @returns Created assignment
   */
  async createAssignment(assignmentData: {
    title: string;
    description?: string;
    userId: string;
    workflowTemplateId?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, any>;
  }) {
    const response = await apiClient.post<Assignment>('/api/assignments', assignmentData);
    return response.data;
  },

  /**
   * Update an assignment (admin only)
   * @param id Assignment ID
   * @param updateData Assignment update data
   * @returns Updated assignment
   */
  async updateAssignment(id: string, updateData: Partial<{
    title: string;
    description: string;
    userId: string;
    status: string;
    priority: string;
    dueDate: string;
    metadata: Record<string, any>;
  }>) {
    const response = await apiClient.put<Assignment>(`/api/assignments/${id}`, updateData);
    return response.data;
  },

  /**
   * Delete an assignment (admin only)
   * @param id Assignment ID
   */
  async deleteAssignment(id: string) {
    await apiClient.delete(`/api/assignments/${id}`);
  },

  /**
   * Get assignment audit logs
   * @param assignmentId Assignment ID
   * @param params Pagination parameters
   * @returns Audit logs for the assignment
   */
  async getAssignmentAuditLogs(assignmentId: string, params?: { page?: number; limit?: number }) {
    const response = await apiClient.get<{
      logs: Array<{
        id: string;
        action: string;
        userId: string;
        userName: string;
        timestamp: string;
        details: Record<string, any>;
      }>;
      total: number;
    }>(`/api/assignments/${assignmentId}/audit-logs`, { params });
    return response.data;
  }
};

export type { Assignment, AssignmentCompletionRequest };