import { apiClient } from './client';
import { 
  PendingApprovalResponse, 
  ApprovalDecisionResponse,
  PendingApproval,
  ApprovalDecisionRequest
} from '../types/api.types';

export const approvalApi = {
  /**
   * Get pending approvals for the current user
   */
  async getPendingApprovals(): Promise<PendingApprovalResponse> {
    const response = await apiClient.get<PendingApprovalResponse>('/api/approvals/pending');
    return response.data;
  },

  /**
   * Get a specific approval by ID
   */
  async getApprovalById(id: string): Promise<PendingApproval> {
    const response = await apiClient.get<PendingApproval>(`/api/approvals/${id}`);
    return response.data;
  },

  /**
   * Submit a decision for an approval
   */
  async submitDecision(approvalId: string, data: ApprovalDecisionRequest): Promise<ApprovalDecisionResponse> {
    const response = await apiClient.post<ApprovalDecisionResponse>(
      `/api/approvals/${approvalId}/decide`,
      data
    );
    return response.data;
  },

  /**
   * Get approval history for a request
   */
  async getApprovalHistory(requestId: string): Promise<PendingApproval[]> {
    const response = await apiClient.get<PendingApproval[]>(`/api/approvals/history/${requestId}`);
    return response.data;
  },

  /**
   * Reassign an approval to another user
   */
  async reassignApproval(approvalId: string, targetUserId: string): Promise<{ success: boolean }> {
    const response = await apiClient.post<{ success: boolean }>(
      `/api/approvals/${approvalId}/reassign`,
      { targetUserId }
    );
    return response.data;
  },

  /**
   * Get approval stats for the current user
   */
  async getApprovalStats(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    avgResponseTime: number;
  }> {
    const response = await apiClient.get<{
      pending: number;
      approved: number;
      rejected: number;
      total: number;
      avgResponseTime: number;
    }>('/api/approvals/stats');
    return response.data;
  },

  /**
   * Get approval metrics for admin dashboard
   */
  async getApprovalMetrics(timeRange: 'day' | 'week' | 'month' = 'week'): Promise<{
    approvalsPerDay: Array<{ date: string; count: number }>;
    approvalRate: number;
    avgResponseTimeByPriority: Record<string, number>;
    topApprovers: Array<{ userId: string; userName: string; count: number }>;
  }> {
    const response = await apiClient.get<{
      approvalsPerDay: Array<{ date: string; count: number }>;
      approvalRate: number;
      avgResponseTimeByPriority: Record<string, number>;
      topApprovers: Array<{ userId: string; userName: string; count: number }>;
    }>(`/api/approvals/metrics?timeRange=${timeRange}`);
    return response.data;
  }
};