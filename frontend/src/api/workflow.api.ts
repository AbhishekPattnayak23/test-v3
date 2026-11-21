import { apiClient } from './client';
import type { WorkflowTemplate, CreateWorkflowTemplateRequest, ApiResponse } from '../types/api.types';

/**
 * Workflow API client for managing workflow templates and executions
 */
export const workflowApi = {
  /**
   * Get all workflow templates with optional filtering
   */
  getTemplates: async (options?: {
    page?: number;
    limit?: number;
    name?: string;
    category?: string;
  }): Promise<ApiResponse<WorkflowTemplate[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<WorkflowTemplate[]>>('/api/workflows/templates', {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow templates:', error);
      return {
        success: false,
        error: 'Failed to fetch workflow templates',
        data: []
      };
    }
  },

  /**
   * Get a specific workflow template by ID
   */
  getTemplateById: async (templateId: string): Promise<ApiResponse<WorkflowTemplate>> => {
    try {
      const response = await apiClient.get<ApiResponse<WorkflowTemplate>>(`/api/workflows/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow template ${templateId}:`, error);
      return {
        success: false,
        error: `Failed to fetch workflow template ${templateId}`,
        data: {} as WorkflowTemplate
      };
    }
  },

  /**
   * Create a new workflow template
   */
  createTemplate: async (templateData: CreateWorkflowTemplateRequest): Promise<ApiResponse<WorkflowTemplate>> => {
    try {
      const response = await apiClient.post<ApiResponse<WorkflowTemplate>>('/api/workflows/templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow template:', error);
      return {
        success: false,
        error: 'Failed to create workflow template',
        data: {} as WorkflowTemplate
      };
    }
  },

  /**
   * Update an existing workflow template
   */
  updateTemplate: async (
    templateId: string,
    templateData: Partial<CreateWorkflowTemplateRequest>
  ): Promise<ApiResponse<WorkflowTemplate>> => {
    try {
      const response = await apiClient.put<ApiResponse<WorkflowTemplate>>(`/api/workflows/templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating workflow template ${templateId}:`, error);
      return {
        success: false,
        error: `Failed to update workflow template ${templateId}`,
        data: {} as WorkflowTemplate
      };
    }
  },

  /**
   * Delete a workflow template
   */
  deleteTemplate: async (templateId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    try {
      const response = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/api/workflows/templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting workflow template ${templateId}:`, error);
      return {
        success: false,
        error: `Failed to delete workflow template ${templateId}`,
        data: { deleted: false }
      };
    }
  },

  /**
   * Execute a workflow template
   */
  executeTemplate: async (templateId: string, executionData: any): Promise<ApiResponse<{ executionId: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<{ executionId: string }>>(
        `/api/workflows/templates/${templateId}/execute`,
        executionData
      );
      return response.data;
    } catch (error) {
      console.error(`Error executing workflow template ${templateId}:`, error);
      return {
        success: false,
        error: `Failed to execute workflow template ${templateId}`,
        data: { executionId: '' }
      };
    }
  },

  /**
   * Get workflow executions for a template
   */
  getTemplateExecutions: async (
    templateId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<any[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<any[]>>(`/api/workflows/templates/${templateId}/executions`, {
        params: options
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching executions for template ${templateId}:`, error);
      return {
        success: false,
        error: `Failed to fetch executions for template ${templateId}`,
        data: []
      };
    }
  },

  /**
   * Get workflow execution by ID
   */
  getExecutionById: async (executionId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get<ApiResponse<any>>(`/api/workflows/executions/${executionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow execution ${executionId}:`, error);
      return {
        success: false,
        error: `Failed to fetch workflow execution ${executionId}`,
        data: {}
      };
    }
  },

  /**
   * Cancel a workflow execution
   */
  cancelExecution: async (executionId: string): Promise<ApiResponse<{ cancelled: boolean }>> => {
    try {
      const response = await apiClient.post<ApiResponse<{ cancelled: boolean }>>(`/api/workflows/executions/${executionId}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling workflow execution ${executionId}:`, error);
      return {
        success: false,
        error: `Failed to cancel workflow execution ${executionId}`,
        data: { cancelled: false }
      };
    }
  }
};

export default workflowApi;