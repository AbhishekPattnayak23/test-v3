/**
 * User model
 * Represents a user in the Solmar Workflow Automation Platform
 */

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'USER';
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  password?: string;
  role?: 'ADMIN' | 'MANAGER' | 'USER';
  isActive?: boolean;
}

export interface UserWithRelations extends User {
  assignments?: {
    id: string;
    title: string;
    status: string;
  }[];
  approvalRequests?: {
    id: string;
    status: string;
    assignmentId: string;
  }[];
}

/**
 * Validates user role hierarchy
 * @param userRole Current user role
 * @param targetRole Target role to check against
 * @returns boolean indicating if user has permission for target role operations
 */
export function hasRolePermission(
  userRole: User['role'],
  targetRole: User['role']
): boolean {
  const roleHierarchy: Record<User['role'], number> = {
    ADMIN: 3,
    MANAGER: 2,
    USER: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[targetRole];
}