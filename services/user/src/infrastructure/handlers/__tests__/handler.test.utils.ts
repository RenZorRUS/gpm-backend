import type { FastifyReply, FastifyRequest } from 'fastify';
import { jest } from '@jest/globals';
import { createLoggerMock } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';

export const createReplyMock = (): jest.Mocked<FastifyReply> =>
  ({
    status: jest.fn<FastifyReply['status']>(),
    send: jest.fn<FastifyReply['send']>(),
  }) as unknown as jest.Mocked<FastifyReply>;

export const createRequestMock = (): jest.Mocked<FastifyRequest> =>
  ({
    log: createLoggerMock(),
    headers: {
      authorization: 'Bearer token',
    },
  }) as unknown as jest.Mocked<FastifyRequest>;
