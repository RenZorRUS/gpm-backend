import type { FastifyPluginAsync } from 'fastify';
import type AuthController from 'src/presentation/controllers/auth.controller';
import authRoutesPluginAsync from 'src/presentation/routes/v1/auth';

export interface IV1RoutesPluginOptions {
  authController: AuthController;
}

const v1RoutesPluginAsync: FastifyPluginAsync<IV1RoutesPluginOptions> = async (
  server,
  { authController },
): Promise<void> => {
  await server.register(authRoutesPluginAsync, {
    prefix: '/auth',
    authController,
  });
};

export default v1RoutesPluginAsync;
