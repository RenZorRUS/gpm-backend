import { describe, test, expect } from '@jest/globals';
import { createValidateAuthTokensDto } from 'src/infrastructure/validators/__tests__/validator.test.utils';
import AuthMapper from 'src/infrastructure/mappers/auth.mapper';

describe('Class: AuthMapper', (): void => {
  const authMapper = new AuthMapper();

  describe('Method: serializeTokenValidityParams()', (): void => {
    test.concurrent.each([
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: false,
          isAccessTokenProvided: false,
        }),
        get expectedResult(): string {
          return JSON.stringify(this.dto);
        },
      },
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: true,
          isAccessTokenProvided: false,
        }),
        get expectedResult(): string {
          return JSON.stringify(this.dto);
        },
      },
      {
        dto: createValidateAuthTokensDto({
          isRefreshTokenProvided: false,
          isAccessTokenProvided: true,
        }),
        get expectedResult(): string {
          return JSON.stringify(this.dto);
        },
      },
      {
        dto: createValidateAuthTokensDto(),
        get expectedResult(): string {
          return JSON.stringify(this.dto);
        },
      },
    ])(
      'For DTO: `$dto` should return the following string: `$expectedResult`',
      async ({ dto, expectedResult }): Promise<void> => {
        // Perform
        const result = authMapper.serializeAuthTokenValidityDto(dto);

        // Validate
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
