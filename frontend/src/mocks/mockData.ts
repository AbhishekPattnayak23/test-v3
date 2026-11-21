/**
 * Mock data store for development and testing before backend integration
 * Provides realistic entities for prototyping without API dependencies
 */

// User Roles
export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';

// User entity
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Workflow Template entity
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  version: number;
  steps: WorkflowStep[];
  estimatedDuration: number; // in minutes
  requiresApproval: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  toolId: string;
  toolName: string;
  order: number;
  expectedDuration: number; // in minutes
  requiredInputs: Record<string, any>;
}

// Assignment entity
export type AssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'BLOCKED';

export interface Assignment {
  id: string;
  assignmentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  workflowTemplateId: string;
  workflowTemplateName: string;
  requestId: string;
  requestTitle: string;
  dueDate: string;
  status: AssignmentStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedTime: number; // in minutes
  actualTime?: number; // in minutes
  completedAt?: string;
  createdAt: string;
}

// Approval entity
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Approval {
  id: string;
  approvalId: string;
  requestId: string;
  requestTitle: string;
  assignedTo: string;
  assignedToName: string;
  status: ApprovalStatus;
  comments?: string;
  decidedAt?: string;
  createdAt: string;
}

// Audit Log entity
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXECUTE';

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: AuditAction;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress?: string;
}

// KPI metrics
export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit: string;
  changePercentage?: number;
  trend: 'up' | 'down' | 'stable';
  targetValue?: number;
}

// Mock data generation
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin_user',
    email: 'admin@solmar.com',
    firstName: 'John',
    lastName: 'Admin',
    role: 'ADMIN',
    department: 'IT Operations',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLoginAt: '2024-03-25T14:22:00Z'
  },
  {
    id: '2',
    username: 'manager_user',
    email: 'manager@solmar.com',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'MANAGER',
    department: 'Human Resources',
    isActive: true,
    createdAt: '2024-02-10T09:15:00Z',
    lastLoginAt: '2024-03-24T16:45:00Z'
  },
  {
    id: '3',
    username: 'regular_user',
    email: 'user@solmar.com',
    firstName: 'Mike',
    lastName: 'User',
    role: 'USER',
    department: 'Sales',
    isActive: true,
    createdAt: '2024-03-01T11:20:00Z',
    lastLoginAt: '2024-03-25T09:10:00Z'
  },
  {
    id: '4',
    username: 'inactive_user',
    email: 'inactive@solmar.com',
    firstName: 'Jane',
    lastName: 'Inactive',
    role: 'USER',
    department: 'Marketing',
    isActive: false,
    createdAt: '2024-01-20T14:00:00Z',
    lastLoginAt: '2024-02-15T10:30:00Z'
  }
];

