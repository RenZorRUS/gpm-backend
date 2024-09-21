import type { FastifyPluginAsync } from 'fastify';
import type StatusController from 'src/presentation/controllers/status.controller';
import { STATUS_TAG } from 'src/domain/constants/tags';
import { HTTP_CODE } from 'src/domain/constants/http';
import { STATUS_DTO_ID } from 'src/domain/constants/schemas';

export interface IStatusRoutesPluginOptions {
  statusController: StatusController;
}

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
