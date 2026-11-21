import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const db = prisma;

export { prisma, db };
export default prisma;