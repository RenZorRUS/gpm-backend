import { describe, test, expect } from '@jest/globals';
import { createValidateAuthTokensDto } from 'src/infrastructure/validators/__tests__/validator.test.utils';
import AuthMapper from 'src/infrastructure/mappers/auth.mapper';

describe('Class: AuthMapper', (): void => {
  describe('Method: serializeTokenValidityParams()', (): void => {
    test.concurrent.each([
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: false,
          isAccessTokenProvided: false,
        }),
        get expectedResult(): string {
          return '{}';
        },
      },
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: true,
          isAccessTokenProvided: false,
        }),
        get expectedResult(): string {
          return `{"refreshToken":"${this.dto!.refreshToken}"}`;
        },
      },
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: false,
          isAccessTokenProvided: true,
        }),
        get expectedResult(): string {
          return `{"accessToken":"${this.dto!.accessToken}"}`;
        },
      },
      {
        dto: createValidateAuthTokensDto(),
        get expectedResult(): string {
          return `{"refreshToken":"${this.dto!.refreshToken}","accessToken":"${this.dto!.accessToken}"}`;
        },
      },
    ])(
      'For DTO: `$dto` should return the following string: `$expectedResult`',
      async ({ dto, expectedResult }): Promise<void> => {
        // Prepare
        const authMapper = new AuthMapper();

        // Perform
        const result = authMapper.serializeTokenValidityParams(dto);

        // Validate
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
