import type { FastifyPluginAsync } from 'fastify';
import commonSchemasPluginAsync from 'src/infrastructure/schemas/common.schema';
import statusSchemaPluginAsync from 'src/infrastructure/schemas/status.schema';
import authSchemaPluginAsync from 'src/infrastructure/schemas/auth.schema';
import userSchemaPluginAsync from 'src/infrastructure/schemas/user.schema';
import { fastifyPlugin } from 'fastify-plugin';

const schemasPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  await server.register(statusSchemaPluginAsync);
  await server.register(userSchemaPluginAsync);
  await server.register(authSchemaPluginAsync);
  await server.register(commonSchemasPluginAsync);
};

export default fastifyPlugin(schemasPluginAsync);
