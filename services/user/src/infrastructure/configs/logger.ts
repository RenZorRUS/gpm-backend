import type { PinoLoggerOptions } from 'fastify/types/logger';

const getLoggerOptions = (isProduction: boolean): boolean | PinoLoggerOptions =>
  isProduction || {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  };

export default getLoggerOptions;