export const mockWorkflowTemplates: WorkflowTemplate[] = [
  {
    id: '1',
    name: 'Employee Onboarding',
    description: 'Complete workflow for onboarding new employees',
    category: 'HR',
    version: 2,
    steps: [
      {
        id: '1-1',
        name: 'Account Provisioning',
        description: 'Create user accounts in required systems',
        toolId: 'tool-account-provisioner',
        toolName: 'Account Provisioner',
        order: 1,
        expectedDuration: 15,
        requiredInputs: { systems: ['email', 'vpn', 'hr_portal'] }
      },
      {
        id: '1-2',
        name: 'Equipment Setup',
        description: 'Configure and ship hardware equipment',
        toolId: 'tool-equipment-manager',
        toolName: 'Equipment Manager',
        order: 2,
        expectedDuration: 30,
        requiredInputs: { equipmentType: 'standard' }
      }
    ],
    estimatedDuration: 120,
    requiresApproval: true,
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    createdBy: '1'
  },
  {
    id: '2',
    name: 'Invoice Processing',
    description: 'Automated invoice processing and approval',
    category: 'Finance',
    version: 3,
    steps: [
      {
        id: '2-1',
        name: 'Invoice Validation',
        description: 'Validate invoice data and format',
        toolId: 'tool-invoice-validator',
        toolName: 'Invoice Validator',
        order: 1,
        expectedDuration: 10,
        requiredInputs: { maxAmount: 10000 }
      },
      {
        id: '2-2',
        name: 'Approval Routing',
        description: 'Route invoice for manager approval',
        toolId: 'tool-approval-router',
        toolName: 'Approval Router',
        order: 2,
        expectedDuration: 5,
        requiredInputs: { approvalLevel: 'department_head' }
      }
    ],
    estimatedDuration: 45,
    requiresApproval: true,
    isActive: true,
    createdAt: '2024-02-15T09:30:00Z',
    createdBy: '2'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    assignmentId: 'ASG-001',
    userId: '3',
    userName: 'Mike User',
    userEmail: 'user@solmar.com',
    workflowTemplateId: '1',
    workflowTemplateName: 'Employee Onboarding',
    requestId: 'REQ-001',
    requestTitle: 'Onboard new marketing employee',
    dueDate: '2024-03-30T17:00:00Z',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    estimatedTime: 120,
    actualTime: 30,
    createdAt: '2024-03-25T10:00:00Z'
  },
  {
    id: '2',
    assignmentId: 'ASG-002',
    userId: '3',
    userName: 'Mike User',
    userEmail: 'user@solmar.com',
    workflowTemplateId: '2',
    workflowTemplateName: 'Invoice Processing',
    requestId: 'REQ-002',
    requestTitle: 'Process vendor invoice',
    dueDate: '2024-03-26T12:00:00Z',
    status: 'PENDING',
    priority: 'MEDIUM',
    estimatedTime: 45,
    createdAt: '2024-03-25T09:15:00Z'
  },
  {
    id: '3',
    assignmentId: 'ASG-003',
    userId: '2',
    userName: 'Sarah Manager',
    userEmail: 'manager@solmar.com',
    workflowTemplateId: '1',
    workflowTemplateName: 'Employee Onboarding',
    requestId: 'REQ-003',
    requestTitle: 'Onboard new sales director',
    dueDate: '2024-03-28T10:00:00Z',
    status: 'PENDING',
    priority: 'URGENT',
    estimatedTime: 120,
    createdAt: '2024-03-25T14:30:00Z'
  },
  {
    id: '4',
    assignmentId: 'ASG-004',
    userId: '3',
    userName: 'Mike User',
    userEmail: 'user@solmar.com',
    workflowTemplateId: '2',
    workflowTemplateName: 'Invoice Processing',
    requestId: 'REQ-004',
    requestTitle: 'Monthly subscription payment',
    dueDate: '2024-03-31T15:00:00Z',
    status: 'COMPLETED',
    priority: 'LOW',
    estimatedTime: 45,
    actualTime: 35,
    completedAt: '2024-03-24T16:45:00Z',
    createdAt: '2024-03-24T10:00:00Z'
  }
];

