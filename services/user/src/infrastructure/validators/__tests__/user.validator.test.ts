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
  const SECOND_USER_ID = 2n;
  const USER_ID = 1n;

  const inactiveUser = buildUserEntity({ isActive: false });
  const createUserDto = buildCreateUserDto();

  describe('Method: validateCreationDto()', (): void => {
    test.concurrent(
      'Create user DTO with non-existent email and phone should not raise an error',
      async (): Promise<void> => {
        // Prepare
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
        error: new ValidationError('User with such email is inactive!'),
        isUserWithEmail: true,
        user: inactiveUser,
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
        error: new ValidationError('User with such phone is inactive!'),
        isUserWithEmail: false,
        user: inactiveUser,
      },
      {
        error: new ValidationError('User with such phone already exists!'),
        isUserWithEmail: false,
        user: buildUserEntity({
          isPhoneVerified: true,
          isActive: true,
        }),
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
        const userRepositoryMock = createUserRepositoryMock();
        const userValidator = new UserValidator(userRepositoryMock);

        userRepositoryMock.findAsync.mockResolvedValue(null);
        userRepositoryMock.runQueriesInTransactionAsync.mockResolvedValue([
          isUserWithEmail ? user : null,
          isUserWithEmail ? null : user,
        ]);

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
        const userRepositoryMock = createUserRepositoryMock();
        const userValidator = new UserValidator(userRepositoryMock);
        const expectedError = new NotFoundError(
          `User with ID: ${USER_ID} not found!`,
        );

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(false);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.validateUpdateDto(USER_ID, createUserDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: USER_ID,
        });
      },
    );

    test.concurrent.each([
      {
        error: new ValidationError('User with such email is inactive!'),
        isUserWithEmail: true,
        user: inactiveUser,
      },
      {
        error: new ValidationError('User with such email already exists!'),
        isUserWithEmail: true,
        user: buildUserEntity({
          isEmailVerified: true,
          id: SECOND_USER_ID,
          isActive: true,
        }),
      },
      {
        isUserWithEmail: true,
        user: buildUserEntity({
          isEmailVerified: false,
          id: SECOND_USER_ID,
          isActive: true,
        }),
        error: new ValidationError(
          'User with such email already exists and awaiting email confirmation!',
        ),
      },
      {
        error: new ValidationError('User with such phone is inactive!'),
        isUserWithEmail: false,
        user: inactiveUser,
      },
      {
        error: new ValidationError('User with such phone already exists!'),
        isUserWithEmail: false,
        user: buildUserEntity({
          isPhoneVerified: true,
          isActive: true,
          id: SECOND_USER_ID,
        }),
      },
      {
        isUserWithEmail: false,
        user: buildUserEntity({
          isPhoneVerified: false,
          id: SECOND_USER_ID,
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
        const userRepositoryMock = createUserRepositoryMock();
        const userValidator = new UserValidator(userRepositoryMock);

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(true);
        userRepositoryMock.findAsync.mockResolvedValue(null);
        userRepositoryMock.runQueriesInTransactionAsync.mockResolvedValue([
          isUserWithEmail ? user : null,
          isUserWithEmail ? null : user,
        ]);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.validateUpdateDto(USER_ID, createUserDto),
        ).rejects.toThrowError(error);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: USER_ID,
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
        const userRepositoryMock = createUserRepositoryMock();
        const userValidator = new UserValidator(userRepositoryMock);

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(true);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.checkUserExistenceByIdAsync(USER_ID),
        ).not.toThrow();

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: USER_ID,
        });
      },
    );

    test.concurrent(
      'Should throw a not found error for non-existent user ID',
      async (): Promise<void> => {
        // Prepare
        const userRepositoryMock = createUserRepositoryMock();
        const userValidator = new UserValidator(userRepositoryMock);
        const expectedError = new NotFoundError(
          `User with ID: ${USER_ID} not found!`,
        );

        userRepositoryMock.checkExistsAsync.mockResolvedValueOnce(false);

        // Perform
        await expect(
          (): Promise<void> =>
            userValidator.checkUserExistenceByIdAsync(USER_ID),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userRepositoryMock.checkExistsAsync).toHaveBeenNthCalledWith(1, {
          id: USER_ID,
        });
      },
    );
  });
});
