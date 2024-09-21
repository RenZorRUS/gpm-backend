import type { IErrorDto } from 'src/application/dtos/common';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { ERROR_DTO_ID } from 'src/domain/constants/schemas';

const commonSchemasPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const errorDto: ObjectSchema<IErrorDto> = Schema.object()
    .id(ERROR_DTO_ID)
    .prop('name', Schema.string())
    .prop('message', Schema.string());

  server.addSchema(errorDto);
};

export default fastifyPlugin(commonSchemasPluginAsync);
