import type { FastifyPluginAsync } from 'fastify';
import type { IStatusService } from 'src/application/services/status.service';
import type { IUserService } from 'src/application/services/user.service';
import { fastifyPlugin } from 'fastify-plugin';
import StatusController from 'src/presentation/controllers/status.controller';
import UserController from 'src/presentation/controllers/user.controller';

export interface IControllersPluginOptions {
  statusService: IStatusService;
  userService: IUserService;
}

const controllersPluginAsync: FastifyPluginAsync<
  IControllersPluginOptions
> = async (server, { statusService, userService }): Promise<void> => {
  server.decorate('userController', new UserController(userService));
  server.decorate('statusController', new StatusController(statusService));
};

export default fastifyPlugin(controllersPluginAsync);
