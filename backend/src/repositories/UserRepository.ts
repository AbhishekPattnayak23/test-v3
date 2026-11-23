/**
 * User Repository
 * Manages data access for User entities using Prisma ORM
 */

import { PrismaClient, User as PrismaUser, UserRole } from '@prisma/client';
import { CreateUserData, UpdateUserData, PublicUserProfile } from '../models/user';

const prisma = new PrismaClient();

/**
 * Repository for User entity CRUD operations
 */
export class UserRepository {
  /**
   * Create a new user
   * @param userData The user data to create
   * @returns The created user
   */
  async create(userData: CreateUserData): Promise<PrismaUser> {
    return prisma.user.create({
      data: {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Find a user by ID
   * @param id The user ID to find
   * @returns The user if found, null otherwise
   */
  async findById(id: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by email
   * @param email The email to search for
   * @returns The user if found, null otherwise
   */
  async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find users by role
   * @param role The user role to filter by
   * @returns List of users with the given role
   */
  async findByRole(role: UserRole): Promise<PrismaUser[]> {
    return prisma.user.findMany({
      where: { role },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find all users with pagination
   * @param page Page number (1-indexed)
   * @param limit Number of items per page
   * @returns Paginated list of users
   */
  async findAll(page: number = 1, limit: number = 20): Promise<{ users: PrismaUser[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }

  /**
   * Update a user
   * @param id The ID of the user to update
   * @param updateData The data to update
   * @returns The updated user
   */
  async update(id: string, updateData: UpdateUserData): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete a user (soft delete by setting active to false)
   * @param id The ID of the user to delete
   * @returns The updated user
   */
  async delete(id: string): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id },
      data: {
        active: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get public user profile
   * @param id The user ID
   * @returns Public user profile without sensitive data
   */
  async getPublicProfile(id: string): Promise<PublicUserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  /**
   * Check if a user exists
   * @param id The user ID to check
   * @returns boolean indicating if the user exists
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });
    return count > 0;
  }

  /**
   * Check if email is already registered
   * @param email The email to check
   * @returns boolean indicating if the email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}

export default UserRepository;