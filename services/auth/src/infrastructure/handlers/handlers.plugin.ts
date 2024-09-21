import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { FastifyPluginAsync } from 'fastify';
import ErrorHandler from 'src/infrastructure/handlers/error.handler';
import { fastifyPlugin } from 'fastify-plugin';

export interface IHandlersPluginAsync {
  errorMapper: IErrorMapper;
}

const handlersPluginAsync: FastifyPluginAsync<IHandlersPluginAsync> = async (
  server,
  { errorMapper },
): Promise<void> => {
  server.decorate('serviceErrorHandler', new ErrorHandler(errorMapper));
};

export default fastifyPlugin(handlersPluginAsync);
