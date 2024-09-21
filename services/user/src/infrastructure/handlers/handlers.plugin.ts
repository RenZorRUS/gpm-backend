import type { FastifyPluginAsync } from 'fastify';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { IAuthService } from 'src/application/services/auth.service';
import { fastifyPlugin } from 'fastify-plugin';
import ErrorHandler from 'src/infrastructure/handlers/error.handler';
import AuthHandler from 'src/infrastructure/handlers/auth.handler';

export interface IHandlerPluginAsync {
  errorMapper: IErrorMapper;
  authService: IAuthService;
}

const handlerPluginAsync: FastifyPluginAsync<IHandlerPluginAsync> = async (
  server,
  { errorMapper, authService },
): Promise<void> => {
  server.decorate('serviceErrorHandler', new ErrorHandler(errorMapper));
  server.decorate('authHandler', new AuthHandler(authService));
};

export default fastifyPlugin(handlerPluginAsync);
