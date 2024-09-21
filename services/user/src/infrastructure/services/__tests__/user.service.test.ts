import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IUserDto } from 'src/application/dtos/users';
import type { IUserValidator } from 'src/application/validators/user.validator';
import { describe, test, expect } from '@jest/globals';
import UserService from 'src/infrastructure/services/user.service';
import NotFoundError from 'src/application/errors/not-found.error';
import {
  buildCreateUserDto,
  buildUserEntity,
  createEmailPublisherMock,
  createUserMapperMock,
  createUserRepositoryMock,
  createUserValidatorMock,
} from 'src/infrastructure/services/__tests__/services.test.utils';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import CryptoService from 'src/infrastructure/services/crypto.service';
import EmailMapper from 'src/infrastructure/mappers/email.mapper';
import { createEnvConfig } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';

describe('Class UserService', (): void => {
  const EMPTY_OBJECT = {};
  const USER_ID = 1n;

  const userEntity = buildUserEntity();
  const envConfig = createEnvConfig();

  const cryptoService = new CryptoService();
  const emailMapper = new EmailMapper();
  const userMapper = new UserMapper(cryptoService, envConfig);

  const emailVerificationMessage =
    emailMapper.mapUserToEmailVerificationMessage(userEntity);

  describe('Method: findByAsync()', (): void => {
    test.concurrent('Should find user by ID', async (): Promise<void> => {
      // Prepare
      const userRepositoryMock = createUserRepositoryMock();

      userRepositoryMock.findOrThrowAsync.mockResolvedValueOnce(userEntity);

      const userService = new UserService(
        EMPTY_OBJECT as IEmailPublisher,
        emailMapper,
        userRepositoryMock,
        EMPTY_OBJECT as IUserMapper,
        EMPTY_OBJECT as IUserValidator,
      );

      // Perform
      const result = await userService.findByAsync({
        id: userEntity.id,
      });

      // Validate
      expect(userRepositoryMock.findOrThrowAsync).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userEntity);
    });
  });

  describe('Method: findManyByAsync()', (): void => {
    test.concurrent.each([
      [
        { limit: 5, offset: 0 },
        { limit: 5, offset: 0, total: 0, data: [] },
      ],
      [
        { limit: 10, offset: 5 },
        { limit: 10, offset: 5, total: 0, data: [] },
      ],
    ])(
      'For options: `%o`, result should be: `%j`',
      async (input, expectedOutput): Promise<void> => {
        // Prepare
        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.findManyAsync.mockResolvedValueOnce({
          data: expectedOutput.data,
          total: expectedOutput.total,
        });

        const userService = new UserService(
          EMPTY_OBJECT as IEmailPublisher,
          emailMapper,
          userRepositoryMock,
          EMPTY_OBJECT as IUserMapper,
          EMPTY_OBJECT as IUserValidator,
        );

        // Perform
        const result = await userService.findManyByAsync(input);

        // Validate
        expect(userRepositoryMock.findManyAsync).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedOutput);
      },
    );
  });

  describe('Method: findByIdAsync()', (): void => {
    test.concurrent.each([
      [USER_ID, userEntity],
      [2n, userEntity],
    ])(
      'For user ID: `%d`, result should be: `%o`',
      async (input, expectedOutput): Promise<void> => {
        // Prepare
        const userRepositoryMock = createUserRepositoryMock();

        userRepositoryMock.findOrThrowAsync.mockResolvedValueOnce(
          expectedOutput,
        );

        const userService = new UserService(
          EMPTY_OBJECT as IEmailPublisher,
          emailMapper,
          userRepositoryMock,
          EMPTY_OBJECT as IUserMapper,
          EMPTY_OBJECT as IUserValidator,
        );

        // Perform
        const result = await userService.findByIdAsync(input as bigint);

        // Validate
        expect(userRepositoryMock.findOrThrowAsync).toHaveBeenCalledTimes(1);
        expect(result).toEqual(expectedOutput);
      },
    );
  });

  describe('Method: updateByIdAsync()', (): void => {
    test.concurrent(
      'Should throw a not found error if user with the passed user ID is not found',
      async (): Promise<void> => {
        // Prepare
        const expectedError = new NotFoundError(
          `User with ID: ${USER_ID} not found!`,
        );

        const userValidatorMock = createUserValidatorMock();

        userValidatorMock.validateUpdateDto.mockRejectedValueOnce(
          expectedError,
        );

        const userService = new UserService(
          EMPTY_OBJECT as IEmailPublisher,
          emailMapper,
          EMPTY_OBJECT as IUserRepository,
          EMPTY_OBJECT as IUserMapper,
          userValidatorMock,
        );

        // Perform
        expect(
          (): Promise<IUserDto> =>
            userService.updateByIdAsync(USER_ID, userEntity),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userValidatorMock.validateUpdateDto).toHaveBeenCalledTimes(1);
      },
    );

    test.concurrent(
      'Should return updated User entity by ID',
      async (): Promise<void> => {
        // Prepare
        const userValidatorMock = createUserValidatorMock();
        const userRepositoryMock = createUserRepositoryMock();

        userValidatorMock.validateUpdateDto.mockResolvedValueOnce();
        userRepositoryMock.updateAsync.mockResolvedValueOnce(userEntity);

        const userService = new UserService(
          EMPTY_OBJECT as IEmailPublisher,
          emailMapper,
          userRepositoryMock,
          EMPTY_OBJECT as IUserMapper,
          userValidatorMock,
        );

        // Perform
        const result = await userService.updateByIdAsync(1n, userEntity);

        // Validate
        expect(userValidatorMock.validateUpdateDto).toHaveBeenCalledTimes(1);
        expect(userRepositoryMock.updateAsync).toHaveBeenCalledTimes(1);
        expect(result).toEqual(userEntity);
      },
    );
  });

  describe('Method: deleteByIdAsync()', (): void => {
    test.concurrent('Should delete user by ID', async (): Promise<void> => {
      // Prepare
      const userValidatorMock = createUserValidatorMock();
      const userRepositoryMock = createUserRepositoryMock();

      userValidatorMock.checkUserExistenceByIdAsync.mockResolvedValueOnce();
      userRepositoryMock.deleteAsync.mockResolvedValueOnce();

      const userService = new UserService(
        EMPTY_OBJECT as IEmailPublisher,
        emailMapper,
        userRepositoryMock,
        EMPTY_OBJECT as IUserMapper,
        userValidatorMock,
      );

      // Perform
      await userService.deleteByIdAsync(USER_ID);

      // Validate
      expect(
        userValidatorMock.checkUserExistenceByIdAsync,
      ).toHaveBeenNthCalledWith(1, USER_ID);
      expect(userRepositoryMock.deleteAsync).toHaveBeenNthCalledWith(1, {
        id: USER_ID,
      });
    });
  });

  describe('Method: createAsync()', (): void => {
    test.concurrent(
      'Should return created User entity',
      async (): Promise<void> => {
        // Prepare
        const createUserDto = buildCreateUserDto();
        const userCreateInput = await userMapper.mapToCreateDto(createUserDto);

        const userRepositoryMock = createUserRepositoryMock();
        const emailPublisherMock = createEmailPublisherMock();
        const userValidatorMock = createUserValidatorMock();
        const userMapperMock = createUserMapperMock();

        userValidatorMock.validateCreationDto.mockResolvedValueOnce();
        userMapperMock.mapToCreateDto.mockResolvedValueOnce(userCreateInput);
        userRepositoryMock.createAsync.mockResolvedValueOnce(userEntity);
        emailPublisherMock.publishVerificationEmailAsync.mockResolvedValueOnce();

        const userService = new UserService(
          emailPublisherMock,
          emailMapper,
          userRepositoryMock,
          userMapperMock,
          userValidatorMock,
        );

        // Perform
        const result = await userService.createAsync(createUserDto);

        // Validate
        expect(result).toEqual(userEntity);
        expect(userValidatorMock.validateCreationDto).toHaveBeenNthCalledWith(
          1,
          createUserDto,
        );
        expect(userMapperMock.mapToCreateDto).toHaveBeenNthCalledWith(
          1,
          createUserDto,
        );
        expect(userRepositoryMock.createAsync).toHaveBeenCalledTimes(1);
        expect(
          emailPublisherMock.publishVerificationEmailAsync,
        ).toHaveBeenCalledTimes(1);
        expect(
          emailPublisherMock.publishVerificationEmailAsync,
        ).toHaveBeenNthCalledWith(1, emailVerificationMessage);
      },
    );
  });
});
