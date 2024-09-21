import type { FastifyPluginAsync } from 'fastify';
import type StatusController from 'src/presentation/controllers/status.controller';
import { STATUS_DTO_ID } from 'src/domain/constants/schemas';
import { STATUS_TAG } from 'src/domain/constants/tags';
import { HTTP_CODE } from 'src/domain/constants/http';

export interface IStatusRoutesPluginOptions {
  statusController: StatusController;
}

/**
 * Fastify plugin system guarantees that every part of our app
 * has been loaded before start listening to incoming requests.
 */
const statusRoutesPluginAsync: FastifyPluginAsync<
  IStatusRoutesPluginOptions
> = async (server, { statusController }): Promise<void> => {
  server.get(
    '/status',
    {
      schema: {
        description: 'Returns the service status and version',
        summary: 'Returns the service status and version',
        tags: [STATUS_TAG],
        response: {
          [HTTP_CODE.OK]: server.getSchema(STATUS_DTO_ID),
        },
      },
    },
    statusController.getStatus,
  );
};

export default statusRoutesPluginAsync;
