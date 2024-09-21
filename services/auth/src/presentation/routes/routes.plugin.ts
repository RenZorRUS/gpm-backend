import type { FastifyPluginAsync } from 'fastify';
import type StatusController from 'src/presentation/controllers/status.controller';
import type AuthController from '../controllers/auth.controller';
import statusRoutesPluginAsync from 'src/presentation/routes/status';
import v1RoutesPluginAsync from 'src/presentation/routes/v1/routes.plugin';

export interface IRoutesPluginOptions {
  statusController: StatusController;
  authController: AuthController;
}

const routesPluginAsync: FastifyPluginAsync<IRoutesPluginOptions> = async (
  server,
  { statusController, authController },
): Promise<void> => {
  await server.register(statusRoutesPluginAsync, { statusController });
  await server.register(v1RoutesPluginAsync, {
    authController,
    prefix: '/v1',
  });
};

export default routesPluginAsync;
