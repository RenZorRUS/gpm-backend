/** Ajv JSON Schema: https://ajv.js.org/json-schema.html#json-schema */
import type { FastifyEnvOptions } from '@fastify/env';
import Schema from 'fluent-json-schema';
import type { NodeEnv } from 'src/types/common';

const getEnvOptions = (
  nodeEnv: NodeEnv = 'development',
): FastifyEnvOptions => ({
  confKey: 'config',
  dotenv: {
    // Writes environment variables to `process.env` object by default.
    path: '.env',
    encoding: 'utf8',
    debug: nodeEnv === 'development',
    override: true,
  },
  schema: Schema.object()
    .prop('PORT', Schema.integer().default(8081))
    .prop('HOST', Schema.string().default('localhost'))
    .prop('API_PREFIX', Schema.string().default('/api'))
    .prop('SERVICE_VERSION', Schema.string().default('0.0.1'))
    .valueOf(),
});

export default getEnvOptions;
