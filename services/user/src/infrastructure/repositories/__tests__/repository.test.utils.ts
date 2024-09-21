import { jest } from '@jest/globals';
import type { Prisma, PrismaClient } from '@prisma/client';

export const createPrismaClientMock = (): jest.Mocked<PrismaClient> =>
  ({
    $transaction: jest.fn<PrismaClient['$transaction']>(),
    user: {
      findFirst: jest.fn<Prisma.UserDelegate['findFirst']>(),
      findMany: jest.fn<Prisma.UserDelegate['findMany']>(),
      create: jest.fn<Prisma.UserDelegate['create']>(),
      count: jest.fn<Prisma.UserDelegate['count']>(),
      update: jest.fn<Prisma.UserDelegate['update']>(),
      delete: jest.fn<Prisma.UserDelegate['delete']>(),
    },
  }) as unknown as jest.Mocked<PrismaClient>;
