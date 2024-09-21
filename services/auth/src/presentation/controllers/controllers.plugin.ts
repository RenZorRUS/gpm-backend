import type { FastifyPluginAsync } from 'fastify';
import type { IStatusService } from 'src/application/services/status.service';
import type { IAuthService } from 'src/application/services/auth.service';
import StatusController from 'src/presentation/controllers/status.controller';
import AuthController from 'src/presentation/controllers/auth.controller';
import { fastifyPlugin } from 'fastify-plugin';

export interface IControllersPluginOptions {
  statusService: IStatusService;
  authService: IAuthService;
}

const controllersPluginAsync: FastifyPluginAsync<
  IControllersPluginOptions
> = async (server, { statusService, authService }): Promise<void> => {
  server.decorate('statusController', new StatusController(statusService));
  server.decorate('authController', new AuthController(authService));
};

export default fastifyPlugin(controllersPluginAsync);
