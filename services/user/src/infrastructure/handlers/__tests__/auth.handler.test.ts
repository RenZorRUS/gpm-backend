import { describe, expect, test } from '@jest/globals';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import { AUTH_ERROR } from 'src/domain/constants/errors';
import { createAuthServiceMock } from 'src/infrastructure/services/__tests__/services.test.utils';
import { createRequestMock } from 'src/infrastructure/handlers/__tests__/handler.test.utils';
import AuthHandler from 'src/infrastructure/handlers/auth.handler';

describe('Class: AuthHandler', (): void => {
  describe('Method: checkBearerTokenAsync()', (): void => {
    test.concurrent.each([
      {
        authHeader: undefined,
        error: new UnauthorizedError(AUTH_ERROR.AUTH_HEADER_REQUIRED),
      },
      {
        authHeader: 'token',
        error: new UnauthorizedError(AUTH_ERROR.BEARER_TOKEN_REQUIRED),
      },
      {
        authHeader: 'Bearer token',
        error: new UnauthorizedError(AUTH_ERROR.AUTH_JWT_TOKEN_REQUIRED),
      },
    ])(
      'For auth header `$authHeader` should return an unauthorized error: `$error.message`',
      async ({ authHeader, error }): Promise<void> => {
        // Prepare
        const authServiceMock = createAuthServiceMock();
        const authHandler = new AuthHandler(authServiceMock);
        const requestMock = createRequestMock({
          headers: { authorization: authHeader },
        });

        // Perform & Validate
        await expect(
          (): Promise<void> => authHandler.checkBearerTokenAsync(requestMock),
        ).rejects.toThrowError(error);
      },
    );

    test.concurrent(
      'Should not thrown an unauthorized error for valid JWT token',
      async (): Promise<void> => {
        // Prepare
        const validJwtToken =
          'eyJhbGciOiJIUZI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi0iIxMjMONTY30DkwIiwibmF' +
          'tZSI6IkpvaG4gRG91IiwiaXNTb2NpYWwiOnRydWV9.4pcPyMD09o1PSyXnrXCjTwXyr4BsezdI1AVTmud2fU4';

        const authServiceMock = createAuthServiceMock();
        const authHandler = new AuthHandler(authServiceMock);
        const requestMock = createRequestMock({
          headers: { authorization: `Bearer ${validJwtToken}` },
        });

        authServiceMock.validateAuthTokensOrThrowAsync.mockResolvedValueOnce();

        // Perform
        await authHandler.checkBearerTokenAsync(requestMock);

        // Validate
        expect(
          authServiceMock.validateAuthTokensOrThrowAsync,
        ).toHaveBeenNthCalledWith(1, { accessToken: validJwtToken });
      },
    );
  });
});
