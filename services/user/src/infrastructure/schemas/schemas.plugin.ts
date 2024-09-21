import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import statusSchemaPluginAsync from 'src/infrastructure/schemas/status.schema';
import userSchemaPluginAsync from 'src/infrastructure/schemas/user.schema';
import commonSchemasPluginAsync from 'src/infrastructure/schemas/common.schema';

const schemasPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  await server.register(statusSchemaPluginAsync);
  await server.register(commonSchemasPluginAsync);
  await server.register(userSchemaPluginAsync);
};

export default fastifyPlugin(schemasPluginAsync);
