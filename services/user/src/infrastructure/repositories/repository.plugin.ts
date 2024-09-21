import type { FastifyPluginAsync } from 'fastify';
import type { PrismaClient } from '@prisma/client';
import { fastifyPlugin } from 'fastify-plugin';
import UserRepository from 'src/infrastructure/repositories/user.repository';

export interface IRepositoryPluginOptions {
  prisma: PrismaClient;
}

const repositoryPluginAsync: FastifyPluginAsync<
  IRepositoryPluginOptions
> = async (server, { prisma }): Promise<void> => {
  server.decorate('userRepository', new UserRepository(prisma));
};

export default fastifyPlugin(repositoryPluginAsync);
