import { describe, test, expect } from '@jest/globals';
import NotFoundError from 'src/application/errors/not-found.error';
import ValidationError from 'src/application/errors/validation.error';
import {
  buildCreateUserDto,
  buildUserEntity,
  createUserRepositoryMock,
} from 'src/infrastructure/services/__tests__/services.test.utils';
import UserValidator from 'src/infrastructure/validators/user.validator';

describe('Class: UserValidator', (): void => {
  describe('Method: validateCreationDto()', (): void => {
    test.concurrent(
      'Create user DTO with non-existent email and phone should not raise an error',
      async (): Promise<void> => {
        // Prepare
        const createUserDto = buildCreateUserDto();
        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.findAsync.mockResolvedValue(null);
        userRepositoryMock.runQueriesInTransactionAsync.mockResolvedValue([
          null,
          null,
        ]);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> => userValidator.validateCreationDto(createUserDto),
        ).not.toThrow();

        // Validate
        expect(userRepositoryMock.findAsync).toHaveBeenCalledTimes(2);
        expect(
          userRepositoryMock.runQueriesInTransactionAsync,
        ).toHaveBeenCalledTimes(1);
      },
    );

    test.concurrent.each([
      {
        user: buildUserEntity({ isActive: false }),
        isUserWithEmail: true,
        error: new ValidationError('User with such email is inactive!'),
      },
      {
        error: new ValidationError('User with such email already exists!'),
        isUserWithEmail: true,
        user: buildUserEntity({
          isEmailVerified: true,
          isActive: true,
        }),
      },
      {
        isUserWithEmail: true,
        user: buildUserEntity({
          isEmailVerified: false,
          isActive: true,
        }),
        error: new ValidationError(
          'User with such email already exists and awaiting email confirmation!',
        ),
      },
      {
        user: buildUserEntity({ isActive: false }),
        isUserWithEmail: false,
        error: new ValidationError('User with such phone is inactive!'),
      },
      {
        isUserWithEmail: false,
        user: buildUserEntity({
          isPhoneVerified: true,
          isActive: true,
        }),
        error: new ValidationError('User with such phone already exists!'),
      },
      {
        isUserWithEmail: false,
        user: buildUserEntity({
          isPhoneVerified: false,
          isActive: true,
        }),
        error: new ValidationError(
          'User with such phone already exists and awaiting phone confirmation!',
        ),
      },
    ])(
      'For user with: `{ isActive: $user.isActive, isEmailVerified: $user.isEmailVerified,` ' +
        'isPhoneVerified: $user.isPhoneVerified } validator should throw validation error: `$error.message`',
      async ({ user, isUserWithEmail, error }): Promise<void> => {
        // Prepare
        const createUserDto = buildCreateUserDto();

        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.findAsync.mockResolvedValue(null);
        userRepositoryMock.runQueriesInTransactionAsync.mockResolvedValue([
          isUserWithEmail ? user : null,
          isUserWithEmail ? null : user,
        ]);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> => userValidator.validateCreationDto(createUserDto),
        ).rejects.toThrowError(error);

        // Validate
        expect(userRepositoryMock.findAsync).toHaveBeenCalledTimes(2);
        expect(
          userRepositoryMock.runQueriesInTransactionAsync,
        ).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('Method: validateUpdateDto()', (): void => {
    test.concurrent(
      'Should throw not found error if user with ID is not found',
      async (): Promise<void> => {
        // Prepare
        const userId = 1n;
        const createUserDto = buildCreateUserDto();
        const expectedError = new NotFoundError(
          `User with ID: ${userId} not found!`,
        );

        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(false);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.validateUpdateDto(userId, createUserDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: userId,
        });
      },
    );

    test.concurrent.each([
      {
        user: buildUserEntity({ id: 0n, isActive: false }),
        isUserWithEmail: true,
        error: new ValidationError('User with such email is inactive!'),
      },
      {
        error: new ValidationError('User with such email already exists!'),
        isUserWithEmail: true,
        user: buildUserEntity({
          id: 0n,
          isEmailVerified: true,
          isActive: true,
        }),
      },
      {
        isUserWithEmail: true,
        user: buildUserEntity({
          id: 0n,
          isEmailVerified: false,
          isActive: true,
        }),
        error: new ValidationError(
          'User with such email already exists and awaiting email confirmation!',
        ),
      },
      {
        user: buildUserEntity({ id: 0n, isActive: false }),
        isUserWithEmail: false,
        error: new ValidationError('User with such phone is inactive!'),
      },
      {
        isUserWithEmail: false,
        user: buildUserEntity({
          id: 0n,
          isPhoneVerified: true,
          isActive: true,
        }),
        error: new ValidationError('User with such phone already exists!'),
      },
      {
        isUserWithEmail: false,
        user: buildUserEntity({
          id: 0n,
          isPhoneVerified: false,
          isActive: true,
        }),
        error: new ValidationError(
          'User with such phone already exists and awaiting phone confirmation!',
        ),
      },
    ])(
      'For user with: `{ isActive: $user.isActive, isEmailVerified: $user.isEmailVerified,` ' +
        'isPhoneVerified: $user.isPhoneVerified } validator should throw validation error: `$error.message`',
      async ({ user, isUserWithEmail, error }): Promise<void> => {
        // Prepare
        const userId = 1n;
        const createUserDto = buildCreateUserDto();

        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(true);
        userRepositoryMock.findAsync.mockResolvedValue(null);
        userRepositoryMock.runQueriesInTransactionAsync.mockResolvedValue([
          isUserWithEmail ? user : null,
          isUserWithEmail ? null : user,
        ]);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.validateUpdateDto(userId, createUserDto),
        ).rejects.toThrowError(error);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: userId,
        });
        expect(userRepositoryMock.findAsync).toHaveBeenCalledTimes(2);
        expect(
          userRepositoryMock.runQueriesInTransactionAsync,
        ).toHaveBeenCalledTimes(1);
      },
    );
  });

  describe('Method: checkUserExistenceByIdAsync()', (): void => {
    test.concurrent(
      'Should not throw a not found error if user with the passed ID exists',
      async (): Promise<void> => {
        // Prepare
        const userId = 1n;
        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(true);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.checkUserExistenceByIdAsync(userId),
        ).not.toThrow();

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: userId,
        });
      },
    );

    test.concurrent(
      'Should throw a not found error for non-existent user ID',
      async (): Promise<void> => {
        // Prepare
        const userId = 1n;
        const userRepositoryMock = createUserRepositoryMock();
        const expectedError = new NotFoundError(
          `User with ID: ${userId} not found!`,
        );

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(false);

        const userValidator = new UserValidator(userRepositoryMock);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.checkUserExistenceByIdAsync(userId),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: userId,
        });
      },
    );
  });
});
