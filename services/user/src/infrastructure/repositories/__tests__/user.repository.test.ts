import { describe, expect, test } from '@jest/globals';
import { buildUserEntity } from 'src/infrastructure/services/__tests__/services.test.utils';
import UserRepository from 'src/infrastructure/repositories/user.repository';
import { createPrismaClientMock } from 'src/infrastructure/repositories/__tests__/repository.test.utils';
import { objectToPropsString } from 'src/infrastructure/utilities/converters';
import NotFoundError from 'src/application/errors/not-found.error';
import type { Prisma, User } from '@prisma/client';

describe('Class: UserRepository', (): void => {
  describe('Method: findAsync()', (): void => {
    test.concurrent.each([buildUserEntity(), null])(
      'Should return found User entity, otherwise `null`',
      async (input): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.findFirst.mockResolvedValueOnce(input);

        // Perform
        const findOptions = { where: { id: 1n } };
        const result = await userRepository.findAsync(findOptions);

        // Validate
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          findOptions,
        );
        expect(result).toEqual(input);
      },
    );
  });

  describe('Method: findOrThrowAsync()', (): void => {
    test.concurrent(
      'Should return found User entity without throwing a not found error',
      async (): Promise<void> => {
        // Prepare
        const userEntity = buildUserEntity();
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.findFirst.mockResolvedValueOnce(userEntity);

        // Perform
        const findOptions = { where: { id: 1n } };
        const result = await userRepository.findOrThrowAsync(findOptions);

        // Validate
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          findOptions,
        );
        expect(result).toEqual(userEntity);
      },
    );

    test.concurrent(
      'Should throw a not found error for non-existent user',
      async (): Promise<void> => {
        // Prepare
        const findOptions = { where: { id: 1n } };
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);
        const expectedError = new NotFoundError(
          `User matching: ${objectToPropsString(findOptions.where)} not found!`,
        );

        prismaMocked.user.findFirst.mockResolvedValueOnce(null);

        // Perform
        await expect(
          (): Promise<User> => userRepository.findOrThrowAsync(findOptions),
        ).rejects.toThrowError(expectedError);

        // Verify
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          findOptions,
        );
      },
    );
  });

  describe('Method: findManyAsync()', (): void => {
    test.concurrent.each([
      { where: { id: 1n }, select: { id: true }, offset: 0, limit: 10 },
      { where: { id: 2n }, select: { isActive: true }, offset: 10, limit: 10 },
    ])(
      'Should return found User entities with options: ' +
        '{ where: $where, select: $select, skip: $skip, limit: $limit }',
      async (options): Promise<void> => {
        // Prepare
        const prismaMock = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMock);
        const foundUsers = [buildUserEntity(), buildUserEntity()];

        prismaMock.user.findMany.mockResolvedValueOnce(foundUsers);
        prismaMock.user.count.mockResolvedValueOnce(foundUsers.length);
        prismaMock.$transaction.mockResolvedValueOnce([
          foundUsers,
          foundUsers.length,
        ]);

        // Perform
        const result = await userRepository.findManyAsync(options);

        // Validate
        expect(prismaMock.user.findMany).toHaveBeenNthCalledWith(1, {
          where: options.where,
          select: options.select,
          skip: options.offset,
          take: options.limit,
        });
        expect(prismaMock.user.count).toHaveBeenNthCalledWith(1, {
          where: options.where,
        });
        expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
        expect(result.data).toEqual(foundUsers);
        expect(result.total).toEqual(foundUsers.length);
      },
    );
  });

  describe('Method: countByAsync()', (): void => {
    test.concurrent.each([10, 15])(
      'Should return count of found User entities',
      async (input): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.count.mockResolvedValueOnce(input);

        // Perform
        const findOptions = { id: 1n };
        const result = await userRepository.countByAsync(findOptions);

        // Validate
        expect(prismaMocked.user.count).toHaveBeenNthCalledWith(1, {
          where: findOptions,
        });
        expect(result).toEqual(input);
      },
    );
  });

  describe('Method: checkExistsAsync()', (): void => {
    test.concurrent.each([
      { count: 0, expectedResult: false },
      { count: 1, expectedResult: true },
    ])(
      'Should return: $expectedResult for the count: $count',
      async ({ count, expectedResult }): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);
        const findOptions = { id: 1n };

        prismaMocked.user.count.mockResolvedValueOnce(count);

        // Perform
        const result = await userRepository.checkExistsAsync(findOptions);

        // Validate
        expect(prismaMocked.user.count).toHaveBeenNthCalledWith(1, {
          where: findOptions,
        });
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('Method: deleteAsync()', (): void => {
    test.concurrent.each([10, 15])(
      'Should delete User entities found by ID: %i',
      async (input): Promise<void> => {
        // Prepare
        const deletedUser = buildUserEntity();
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.delete.mockResolvedValueOnce(deletedUser);

        // Perform
        const findOptions = { id: input };
        await userRepository.deleteAsync(findOptions);

        // Validate
        expect(prismaMocked.user.delete).toHaveBeenNthCalledWith(1, {
          where: findOptions,
        });
      },
    );
  });

  describe('Method: updateAsync()', (): void => {
    test.concurrent.each([10, 15])(
      'Should update User entities with the passed data found by ID: %i',
      async (input): Promise<void> => {
        // Prepare
        const updateUserDto = buildUserEntity();
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.update.mockResolvedValueOnce(updateUserDto);

        // Perform
        const updateOptions = { where: { id: input }, data: updateUserDto };
        const result = await userRepository.updateAsync(updateOptions);

        // Validate
        expect(prismaMocked.user.update).toHaveBeenNthCalledWith(
          1,
          updateOptions,
        );
        expect(result).toEqual(updateUserDto);
      },
    );
  });

  describe('Method: createAsync()', (): void => {
    test.concurrent.each([buildUserEntity(), buildUserEntity()])(
      'Should create User entity with the passed data',
      async (input): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.create.mockResolvedValueOnce(input);

        // Perform
        const creationOptions = { data: input };
        const result = await userRepository.createAsync(creationOptions);

        // Validate
        expect(prismaMocked.user.create).toHaveBeenNthCalledWith(
          1,
          creationOptions,
        );
        expect(result).toEqual(input);
      },
    );
  });

  describe('Getter: runQueriesInTransactionAsync()', (): void => {
    test.concurrent(
      'Should return Prisma Client transaction method',
      async (): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);
        const transactionQueries: Prisma.PrismaPromise<User>[] = [];
        const transactionResult: User[] = [];

        prismaMocked.$transaction.mockResolvedValueOnce(transactionResult);

        // Perform
        const result =
          await userRepository.runQueriesInTransactionAsync(transactionQueries);

        // Validate
        expect(prismaMocked.$transaction).toHaveBeenNthCalledWith(
          1,
          transactionQueries,
        );
        expect(result).toEqual(transactionResult);
      },
    );
  });
});
