import type { FastifyServerOptions, FastifyListenOptions } from 'fastify';
import type { IEnvConfig } from 'src/application/types/global';
import getLoggerOptions from 'src/infrastructure/configs/logger';

const getServerOptions = (isProduction: boolean): FastifyServerOptions => ({
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
  logger: getLoggerOptions(isProduction),
  disableRequestLogging: false,
  caseSensitive: true,
  allowUnsafeRegex: false,
  trustProxy: false,
  pluginTimeout: 10000,
  exposeHeadRoutes: true,
  return503OnClosing: true,
  useSemicolonDelimiter: false,
});

const getServerListenOptions = (config: IEnvConfig): FastifyListenOptions => ({
  port: parseInt(config.PORT),
  host: config.HOST,
  listenTextResolver: (address): string =>
    `Authorization service (mode: ${process.env.NODE_ENV ?? 'development'}) is listening at ${address}${config.API_PREFIX ?? ''}`,
});

export { getServerListenOptions };
export default getServerOptions;
