import type StatusController from 'src/presentation/controllers/status.controller';
import type UserController from 'src/presentation/controllers/user.controller';
import type { IAuthHandler } from 'src/application/handlers/auth.handler';
import type { FastifyPluginAsync } from 'fastify';
import statusRoutesPluginAsync from 'src/presentation/routes/status';
import v1RoutesPluginAsync from 'src/presentation/routes/v1/routes.plugin';

export interface IRoutesPluginOptions {
  statusController: StatusController;
  userController: UserController;
  authHandler: IAuthHandler;
}

const routesPluginAsync: FastifyPluginAsync<IRoutesPluginOptions> = async (
  server,
  { statusController, userController, authHandler },
): Promise<void> => {
  await server.register(statusRoutesPluginAsync, {
    statusController,
  });
  await server.register(v1RoutesPluginAsync, {
    userController,
    prefix: '/v1',
    authHandler,
  });
};

export default routesPluginAsync;
