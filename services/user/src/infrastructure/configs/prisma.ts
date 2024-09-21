import { Prisma } from '@prisma/client';

const getPrismaClientOptions = (
  isProduction: boolean,
): Prisma.PrismaClientOptions =>
  isProduction
    ? {
        log: ['info', 'error'],
        errorFormat: 'minimal',
        transactionOptions: {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      }
    : {
        log: ['query', 'info', 'warn', 'error'],
        errorFormat: 'pretty',
        transactionOptions: {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        },
      };

export default getPrismaClientOptions;
