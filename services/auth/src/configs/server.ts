import type { FastifyServerOptions, FastifyListenOptions } from 'fastify';
import type { EnvConfig, NodeEnv } from 'src/types/common';
import getLoggerOptions from 'src/configs/logger';

const getServerOptions = (
  nodeEnv: NodeEnv = 'development',
): FastifyServerOptions => ({
  connectionTimeout: 0,
  keepAliveTimeout: 720000,
  forceCloseConnections: 'idle',
  maxRequestsPerSocket: 0,
  requestTimeout: 0,
  ignoreTrailingSlash: true,
  ignoreDuplicateSlashes: true,
  maxParamLength: 100, // 100 characters
  bodyLimit: 1024 * 1024 * 5, // 5mb
  onProtoPoisoning: 'error',
  onConstructorPoisoning: 'error',
  logger: getLoggerOptions(nodeEnv),
  disableRequestLogging: false,
  caseSensitive: true,
  allowUnsafeRegex: false,
  trustProxy: false,
  pluginTimeout: 10000,
  exposeHeadRoutes: true,
  return503OnClosing: true,
  useSemicolonDelimiter: false,
});

const getServerListenOptions = (config: EnvConfig): FastifyListenOptions => ({
  port: config.PORT,
  host: config.HOST,
  listenTextResolver: (address): string =>
    `Authorization service (mode: ${process.env.NODE_ENV ?? 'development'}) is listening at ${address}${config.API_PREFIX ?? ''}`,
});

export { getServerListenOptions };
export default getServerOptions;
