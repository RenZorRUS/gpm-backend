import type { NodeEnv } from 'src/types/common';
import type { PinoLoggerOptions } from 'fastify/types/logger';

const getLoggerOptions = (
  nodeEnv: NodeEnv = 'development',
): boolean | PinoLoggerOptions =>
  nodeEnv === 'production' || {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  };

export default getLoggerOptions;
