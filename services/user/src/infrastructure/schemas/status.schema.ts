import type { FastifyPluginAsync } from 'fastify';
import type { IStatusDto } from 'src/application/dtos/status';
import { fastifyPlugin } from 'fastify-plugin';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import { STATUS_DTO_ID } from 'src/domain/constants/schemas';

const statusSchemaPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const statusDto: ObjectSchema<IStatusDto> = Schema.object()
    .id(STATUS_DTO_ID)
    .required(['status', 'version'])
    .prop('status', Schema.string())
    .prop('version', Schema.string())
    .prop('title', Schema.string())
    .prop('description', Schema.string());

  server.addSchema(statusDto);
};

export default fastifyPlugin(statusSchemaPluginAsync);
