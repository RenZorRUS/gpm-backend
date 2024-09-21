import { describe, test, expect } from '@jest/globals';
import { HTTP_CODE } from 'src/domain/constants/http';
import NotFoundError from 'src/application/errors/not.found.error';
import PublisherError from 'src/application/errors/publisher.error';
import ValidationError from 'src/application/errors/validation.error';
import ErrorHandler from 'src/infrastructure/handlers/error.handler';
import ErrorMapper from 'src/infrastructure/mappers/error.mapper';
import InternalServerError from 'src/application/errors/internal.server.error';
import BadRequestError from 'src/application/errors/bad.request.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import {
  createReplyMock,
  createRequestMock,
} from 'src/infrastructure/handlers/__tests__/handler.test.utils';

describe('Class: ErrorHandler', (): void => {
  const errorMapper = new ErrorMapper();
  const errorHandler = new ErrorHandler(errorMapper);

  describe('Method: handleServiceErrorAsync()', (): void => {
    test.concurrent.each([
      {
        error: new NotFoundError(''),
        expectedHttpCode: HTTP_CODE.NOT_FOUND,
      },
      {
        error: new ValidationError(''),
        expectedHttpCode: HTTP_CODE.BAD_REQUEST,
      },
      {
        error: new PublisherError(''),
        expectedHttpCode: HTTP_CODE.INTERNAL_SERVER_ERROR,
      },
      {
        error: new InternalServerError(''),
        expectedHttpCode: HTTP_CODE.INTERNAL_SERVER_ERROR,
      },
      {
        error: new BadRequestError(''),
        expectedHttpCode: HTTP_CODE.BAD_REQUEST,
      },
      {
        error: new UnauthorizedError(''),
        expectedHttpCode: HTTP_CODE.UNAUTHORIZED,
      },
      {
        error: new Error(''),
        expectedHttpCode: HTTP_CODE.INTERNAL_SERVER_ERROR,
      },
    ])(
      'Should handle $error.name and send reply with HTTP code: $expectedHttpCode',
      async ({ error, expectedHttpCode }): Promise<void> => {
        // Prepare
        const mappedError = errorMapper.mapErrorToReply(error);

        const requestMock = createRequestMock();
        const replyMock = createReplyMock();

        replyMock.status.mockReturnThis();
        replyMock.send.mockReturnThis();

        const isUnexpectedError = error.name === 'Error';

        if (isUnexpectedError) {
          requestMock.log.error.mockReturnValueOnce();
        }

        // Perform
        errorHandler.handleServiceErrorAsync(error, requestMock, replyMock);

        // Validate
        expect(replyMock.status).toHaveBeenNthCalledWith(1, expectedHttpCode);
        expect(replyMock.send).toHaveBeenNthCalledWith(1, mappedError);

        if (isUnexpectedError) {
          expect(requestMock.log.error).toHaveBeenNthCalledWith(1, error);
        }
      },
    );
  });
});
