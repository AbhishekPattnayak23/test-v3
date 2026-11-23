/**
 * Assignment Repository
 * Manages data access for Assignment entities using Prisma ORM
 */

import { PrismaClient, Assignment as PrismaAssignment, AssignmentStatus } from '@prisma/client';
import { CreateAssignmentData, UpdateAssignmentData } from '../models/assignment';

const prisma = new PrismaClient();

/**
 * Repository for Assignment entity CRUD operations
 */
export class AssignmentRepository {
  /**
   * Create a new assignment
   * @param assignmentData The assignment data to create
   * @returns The created assignment
   */
  async create(assignmentData: CreateAssignmentData): Promise<PrismaAssignment> {
    return prisma.assignment.create({
      data: {
        ...assignmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Find an assignment by its ID
   * @param id The assignment ID to find
   * @returns The assignment if found, null otherwise
   */
  async findById(id: string): Promise<PrismaAssignment | null> {
    return prisma.assignment.findUnique({
      where: { id },
    });
  }

  /**
   * Find assignments by assignee ID
   * @param assigneeId The ID of the user assigned to the assignment
   * @returns List of assignments for the given assignee
   */
  async findByAssignee(assigneeId: string): Promise<PrismaAssignment[]> {
    return prisma.assignment.findMany({
      where: { assigneeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find assignments by creator ID
   * @param creatorId The ID of the user who created the assignment
   * @returns List of assignments created by the given user
   */
  async findByCreator(creatorId: string): Promise<PrismaAssignment[]> {
    return prisma.assignment.findMany({
      where: { creatorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find assignments by status
   * @param status The assignment status to filter by
   * @returns List of assignments with the given status
   */
  async findByStatus(status: AssignmentStatus): Promise<PrismaAssignment[]> {
    return prisma.assignment.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find all assignments with pagination
   * @param page Page number (1-indexed)
   * @param limit Number of items per page
   * @returns Paginated list of assignments
   */
  async findAll(page: number = 1, limit: number = 20): Promise<{ assignments: PrismaAssignment[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [assignments, total] = await Promise.all([
      prisma.assignment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.assignment.count(),
    ]);

    return { assignments, total };
  }

  /**
   * Update an assignment
   * @param id The ID of the assignment to update
   * @param updateData The data to update
   * @returns The updated assignment
   */
  async update(id: string, updateData: UpdateAssignmentData): Promise<PrismaAssignment> {
    return prisma.assignment.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete an assignment
   * @param id The ID of the assignment to delete
   * @returns The deleted assignment
   */
  async delete(id: string): Promise<PrismaAssignment> {
    return prisma.assignment.delete({
      where: { id },
    });
  }

  /**
   * Check if an assignment exists
   * @param id The assignment ID to check
   * @returns boolean indicating if the assignment exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.assignment.count({
      where: { id },
    });
    return count > 0;
  }
}

export default AssignmentRepository;