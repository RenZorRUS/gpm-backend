import type { IHttpClient } from 'src/application/clients/http.client';
import type { ILogger } from 'src/application/loggers/logger';
import { describe, test, expect } from '@jest/globals';
import { createHttpClientMock } from 'src/infrastructure/clients/__tests__/client.test.utils';
import AuthMapper from 'src/infrastructure/mappers/auth.mapper';
import AuthService from 'src/infrastructure/services/auth.service';
import AuthValidator from 'src/infrastructure/validators/auth.validator';
import {
  createValidateAuthTokensDto,
  createValidateAuthTokensResponse,
} from 'src/infrastructure/validators/__tests__/validator.test.utils';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import { AUTH_ERROR } from 'src/domain/constants/errors';
import InternalServerError from 'src/application/errors/internal-server-error';
import { createLoggerMock } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';

describe('Class: AuthService', (): void => {
  const VALIDATE_AUTH_TOKEN_PATH = '/api/v1/auth/validate/token';

  const authValidator = new AuthValidator();
  const authMapper = new AuthMapper();

  const baseAuthTokensResponse = createValidateAuthTokensResponse();
  const baseAuthTokensDto = createValidateAuthTokensDto();
  const serializedAuthTokensDto =
    authMapper.serializeAuthTokenValidityDto(baseAuthTokensDto);

  describe('Method: validateAuthTokensOrThrowAsync()', (): void => {
    test.concurrent(
      'Should not throw an unauthorized error for valid auth tokens',
      async (): Promise<void> => {
        // Prepare
        const httpClientMock = createHttpClientMock();
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          {} as ILogger,
        );

        httpClientMock.postAsync.mockResolvedValueOnce({
          data: baseAuthTokensResponse,
        });

        // Perform
        await authService.validateAuthTokensOrThrowAsync(baseAuthTokensDto);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          path: VALIDATE_AUTH_TOKEN_PATH,
          body: serializedAuthTokensDto,
        });
      },
    );

    test.concurrent(
      'Should throw an unauthorized error if auth tokens not provided in DTO',
      async (): Promise<void> => {
        // Prepare
        const expectedError = new UnauthorizedError(
          AUTH_ERROR.AUTH_TOKENS_NOT_PROVIDED,
        );
        const authService = new AuthService(
          {} as IHttpClient,
          authMapper,
          authValidator,
          {} as ILogger,
        );

        const authTokensDto = createValidateAuthTokensDto({
          isRefreshTokenProvided: false,
          isAccessTokenProvided: false,
        });

        // Perform & Validate
        await expect(
          (): Promise<void> =>
            authService.validateAuthTokensOrThrowAsync(authTokensDto),
        ).rejects.toThrowError(expectedError);
      },
    );

    test.concurrent(
      'Should throw error received from auth service',
      async (): Promise<void> => {
        // Prepare
        const httpClientMock = createHttpClientMock();

        const expectedError = new InternalServerError('Auth service is down!');
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          {} as ILogger,
        );

        httpClientMock.postAsync.mockResolvedValueOnce({
          error: expectedError,
        });

        // Perform
        await expect(
          (): Promise<void> =>
            authService.validateAuthTokensOrThrowAsync(baseAuthTokensDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          path: VALIDATE_AUTH_TOKEN_PATH,
          body: serializedAuthTokensDto,
        });
      },
    );

    test.concurrent(
      'Should throw internal server error if failed to parse auth tokens validity response',
      async (): Promise<void> => {
        // Prepare
        const INVALID_JSON = 'Invalid JSON!';

        const httpClientMock = createHttpClientMock();
        const loggerMock = createLoggerMock();

        const expectedError = new InternalServerError(
          AUTH_ERROR.FAILED_TO_VALIDATE_AUTH_TOKENS,
        );
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          loggerMock,
        );

        httpClientMock.postAsync.mockResolvedValueOnce({
          data: INVALID_JSON,
        });
        loggerMock.error.mockReturnValueOnce();

        // Perform
        await expect(
          (): Promise<void> =>
            authService.validateAuthTokensOrThrowAsync(baseAuthTokensDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          path: VALIDATE_AUTH_TOKEN_PATH,
          body: serializedAuthTokensDto,
        });
        expect(loggerMock.error).toHaveBeenNthCalledWith(
          1,
          `Failed to parse data: ${INVALID_JSON} from POST: ${VALIDATE_AUTH_TOKEN_PATH}`,
        );
      },
    );
  });
});
