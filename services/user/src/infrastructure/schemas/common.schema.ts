import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import type { IErrorDto, IPaginationQuery } from 'src/application/dtos/common';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from 'src/domain/constants/common';
import {
  BASE_PAGINATION_DTO_ID,
  ERROR_DTO_ID,
  PAGINATION_QUERY_ID,
} from 'src/domain/constants/schemas';

const commonSchemasPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const paginationQuery: ObjectSchema<IPaginationQuery> = Schema.object()
    .id(PAGINATION_QUERY_ID)
    .prop('limit', Schema.integer().default(DEFAULT_PAGINATION_LIMIT))
    .prop('offset', Schema.integer().default(DEFAULT_PAGINATION_OFFSET));

  /** @typedef {import('src/application/dtos/common').IPaginationResponse} */
  const paginationDto = Schema.object()
    .id(BASE_PAGINATION_DTO_ID)
    .required(['limit', 'offset', 'total'])
    .prop('total', Schema.integer())
    .extend(paginationQuery);

  const errorDto: ObjectSchema<IErrorDto> = Schema.object()
    .id(ERROR_DTO_ID)
    .prop('name', Schema.string())
    .prop('message', Schema.string());

  server.addSchema(errorDto);
  server.addSchema(paginationQuery);
  server.addSchema(paginationDto);
};

export default fastifyPlugin(commonSchemasPluginAsync);
