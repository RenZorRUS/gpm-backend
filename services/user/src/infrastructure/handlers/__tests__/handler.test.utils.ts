import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ILogger } from 'src/application/loggers/logger';
import { jest } from '@jest/globals';
import { createLoggerMock } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';

export interface ICreateRequestOptions {
  headers?: FastifyRequest['headers'];
  log?: ILogger;
}

export const createReplyMock = (): jest.Mocked<FastifyReply> =>
  ({
    status: jest.fn<FastifyReply['status']>(),
    send: jest.fn<FastifyReply['send']>(),
  }) as unknown as jest.Mocked<FastifyReply>;

export const createRequestMock = ({
  headers = {},
  log = createLoggerMock(),
}: ICreateRequestOptions = {}): jest.Mocked<FastifyRequest> =>
  ({
    headers,
    log,
  }) as unknown as jest.Mocked<FastifyRequest>;
