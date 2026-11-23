/**
 * Assignment model
 * Represents an assignment in the Solmar Workflow Automation Platform
 */

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdById: string;
  assignedToId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentData {
  title: string;
  description?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdById: string;
  assignedToId?: string;
  dueDate?: Date;
}

export interface UpdateAssignmentData {
  title?: string;
  description?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedToId?: string;
  dueDate?: Date;
}

export interface AssignmentWithRelations extends Assignment {
  createdBy: {
    id: string;
    email: string;
    username: string;
  };
  assignedTo?: {
    id: string;
    email: string;
    username: string;
  };
  approvalRequests?: {
    id: string;
    status: string;
    approverId: string;
  }[];
}

/**
 * Validates assignment status transitions based on workflow rules
 * @param currentStatus Current status
 * @param newStatus New status to transition to
 * @returns boolean indicating if transition is valid
 */
export function isValidAssignmentStatusTransition(
  currentStatus: Assignment['status'],
  newStatus: Assignment['status']
): boolean {
  const validTransitions: Record<Assignment['status'], Assignment['status'][]> = {
    DRAFT: ['SUBMITTED', 'IN_REVIEW'],
    SUBMITTED: ['IN_REVIEW', 'REJECTED'],
    IN_REVIEW: ['APPROVED', 'REJECTED', 'SUBMITTED'],
    APPROVED: ['COMPLETED', 'IN_REVIEW'],
    REJECTED: ['DRAFT', 'IN_REVIEW'],
    COMPLETED: [],
  };

  return validTransitions[currentStatus].includes(newStatus);
}

/**
 * Gets the next allowed statuses for an assignment
 * @param currentStatus Current assignment status
 * @returns Array of allowed next statuses
 */
export function getAllowedNextStatuses(
  currentStatus: Assignment['status']
): Assignment['status'][] {
  const validTransitions: Record<Assignment['status'], Assignment['status'][]> = {
    DRAFT: ['SUBMITTED', 'IN_REVIEW'],
    SUBMITTED: ['IN_REVIEW', 'REJECTED'],
    IN_REVIEW: ['APPROVED', 'REJECTED', 'SUBMITTED'],
    APPROVED: ['COMPLETED', 'IN_REVIEW'],
    REJECTED: ['DRAFT', 'IN_REVIEW'],
    COMPLETED: [],
  };

  return validTransitions[currentStatus];
}