export const mockApprovals: Approval[] = [
  {
    id: '1',
    approvalId: 'APV-001',
    requestId: 'REQ-001',
    requestTitle: 'Onboard new marketing employee',
    assignedTo: '2',
    assignedToName: 'Sarah Manager',
    status: 'PENDING',
    createdAt: '2024-03-25T10:00:00Z'
  },
  {
    id: '2',
    approvalId: 'APV-002',
    requestId: 'REQ-002',
    requestTitle: 'Process vendor invoice',
    assignedTo: '1',
    assignedToName: 'John Admin',
    status: 'APPROVED',
    comments: 'Approved with minor clarifications',
    decidedAt: '2024-03-25T11:30:00Z',
    createdAt: '2024-03-25T09:15:00Z'
  },
  {
    id: '3',
    approvalId: 'APV-003',
    requestId: 'REQ-003',
    requestTitle: 'Onboard new sales director',
    assignedTo: '1',
    assignedToName: 'John Admin',
    status: 'REJECTED',
    comments: 'Budget not approved for this role',
    decidedAt: '2024-03-25T15:45:00Z',
    createdAt: '2024-03-25T14:30:00Z'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2024-03-25T14:22:00Z',
    userId: '1',
    userName: 'John Admin',
    userRole: 'ADMIN',
    action: 'LOGIN',
    entityType: 'USER',
    entityId: '1',
    details: { loginMethod: 'password' },
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-03-25T10:00:00Z',
    userId: '3',
    userName: 'Mike User',
    userRole: 'USER',
    action: 'CREATE',
    entityType: 'ASSIGNMENT',
    entityId: 'ASG-001',
    details: { workflowTemplate: 'Employee Onboarding' },
    ipAddress: '192.168.1.150'
  },
  {
    id: '3',
    timestamp: '2024-03-25T11:30:00Z',
    userId: '1',
    userName: 'John Admin',
    userRole: 'ADMIN',
    action: 'APPROVE',
    entityType: 'APPROVAL',
    entityId: 'APV-002',
    details: { requestId: 'REQ-002', comments: 'Approved with minor clarifications' },
    ipAddress: '192.168.1.100'
  }
];

export const mockKPIMetrics: KPIMetric[] = [
  {
    id: '1',
    name: 'Active Assignments',
    value: 42,
    previousValue: 38,
    unit: '',
    changePercentage: 10.5,
    trend: 'up',
    targetValue: 35
  },
  {
    id: '2',
    name: 'Completed This Week',
    value: 28,
    previousValue: 24,
    unit: '',
    changePercentage: 16.7,
    trend: 'up',
    targetValue: 30
  },
  {
    id: '3',
    name: 'Avg. Time to Complete',
    value: 3.2,
    previousValue: 3.8,
    unit: 'hours',
    changePercentage: -15.8,
    trend: 'down',
    targetValue: 3.0
  },
  {
    id: '4',
    name: 'Approval Rate',
    value: 85,
    previousValue: 82,
    unit: '%',
    changePercentage: 3.7,
    trend: 'up',
    targetValue: 90
  }
];

// Helper functions for mock data operations
export const mockDataStore = {
  // Get current user (simulating authenticated user)
  getCurrentUser: (): User => mockUsers[2], // Return 'Mike User' as default current user
  
  // Get assignments for a specific user
  getUserAssignments: (userId: string): Assignment[] => {
    return mockAssignments.filter(assignment => assignment.userId === userId);
  },
  
  // Get pending approvals for a user
  getPendingApprovals: (userId: string): Approval[] => {
    return mockApprovals.filter(
      approval => approval.assignedTo === userId && approval.status === 'PENDING'
    );
  },
  
  // Get workflow templates by category
  getWorkflowTemplatesByCategory: (category?: string): WorkflowTemplate[] => {
    if (!category) return mockWorkflowTemplates;
    return mockWorkflowTemplates.filter(template => template.category === category);
  },
  
  // Get KPI metrics
  getKPIMetrics: (): KPIMetric[] => mockKPIMetrics,
  
  // Get audit logs with pagination
  getAuditLogs: (page: number = 1, limit: number = 10): AuditLog[] => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return mockAuditLogs.slice(start, end);
  },
  
  // Update assignment status
  updateAssignmentStatus: (assignmentId: string, status: AssignmentStatus): Assignment | null => {
    const assignment = mockAssignments.find(a => a.assignmentId === assignmentId);
    if (assignment) {
      assignment.status = status;
      if (status === 'COMPLETED') {
        assignment.completedAt = new Date().toISOString();
      }
      return assignment;
    }
    return null;
  },
  
  // Decide on approval
  decideApproval: (approvalId: string, status: ApprovalStatus, comments?: string): Approval | null => {
    const approval = mockApprovals.find(a => a.approvalId === approvalId);
    if (approval) {
      approval.status = status;
      approval.comments = comments;
      approval.decidedAt = new Date().toISOString();
      return approval;
    }
    return null;
  }
};

export default mockDataStore;