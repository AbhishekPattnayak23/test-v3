import { PrismaClient } from '@prisma/client';

/**
 * PrismaClient singleton to maintain a single database connection
 * throughout the application lifecycle.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Database connection manager providing a singleton PrismaClient instance.
 */
export const db = prisma;