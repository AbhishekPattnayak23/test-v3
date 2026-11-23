/**
 * ApprovalRequest model
 * Represents an approval request in the Solmar Workflow Automation Platform
 */

export interface ApprovalRequest {
  id: string;
  assignmentId: string;
  requesterId: string;
  approverId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApprovalRequestData {
  assignmentId: string;
  requesterId: string;
  approverId: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
}

export interface UpdateApprovalRequestData {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
}

export interface ApprovalRequestWithRelations extends ApprovalRequest {
  assignment: {
    id: string;
    title: string;
    description?: string;
  };
  requester: {
    id: string;
    email: string;
    username: string;
  };
  approver: {
    id: string;
    email: string;
    username: string;
  };
}

/**
 * Validates approval request status transitions
 * @param currentStatus Current status
 * @param newStatus New status to transition to
 * @returns boolean indicating if transition is valid
 */
export function isValidStatusTransition(
  currentStatus: ApprovalRequest['status'],
  newStatus: ApprovalRequest['status']
): boolean {
  const validTransitions: Record<ApprovalRequest['status'], ApprovalRequest['status'][]> = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: [],
  };

  return validTransitions[currentStatus].includes(newStatus);
}

/**
 * Gets the next allowed statuses for an approval request
 * @param currentStatus Current approval request status
 * @returns Array of allowed next statuses
 */
export function getAllowedNextStatuses(
  currentStatus: ApprovalRequest['status']
): ApprovalRequest['status'][] {
  const validTransitions: Record<ApprovalRequest['status'], ApprovalRequest['status'][]> = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: [],
    REJECTED: [],
  };

  return validTransitions[currentStatus];
}