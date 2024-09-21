import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { Prisma, PrismaClient } from '@prisma/client';
import getPrismaClientOptions from 'src/infrastructure/configs/prisma';

export interface IPrismaPluginOptions {
  isProduction: boolean;
}

export const addNullDeletedAtToWhere = (
  params: Prisma.MiddlewareParams,
): void => {
  if (params.args.where) {
    params.args.where.deletedAt = null;
  } else {
    params.args.where = { deletedAt: null } as Prisma.UserUpdateInput;
  }
};

/**
 * Soft delete - means that a record is marked as `deleted` by changing a field like
 * `deleted` to `true` rather than actually being removed from the database.
 *
 * Reasons to use a soft delete include:
 * - Regulatory requirements that mean you have to keep data for a certain amount of time
 * - 'Trash' / 'bin' functionality that allows users to restore content that was deleted
 */
export const softDeleteMiddleware: Prisma.Middleware = async (
  params,
  next,
): Promise<void> => {
  if (params.model !== 'User') {
    return next(params);
  }

  switch (params.action) {
    case 'delete':
      params.action = 'update';
      params.args.data = { deletedAt: new Date() } as Prisma.UserUpdateInput;
      break;
    case 'deleteMany':
      params.action = 'updateMany';
      params.args.data = { deletedAt: new Date() } as Prisma.UserUpdateInput;
      break;
    case 'findUnique':
    case 'findFirst':
      // Change to `findFirst`, you cannot filter by anything except ID / unique with `findUnique()`
      params.action = 'findFirst';
      params.args.where.deletedAt = null;
      break;
    case 'findFirstOrThrow':
    case 'findUniqueOrThrow':
    case 'updateMany':
    case 'findMany':
    case 'groupBy':
    case 'upsert':
      addNullDeletedAtToWhere(params);
      break;
    case 'count':
    case 'aggregate':
      params.args.where.deletedAt = null;
      break;
    case 'update':
      params.action = 'updateMany';
      params.args.where.deletedAt = null;
      break;
  }

  return next(params);
};

/**
 * Allows us to send queries to our database.\
 * Application should have only one PrismaClient instance.\
 * Because each PrismaClient instance manages a connection pool.\
 * A large number of clients can exhaust the database connection limit.
 *
 * NOTE:
 * - Each client creates its own instance of the `query engine`.
 * - Each `query engine` creates a `connection pool` with
 *   a default pool size of: `num_physical_cpus * 2 + 1` for relational databases
 */
const prismaPluginAsync: FastifyPluginAsync<IPrismaPluginOptions> = async (
  server,
  { isProduction },
): Promise<void> => {
  const prismaClientOptions = getPrismaClientOptions(isProduction);
  const prisma = new PrismaClient(prismaClientOptions);

  prisma.$use(softDeleteMiddleware);

  server.log.info('Connecting to the database...');
  await prisma.$connect();
  server.log.info('Connected to the database.');

  // Make Prisma Client available through the fastify server instance: `server.prisma`
  server.decorate('prisma', prisma);

  server.addHook('onClose', async (service): Promise<void> => {
    service.log.info('Disconnecting from the database...');
    await service.prisma.$disconnect();
    service.log.info('Disconnected from the database.');
  });
};

export default fastifyPlugin(prismaPluginAsync);
