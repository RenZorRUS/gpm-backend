import { describe, test, expect } from '@jest/globals';
import AuthValidator from 'src/infrastructure/validators/auth.validator';
import {
  createValidateAuthTokensDto,
  createValidateAuthTokensResponse,
} from 'src/infrastructure/validators/__tests__/validator.test.utils';
import UnauthorizedError from 'src/application/errors/unauthorized.error';

describe('Class: AuthValidator', (): void => {
  const authTokensValidityResponse = createValidateAuthTokensResponse();
  const authTokensDto = createValidateAuthTokensDto();

  const authValidator = new AuthValidator();

  describe('Method: validateAuthTokensResponse()', (): void => {
    test.concurrent(
      'Should not throw an unauthorized error if auth tokens are valid',
      async (): Promise<void> => {
        // Perform & Validate
        expect((): void =>
          authValidator.validateAuthTokensResponse(
            authTokensDto,
            authTokensValidityResponse,
          ),
        ).not.toThrow();
      },
    );

    test.concurrent.each([
      {
        dto: createValidateAuthTokensDto({ isRefreshTokenProvided: false }),
        response: createValidateAuthTokensResponse({
          isAccessTokenExpired: true,
          isAccessTokenValid: false,
        }),
        error: new UnauthorizedError(
          'Access token is expired!\nAccess token is invalid!',
        ),
      },
      {
        dto: createValidateAuthTokensDto({ isAccessTokenProvided: false }),
        response: createValidateAuthTokensResponse({
          isRefreshTokenExpired: true,
          isRefreshTokenValid: false,
        }),
        error: new UnauthorizedError(
          'Refresh token is expired!\nRefresh token is invalid!',
        ),
      },
      {
        dto: authTokensDto,
        response: createValidateAuthTokensResponse({
          isRefreshTokenExpired: true,
          isRefreshTokenValid: false,
          isAccessTokenExpired: true,
          isAccessTokenValid: false,
        }),
        error: new UnauthorizedError(
          'Access token is expired!\nAccess token is invalid!\nRefresh token is expired!\nRefresh token is invalid!',
        ),
      },
    ])(
      'For auth tokens DTO: `$dto` and response: `{ accessToken: $response.accessToken, ' +
        'refreshToken: $response.refreshToken }` should throw the following error: `$error.message`',
      async ({ dto, response, error }): Promise<void> => {
        // Perform & Validate
        expect((): void =>
          authValidator.validateAuthTokensResponse(dto, response),
        ).toThrowError(error);
      },
    );
  });
});
