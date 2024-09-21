import type { IHttpClient } from 'src/application/clients/http.client';
import type { IAuthMapper } from 'src/application/mappers/auth.mapper';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
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
  describe('Method: validateAuthTokensOrThrowAsync()', (): void => {
    test.concurrent(
      'Should not throw an unauthorized error for valid auth tokens',
      async (): Promise<void> => {
        // Prepare
        const httpClientMock = createHttpClientMock();
        const authMapper = new AuthMapper();
        const authValidator = new AuthValidator();
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          {} as ILogger,
        );

        const dto = createValidateAuthTokensDto();
        const response = createValidateAuthTokensResponse();

        httpClientMock.postAsync.mockResolvedValueOnce({ data: response });

        // Perform
        await authService.validateAuthTokensOrThrowAsync(dto);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          body: authMapper.serializeTokenValidityParams(dto),
          path: '/v1/auth/validate/token',
        });
      },
    );

    test.concurrent(
      'Should throw an unauthorized error if auth tokens not provided in DTO',
      async (): Promise<void> => {
        // Prepare
        const authService = new AuthService(
          {} as IHttpClient,
          {} as IAuthMapper,
          {} as IAuthValidator,
          {} as ILogger,
        );

        const expectedError = new UnauthorizedError(
          AUTH_ERROR.AUTH_TOKENS_NOT_PROVIDED,
        );
        const dto = createValidateAuthTokensDto({
          isAccessTokenProvided: false,
          isRefreshTokenProvided: false,
        });

        // Perform & Validate
        await expect(
          (): Promise<void> => authService.validateAuthTokensOrThrowAsync(dto),
        ).rejects.toThrowError(expectedError);
      },
    );

    test.concurrent(
      'Should throw error received from auth service',
      async (): Promise<void> => {
        // Prepare
        const httpClientMock = createHttpClientMock();
        const authMapper = new AuthMapper();
        const authValidator = new AuthValidator();
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          {} as ILogger,
        );

        const expectedError = new InternalServerError('Auth service is down!');
        const dto = createValidateAuthTokensDto();

        httpClientMock.postAsync.mockResolvedValueOnce({
          error: expectedError,
        });

        // Perform
        await expect(
          (): Promise<void> => authService.validateAuthTokensOrThrowAsync(dto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          body: authMapper.serializeTokenValidityParams(dto),
          path: '/v1/auth/validate/token',
        });
      },
    );

    test.concurrent(
      'Should throw internal server error if failed to parse auth tokens validity response',
      async (): Promise<void> => {
        // Prepare
        const httpClientMock = createHttpClientMock();
        const loggerMock = createLoggerMock();
        const authMapper = new AuthMapper();
        const authValidator = new AuthValidator();
        const authService = new AuthService(
          httpClientMock,
          authMapper,
          authValidator,
          loggerMock,
        );

        const invalidJson = 'Invalid JSON!';
        const dto = createValidateAuthTokensDto();
        const expectedError = new InternalServerError(
          AUTH_ERROR.FAILED_TO_VALIDATE_AUTH_TOKENS,
        );

        httpClientMock.postAsync.mockResolvedValueOnce({
          data: invalidJson,
        });
        loggerMock.error.mockReturnValueOnce();

        // Perform
        await expect(
          (): Promise<void> => authService.validateAuthTokensOrThrowAsync(dto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(httpClientMock.postAsync).toHaveBeenNthCalledWith(1, {
          body: authMapper.serializeTokenValidityParams(dto),
          path: '/v1/auth/validate/token',
        });
        expect(loggerMock.error).toHaveBeenNthCalledWith(
          1,
          `Failed to parse auth tokens validity response: ${invalidJson}`,
        );
      },
    );
  });
});
