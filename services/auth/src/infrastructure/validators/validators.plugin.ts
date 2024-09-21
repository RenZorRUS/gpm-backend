import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import AuthValidator from 'src/infrastructure/validators/auth.validator';

const validatorsPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  server.decorate('authValidator', new AuthValidator());
};

export default fastifyPlugin(validatorsPluginAsync);
