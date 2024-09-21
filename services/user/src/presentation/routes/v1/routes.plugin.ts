import type { FastifyPluginAsync } from 'fastify';
import type { IAuthHandler } from 'src/application/handlers/auth.handler';
import type UserController from 'src/presentation/controllers/user.controller';
import userRoutesPluginAsync from 'src/presentation/routes/v1/users';

export interface IV1RoutesPluginOptions {
  userController: UserController;
  authHandler: IAuthHandler;
}

const v1RoutesPluginAsync: FastifyPluginAsync<IV1RoutesPluginOptions> = async (
  server,
  { userController, authHandler },
): Promise<void> => {
  await server.register(userRoutesPluginAsync, {
    prefix: '/users',
    userController,
    authHandler,
  });
};

export default v1RoutesPluginAsync;
