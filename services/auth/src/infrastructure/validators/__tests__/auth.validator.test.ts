import { describe, expect, test } from '@jest/globals';
import ValidationError from 'src/application/errors/validation.error';
import { AUTH_ERROR } from 'src/domain/constants/errors';
import AuthValidator from 'src/infrastructure/validators/auth.validator';
import { fakerEN_US } from '@faker-js/faker';

describe('Class: AuthValidator', (): void => {
  const phone = fakerEN_US.phone.number({ style: 'international' });
  const password = fakerEN_US.internet.password();
  const email = fakerEN_US.internet.email();

  const authValidator = new AuthValidator();

  describe('Method: checkAuthTokensOrThrow()', (): void => {
    test.concurrent(
      'Should throw a validation error if authorization tokens are missing',
      async (): Promise<void> => {
        // Prepare
        const emptyDto = {};
        const expectedError = new ValidationError(
          AUTH_ERROR.ACCESS_OR_REFRESH_TOKENS_REQUIRED,
        );

        // Perform & Validate
        expect((): void =>
          authValidator.checkAuthTokensOrThrow(emptyDto),
        ).toThrowError(expectedError);
      },
    );
  });

  describe('Method: checkLoginDtoOrThrow()', (): void => {
    test.concurrent.each([
      {
        dto: {
          password,
          email,
          phone,
        },
        expectedError: new ValidationError(AUTH_ERROR.ONLY_EMAIL_OR_PHONE),
      },
      {
        dto: {
          password,
        },
        expectedError: new ValidationError(AUTH_ERROR.EMAIL_OR_PHONE_REQUIRED),
      },
    ])(
      'Should throw a validation error: `$expectedError.message` in case of $dto',
      async ({ dto, expectedError }): Promise<void> => {
        // Perform & Validate
        expect((): void =>
          authValidator.checkLoginDtoOrThrow(dto),
        ).toThrowError(expectedError);
      },
    );

    test.concurrent.each([
      {
        password,
        email,
      },
      {
        password,
        phone,
      },
    ])(
      'Should not throw an error in case of a valid login DTO',
      async (dto): Promise<void> => {
        // Perform & Validate
        expect((): void =>
          authValidator.checkLoginDtoOrThrow(dto),
        ).not.toThrow();
      },
    );
  });
});
