import type {
  IBaseRequestOptions,
  IRequestOptions,
} from 'src/application/clients/http.client';
import type { ILogger } from 'src/application/loggers/logger';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { IUserDto } from 'src/application/dtos/users';
import { describe, test, expect } from '@jest/globals';
import {
  HTTP_CODE,
  HTTP_HEADER,
  HTTP_METHOD,
  MIME_TYPE,
} from 'src/domain/constants/http';
import {
  createHttpAgentMock,
  createLoggerMock,
  createResponseMock,
} from 'src/infrastructure/clients/__tests__/client.test.utils';
import HttpClient from 'src/infrastructure/clients/http.client';
import ErrorMapper from 'src/infrastructure/mappers/error.mapper';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import NotFoundError from 'src/application/errors/not.found.error';
import InternalServerError from 'src/application/errors/internal.server.error';
import { mapToFullUrl } from 'src/infrastructure/utilities/converters.utils';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';

describe('Class: HttpClient', (): void => {
  const ORIGIN = 'http://localhost:8081';
  const JSON_HEADERS = {
    [HTTP_HEADER.CONTENT_TYPE]: MIME_TYPE.JSON,
  };
  const DEFAULT_QUERY = {
    limit: 5,
    offset: 0,
  };

  const errorMapper = new ErrorMapper();
  const userMapper = new UserMapper();
  const userDto = buildUserDto();
  const serializedUser = userMapper.serializeUserDto(userDto);

  describe('Methods: getAsync(), postAsync(), putAsync(), deleteAsync(), patchAsync()', (): void => {
    test.concurrent.each([
      HTTP_METHOD.DELETE,
      HTTP_METHOD.PATCH,
      HTTP_METHOD.POST,
      HTTP_METHOD.GET,
      HTTP_METHOD.PUT,
    ])(
      'Should return text data for $method request without an error ' +
        'if response status code is OK and not JSON headers in response',
      async (method): Promise<void> => {
        // Prepare
        const httpAgentMock = createHttpAgentMock();
        const httpClient = new HttpClient(
          httpAgentMock,
          {} as IErrorMapper,
          {} as ILogger,
          ORIGIN,
        );

        const expectedResponse = { data: '' };
        const responseMock = createResponseMock({ statusCode: HTTP_CODE.OK });
        const requestOptions: IBaseRequestOptions = {
          query: DEFAULT_QUERY,
          path: '/users',
        };

        httpAgentMock.request.mockResolvedValueOnce(responseMock as never);
        responseMock.body.text.mockResolvedValueOnce(expectedResponse.data);

        // Perform
        let result: unknown;

        switch (method) {
          case HTTP_METHOD.GET:
            result = await httpClient.getAsync(requestOptions);
            break;
          case HTTP_METHOD.POST:
            result = await httpClient.postAsync(requestOptions);
            break;
          case HTTP_METHOD.PUT:
            result = await httpClient.putAsync(requestOptions);
            break;
          case HTTP_METHOD.DELETE:
            result = await httpClient.deleteAsync(requestOptions);
            break;
          case HTTP_METHOD.PATCH:
            result = await httpClient.patchAsync(requestOptions);
            break;
        }

        // Validate
        expect(result).toEqual(expectedResponse);
        expect(httpAgentMock.request).toHaveBeenNthCalledWith(1, {
          query: requestOptions.query,
          path: requestOptions.path,
          body: undefined,
          origin: ORIGIN,
          headers: {},
          method,
        });
        expect(responseMock.body.text).toHaveBeenCalledTimes(1);
      },
    );

    test.concurrent(
      'Should return error if response status code is not OK',
      async (): Promise<void> => {
        // Prepare
        const httpAgentMock = createHttpAgentMock();
        const httpClient = new HttpClient(
          httpAgentMock,
          errorMapper,
          {} as ILogger,
        );

        const expectedError = new NotFoundError('Endpoint not found!');
        const responseMock = createResponseMock({
          statusCode: HTTP_CODE.NOT_FOUND,
        });
        const requestOptions: IRequestOptions = {
          query: DEFAULT_QUERY,
          origin: ORIGIN,
          body: userDto,
          path: '/users',
        };

        responseMock.body.text.mockResolvedValueOnce(expectedError.message);
        httpAgentMock.request.mockResolvedValueOnce(responseMock as never);

        // Perform
        const { error } = await httpClient.postAsync(requestOptions);

        // Validate
        expect(error).toEqual(expectedError);
        expect(responseMock.body.text).toHaveBeenCalledTimes(1);
        expect(httpAgentMock.request).toHaveBeenNthCalledWith(1, {
          origin: requestOptions.origin,
          query: requestOptions.query,
          path: requestOptions.path,
          method: HTTP_METHOD.POST,
          headers: JSON_HEADERS,
          body: serializedUser,
        });
      },
    );

    test.concurrent(
      'Should return parsed JSON data if response status code is OK ' +
        'and response headers contain `Content-Type: application/json`',
      async (): Promise<void> => {
        // Prepare
        const httpAgentMock = createHttpAgentMock();
        const httpClient = new HttpClient(
          httpAgentMock,
          {} as IErrorMapper,
          {} as ILogger,
        );

        const responseMock = createResponseMock({
          statusCode: HTTP_CODE.CREATED,
          headers: JSON_HEADERS,
        });
        const requestOptions: IRequestOptions = {
          path: `${ORIGIN}/users`,
          query: DEFAULT_QUERY,
          body: userDto,
        };

        responseMock.body.json.mockResolvedValueOnce(requestOptions.body);
        httpAgentMock.request.mockResolvedValueOnce(responseMock as never);

        // Perform
        const { data } = await httpClient.postAsync<IUserDto>(requestOptions);

        // Validate
        expect(data).toEqual(requestOptions.body);
        expect(httpAgentMock.request).toHaveBeenNthCalledWith(1, {
          query: requestOptions.query,
          path: requestOptions.path,
          method: HTTP_METHOD.POST,
          headers: JSON_HEADERS,
          body: serializedUser,
          origin: undefined,
        });
        expect(responseMock.body.json).toHaveBeenCalledTimes(1);
      },
    );

    test.concurrent(
      'Should log and throw error if failed to send a request',
      async (): Promise<void> => {
        // Prepare
        const httpAgentMock = createHttpAgentMock();
        const loggerMock = createLoggerMock();
        const httpClient = new HttpClient(
          httpAgentMock,
          {} as IErrorMapper,
          loggerMock,
        );

        const expectedError = new InternalServerError(
          'Failed to send HTTP request',
        );
        const requestOptions: IRequestOptions = {
          path: '/api/v1/users',
          query: DEFAULT_QUERY,
          origin: ORIGIN,
          body: userDto,
        };
        const fullUrl = mapToFullUrl(
          requestOptions.path,
          requestOptions.origin,
          requestOptions.query,
        );

        httpAgentMock.request.mockRejectedValueOnce(expectedError as never);
        loggerMock.error.mockReturnValueOnce();

        // Perform
        await expect(
          (): Promise<unknown> => httpClient.postAsync(requestOptions),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(httpAgentMock.request).toHaveBeenNthCalledWith(1, {
          origin: requestOptions.origin,
          query: requestOptions.query,
          path: requestOptions.path,
          method: HTTP_METHOD.POST,
          headers: JSON_HEADERS,
          body: serializedUser,
        });
        expect(loggerMock.error).toHaveBeenNthCalledWith(
          1,
          `Failed to send ${HTTP_METHOD.POST} request to: ${fullUrl}, error: ${expectedError.message}`,
        );
      },
    );
  });
});
