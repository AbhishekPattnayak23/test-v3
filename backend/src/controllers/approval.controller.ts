import { Request, Response } from 'express';
import { ApprovalService } from '../services/approval.service';
import { HttpStatusCode } from '../types/http.types';

export class ApprovalController {
  private approvalService: ApprovalService;

  constructor() {
    this.approvalService = new ApprovalService();
  }

  /**
   * Get pending approvals for the current user
   * GET /api/approvals/pending
   */
  async getPendingApprovals(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Implement based on user authentication
      const userId = req.user?.id || 'temp-user-id';
      const approvals = await this.approvalService.getPendingApprovals(userId);
      res.status(HttpStatusCode.OK).json({
        success: true,
        data: approvals,
        message: 'Pending approvals retrieved successfully'
      });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to retrieve pending approvals'
      });
    }
  }

  /**
   * Decide on an approval request
   * POST /api/approvals/{id}/decide
   */
  async decideApproval(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { decision, comments } = req.body;
      const userId = req.user?.id || 'temp-user-id';

      if (!decision || !['approved', 'rejected'].includes(decision)) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          success: false,
          message: 'Decision must be either "approved" or "rejected"'
        });
        return;
      }

      const result = await this.approvalService.decideApproval(
        id,
        userId,
        decision,
        comments
      );
      res.status(HttpStatusCode.OK).json({
        success: true,
        data: result,
        message: `Approval ${decision} successfully`
      });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to process approval decision'
      });
    }
  }

  /**
   * Get approval history for a workflow request
   * GET /api/approvals/history/:requestId
   */
  async getApprovalHistory(req: Request, res: Response): Promise<void> {
    try {
      const { requestId } = req.params;
      const history = await this.approvalService.getApprovalHistory(requestId);
      res.status(HttpStatusCode.OK).json({
        success: true,
        data: history,
        message: 'Approval history retrieved successfully'
      });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Failed to retrieve approval history'
      });
    }
  }
}