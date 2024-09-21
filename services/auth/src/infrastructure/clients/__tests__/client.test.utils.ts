import type {
  IHttpClient,
  IncomingHttpHeaders,
} from 'src/application/clients/http.client';
import type { Agent as HttpAgent, Dispatcher } from 'undici';
import type { ILogger } from 'src/application/loggers/logger';
import { HTTP_CODE } from 'src/domain/constants/http';
import { jest } from '@jest/globals';

export interface IResponseMockParams {
  statusCode?: HTTP_CODE | number;
  headers?: IncomingHttpHeaders;
}

export const createHttpClientMock = (): jest.Mocked<IHttpClient> =>
  ({
    getAsync: jest.fn<IHttpClient['getAsync']>(),
    postAsync: jest.fn<IHttpClient['postAsync']>(),
    putAsync: jest.fn<IHttpClient['putAsync']>(),
    deleteAsync: jest.fn<IHttpClient['deleteAsync']>(),
    patchAsync: jest.fn<IHttpClient['patchAsync']>(),
  }) as unknown as jest.Mocked<IHttpClient>;

export const createResponseMock = ({
  statusCode = HTTP_CODE.OK,
  headers = {},
}: IResponseMockParams = {}): jest.Mocked<Dispatcher.ResponseData> =>
  ({
    statusCode,
    headers,
    body: {
      text: jest.fn<Dispatcher.BodyMixin['text']>(),
      json: jest.fn<Dispatcher.BodyMixin['json']>(),
    },
  }) as unknown as jest.Mocked<Dispatcher.ResponseData>;

export const createHttpAgentMock = (): jest.Mocked<HttpAgent> =>
  ({
    request: jest.fn<HttpAgent['request']>(),
  }) as unknown as jest.Mocked<HttpAgent>;

export const createLoggerMock = (): jest.Mocked<ILogger> => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
});
