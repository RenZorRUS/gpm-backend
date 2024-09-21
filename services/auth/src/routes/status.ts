import type { FastifyPluginAsync, RouteShorthandOptions } from 'fastify';
import Schema from 'fluent-json-schema';
import type { StatusDto } from 'src/types/dtos/status';

/**
 * Fastify plugin system guarantees that every part of our app
 * has been loaded before start listening to incoming requests.
 */
const statusRoutesPlugin: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const statusRouteOptions: RouteShorthandOptions = {
    schema: {
      response: {
        200: Schema.object()
          .prop('status', Schema.string().enum(['ok']))
          .prop('version', Schema.string())
          .valueOf(),
      },
    },
  };

  server.get(
    '/status',
    statusRouteOptions,
    (): StatusDto => ({
      status: 'ok',
      version: server.config.SERVICE_VERSION,
    }),
  );
};

export default statusRoutesPlugin;
