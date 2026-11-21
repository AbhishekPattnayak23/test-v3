import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from '../services/assignment.service';
import { ApiResponse } from '../types/http.types';

/**
 * Controller for handling assignment-related API requests
 * @implements CRUD operations for assignments
 */
export class AssignmentController {
  private assignmentService: AssignmentService;

  constructor() {
    this.assignmentService = new AssignmentService();
  }

  /**
   * Get all assignments with optional filtering
   * @route GET /api/assignments
   * @access Private (Requires authentication)
   */
  public getAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, userId, workflowId, page, limit } = req.query;
      const assignments = await this.assignmentService.getAssignments({
        status: status as string,
        userId: userId as string,
        workflowId: workflowId as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Assignments retrieved successfully',
        data: assignments,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get a specific assignment by ID
   * @route GET /api/assignments/:id
   * @access Private (Requires authentication and ownership)
   */
  public getAssignmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.getAssignmentById(id);

      const response: ApiResponse = {
        success: true,
        message: 'Assignment retrieved successfully',
        data: assignment,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update assignment status or details
   * @route PUT /api/assignments/:id
   * @access Private (Requires authentication and ownership)
   */
  public updateAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const assignment = await this.assignmentService.updateAssignment(id, updateData);

      const response: ApiResponse = {
        success: true,
        message: 'Assignment updated successfully',
        data: assignment,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mark an assignment as completed
   * @route PUT /api/assignments/:id/complete
   * @access Private (Requires authentication and ownership)
   */
  public completeAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { completedAt, notes } = req.body;
      const assignment = await this.assignmentService.completeAssignment(id, { completedAt, notes });

      const response: ApiResponse = {
        success: true,
        message: 'Assignment marked as completed',
        data: assignment,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new assignment
   * @route POST /api/assignments
   * @access Private (Requires authentication and appropriate permissions)
   */
  public createAssignment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignmentData = req.body;
      const assignment = await this.assignmentService.createAssignment(assignmentData);

      const response: ApiResponse = {
        success: true,
        message: 'Assignment created successfully',
        data: assignment,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get assignments for the authenticated user
   * @route GET /api/assignments/me
   * @access Private (Requires authentication)
   */
  public getMyAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // In a real implementation, userId would come from authentication middleware
      const userId = (req as any).user?.id || 'user123'; // Placeholder
      const { status, page, limit } = req.query;
      
      const assignments = await this.assignmentService.getAssignmentsByUserId(userId, {
        status: status as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });

      const response: ApiResponse = {
        success: true,
        message: 'User assignments retrieved successfully',
        data: assignments,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get assignment statistics
   * @route GET /api/assignments/stats
   * @access Private (Requires authentication and admin permissions)
   */
  public getAssignmentStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      const stats = await this.assignmentService.getAssignmentStats({
        startDate: startDate as string,
        endDate: endDate as string,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Assignment statistics retrieved successfully',
        data: stats,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Export assignments to CSV
   * @route GET /api/assignments/export
   * @access Private (Requires authentication and admin permissions)
   */
  public exportAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { format, startDate, endDate } = req.query;
      const exportData = await this.assignmentService.exportAssignments({
        format: (format as 'csv' | 'json' | 'excel') || 'csv',
        startDate: startDate as string,
        endDate: endDate as string,
      });

      const response: ApiResponse = {
        success: true,
        message: 'Assignments exported successfully',
        data: exportData,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default AssignmentController;