import { describe, test, expect } from '@jest/globals';
import InternalServerError from 'src/application/errors/internal-server-error';
import NotFoundError from 'src/application/errors/not-found.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import ErrorMapper from 'src/infrastructure/mappers/error.mapper';
import { HTTP_CODE } from 'src/domain/constants/http';
import BadRequestError from 'src/application/errors/bad-request.error';
import { createResponseMock } from 'src/infrastructure/clients/__tests__/client.test.utils';

describe('Class: ErrorMapper', (): void => {
  const errorMapper = new ErrorMapper();

  describe('Method: mapErrorToReply()', (): void => {
    test.concurrent.each([
      {
        error: new InternalServerError(''),
        expectedOutput: { name: 'InternalServerError', message: '' },
      },
      {
        error: new NotFoundError(''),
        expectedOutput: { name: 'NotFoundError', message: '' },
      },
      {
        error: new UnauthorizedError(''),
        expectedOutput: { name: 'UnauthorizedError', message: '' },
      },
    ])(
      'Error: `$error.name` should be converted into: `$expectedOutput`',
      async ({ error, expectedOutput }): Promise<void> => {
        // Perform
        const result = errorMapper.mapErrorToReply(error);

        // Validate
        expect(result).toEqual(expectedOutput);
      },
    );
  });

  describe('Method: mapResponseErrorAsync()', (): void => {
    test.concurrent.each([
      {
        statusCode: HTTP_CODE.BAD_REQUEST,
        expectedError: new BadRequestError(''),
      },
      {
        statusCode: HTTP_CODE.UNAUTHORIZED,
        expectedError: new UnauthorizedError(''),
      },
      {
        statusCode: HTTP_CODE.NOT_FOUND,
        expectedError: new NotFoundError(''),
      },
      {
        statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR,
        expectedError: new InternalServerError(''),
      },
      {
        statusCode: 0,
        expectedError: new Error(''),
      },
    ])(
      'For status code: `$statusCode` should return: `$expectedError.name`',
      async ({ statusCode, expectedError }): Promise<void> => {
        // Prepare
        const responseMock = createResponseMock({ statusCode });
        responseMock.body.text.mockResolvedValueOnce('');

        // Perform
        const result = await errorMapper.mapResponseErrorAsync(responseMock);

        // Validate
        expect(responseMock.body.text).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedError);
      },
    );
  });
});
