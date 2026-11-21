import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service';
import { ApiResponse, HttpStatusCode } from '../types/http.types';

/**
 * AuditController handles all audit log related endpoints
 */
export class AuditController {
  private auditService: AuditService;

  constructor() {
    // Note: Will be properly instantiated with dependency injection
    this.auditService = new AuditService();
  }

  /**
   * GET /api/audit-logs
   * Retrieve audit logs with optional filtering
   */
  public getAuditLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        page = '1',
        limit = '10',
        actionType,
        userId,
        startDate,
        endDate,
        entityType,
        entityId,
      } = req.query;

      const queryParams = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        actionType: actionType as string | undefined,
        userId: userId as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        entityType: entityType as string | undefined,
        entityId: entityId as string | undefined,
      };

      const result = await this.auditService.getAuditLogs(queryParams);

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.OK,
        message: 'Audit logs retrieved successfully',
        data: result.logs,
        meta: {
          total: result.total,
          page: queryParams.page,
          limit: queryParams.limit,
          totalPages: Math.ceil(result.total / queryParams.limit),
        },
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/audit-logs/:id
   * Retrieve a specific audit log by ID
   */
  public getAuditLogById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const auditLog = await this.auditService.getAuditLogById(id);

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.OK,
        message: 'Audit log retrieved successfully',
        data: auditLog,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/audit-logs
   * Create a new audit log entry (primarily for internal use)
   */
  public createAuditLog = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const auditLogData = req.body;
      const userId = req.user?.id || 'system';

      const auditLog = await this.auditService.createAuditLog({
        ...auditLogData,
        performedBy: userId,
      });

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.CREATED,
        message: 'Audit log created successfully',
        data: auditLog,
      };

      res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/audit-logs/export
   * Export audit logs to CSV or PDF (admin only)
   */
  public exportAuditLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { format = 'csv' } = req.query;
      const {
        actionType,
        userId,
        startDate,
        endDate,
        entityType,
      } = req.query;

      const queryParams = {
        actionType: actionType as string | undefined,
        userId: userId as string | undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        entityType: entityType as string | undefined,
      };

      const exportData = await this.auditService.exportAuditLogs(
        queryParams,
        format as string
      );

      // Set appropriate headers based on format
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=audit-logs.csv'
        );
        res.status(HttpStatusCode.OK).send(exportData);
      } else if (format === 'pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=audit-logs.pdf'
        );
        res.status(HttpStatusCode.OK).send(exportData);
      } else {
        const response: ApiResponse = {
          success: false,
          statusCode: HttpStatusCode.BAD_REQUEST,
          message: `Unsupported export format: ${format}`,
        };
        res.status(HttpStatusCode.BAD_REQUEST).json(response);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/audit-logs/stats/daily
   * Get daily audit log statistics (for dashboard)
   */
  public getDailyStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { days = '7' } = req.query;
      const daysCount = parseInt(days as string, 10);

      const stats = await this.auditService.getDailyStats(daysCount);

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.OK,
        message: 'Daily audit statistics retrieved successfully',
        data: stats,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/audit-logs/stats/by-action
   * Get audit log statistics grouped by action type
   */
  public getStatsByAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      const queryParams = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const stats = await this.auditService.getStatsByAction(queryParams);

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.OK,
        message: 'Audit statistics by action retrieved successfully',
        data: stats,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/audit-logs/cleanup
   * Clean up old audit logs (admin only)
   */
  public cleanupOldLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { olderThanDays = '90' } = req.query;
      const days = parseInt(olderThanDays as string, 10);

      const cleanupResult = await this.auditService.cleanupOldLogs(days);

      const response: ApiResponse = {
        success: true,
        statusCode: HttpStatusCode.OK,
        message: `Cleaned up ${cleanupResult.deletedCount} audit logs older than ${days} days`,
        data: cleanupResult,
      };

      res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}

export default AuditController;