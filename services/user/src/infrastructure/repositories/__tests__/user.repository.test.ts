import type { Prisma, User } from '@prisma/client';
import { describe, expect, test } from '@jest/globals';
import { buildUserEntity } from 'src/infrastructure/services/__tests__/services.test.utils';
import UserRepository from 'src/infrastructure/repositories/user.repository';
import { createPrismaClientMock } from 'src/infrastructure/repositories/__tests__/repository.test.utils';
import { objectToPropsString } from 'src/infrastructure/utilities/converters';
import NotFoundError from 'src/application/errors/not-found.error';

describe('Class: UserRepository', (): void => {
  const DEFAULT_FIND_OPTIONS = {
    where: { id: 1n },
  };

  const userEntity = buildUserEntity();

  describe('Method: findAsync()', (): void => {
    test.concurrent.each([buildUserEntity(), null])(
      'Should return found User entity, otherwise `null`',
      async (input): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.findFirst.mockResolvedValueOnce(input);

        // Perform
        const result = await userRepository.findAsync(DEFAULT_FIND_OPTIONS);

        // Validate
        expect(result).toEqual(input);
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
      },
    );
  });

  describe('Method: findOrThrowAsync()', (): void => {
    test.concurrent(
      'Should return found User entity without throwing a not found error',
      async (): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.findFirst.mockResolvedValueOnce(userEntity);

        // Perform
        const result =
          await userRepository.findOrThrowAsync(DEFAULT_FIND_OPTIONS);

        // Validate
        expect(result).toEqual(userEntity);
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
      },
    );

    test.concurrent(
      'Should throw a not found error for non-existent user',
      async (): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);
        const expectedError = new NotFoundError(
          `User matching: ${objectToPropsString(DEFAULT_FIND_OPTIONS.where)} not found!`,
        );

        prismaMocked.user.findFirst.mockResolvedValueOnce(null);

        // Perform
        await expect(
          (): Promise<User> =>
            userRepository.findOrThrowAsync(DEFAULT_FIND_OPTIONS),
        ).rejects.toThrowError(expectedError);

        // Verify
        expect(prismaMocked.user.findFirst).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
      },
    );
  });

  describe('Method: findManyAsync()', (): void => {
    test.concurrent.each([
      { ...DEFAULT_FIND_OPTIONS, select: { id: true }, offset: 0, limit: 10 },
      {
        ...DEFAULT_FIND_OPTIONS,
        select: { isActive: true },
        offset: 10,
        limit: 10,
      },
    ])(
      'Should return found User entities with options: ' +
        '{ where: $where, select: $select, skip: $skip, limit: $limit }',
      async (options): Promise<void> => {
        // Prepare
        const prismaMock = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMock);
        const foundUsers = [userEntity, userEntity];

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
          select: options.select,
          where: options.where,
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
        const result = await userRepository.countByAsync(
          DEFAULT_FIND_OPTIONS.where,
        );

        // Validate
        expect(result).toEqual(input);
        expect(prismaMocked.user.count).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
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

        prismaMocked.user.count.mockResolvedValueOnce(count);

        // Perform
        const result = await userRepository.checkExistsAsync(
          DEFAULT_FIND_OPTIONS.where,
        );

        // Validate
        expect(result).toEqual(expectedResult);
        expect(prismaMocked.user.count).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
      },
    );
  });

  describe('Method: deleteAsync()', (): void => {
    test.concurrent(
      'Should delete user entities found by ID',
      async (): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.delete.mockResolvedValueOnce(userEntity);

        // Perform
        await userRepository.deleteAsync(DEFAULT_FIND_OPTIONS.where);

        // Validate
        expect(prismaMocked.user.delete).toHaveBeenNthCalledWith(
          1,
          DEFAULT_FIND_OPTIONS,
        );
      },
    );
  });

  describe('Method: updateAsync()', (): void => {
    test.concurrent.each([10, 15])(
      'Should update User entities with the passed data found by ID: %i',
      async (input): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.update.mockResolvedValueOnce(userEntity);

        // Perform
        const updateOptions = { where: { id: input }, data: userEntity };
        const result = await userRepository.updateAsync(updateOptions);

        // Validate
        expect(result).toEqual(userEntity);
        expect(prismaMocked.user.update).toHaveBeenNthCalledWith(
          1,
          updateOptions,
        );
      },
    );
  });

  describe('Method: createAsync()', (): void => {
    test.concurrent(
      'Should create user entity with the passed data',
      async (): Promise<void> => {
        // Prepare
        const prismaMocked = createPrismaClientMock();
        const userRepository = new UserRepository(prismaMocked);

        prismaMocked.user.create.mockResolvedValueOnce(userEntity);

        // Perform
        const creationOptions = { data: userEntity };
        const result = await userRepository.createAsync(creationOptions);

        // Validate
        expect(result).toEqual(userEntity);
        expect(prismaMocked.user.create).toHaveBeenNthCalledWith(
          1,
          creationOptions,
        );
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
