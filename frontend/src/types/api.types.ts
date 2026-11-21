// API Type Definitions for the Solmar Application

// Common Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  VIEWER = 'VIEWER'
}

// Business Rule Types
export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  ruleExpression: string;
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRuleEvaluationRequest {
  ruleId: string;
  testData: Record<string, any>;
}

export interface BusinessRuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  result: boolean;
  evaluatedAt: string;
  details?: Record<string, any>;
}

// Workflow Types
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'APPROVAL' | 'AUTOMATED' | 'NOTIFICATION' | 'MANUAL';
  assignedRole?: UserRole;
  automatedToolId?: string;
  nextStepIds: string[];
  isInitialStep: boolean;
}

export interface CreateWorkflowTemplateRequest {
  name: string;
  description: string;
  steps: Omit<WorkflowStep, 'id'>[];
}

// Assignment Types
export interface Assignment {
  id: string;
  requestId: string;
  requestTitle: string;
  workflowStepId: string;
  assignedToUserId: string;
  assignedToUser?: User;
  status: AssignmentStatus;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AssignmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

// Approval Types
export interface PendingApproval {
  id: string;
  requestId: string;
  requestTitle: string;
  workflowStepId: string;
  assignedToUserId: string;
  assignedToUser?: User;
  dueDate: string;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PendingApprovalResponse {
  items: PendingApproval[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApprovalDecisionRequest {
  decision: 'APPROVE' | 'REJECT';
  comments?: string;
}

export interface ApprovalDecisionResponse {
  success: boolean;
  message: string;
  nextStepId?: string;
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  user?: User;
  actionType: AuditAction;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  EXECUTE = 'EXECUTE'
}

// KPI Metrics Types
export interface KPIMetrics {
  totalRequests: number;
  totalAssignments: number;
  pendingApprovals: number;
  completedAssignments: number;
  overdueAssignments: number;
  averageCompletionTime: number;
  userActivity: Record<string, number>;
  dailyStats: Array<{
    date: string;
    requests: number;
    completions: number;
  }>;
}

// Request Types
export interface Request {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requester?: User;
  workflowTemplateId: string;
  workflowTemplate?: WorkflowTemplate;
  currentStepId?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export default {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  UserRole,
  BusinessRule,
  BusinessRuleEvaluationRequest,
  BusinessRuleEvaluationResult,
  WorkflowTemplate,
  WorkflowStep,
  CreateWorkflowTemplateRequest,
  Assignment,
  AssignmentStatus,
  PendingApproval,
  PendingApprovalResponse,
  ApprovalDecisionRequest,
  ApprovalDecisionResponse,
  ApprovalStatus,
  AuditLog,
  AuditAction,
  KPIMetrics,
  Request
};