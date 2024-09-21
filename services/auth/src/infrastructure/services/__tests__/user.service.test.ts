import type { ILogger } from 'src/application/loggers/logger';
import { describe, test, expect } from '@jest/globals';
import {
  createHttpClientMock,
  createLoggerMock,
} from 'src/infrastructure/clients/__tests__/client.test.utils';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import { HTTP_HEADER, MIME_TYPE } from 'src/domain/constants/http';
import UserService from 'src/infrastructure/services/user.service';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import type { IUserDto } from 'src/application/dtos/users';
import { USER_ERROR } from 'src/domain/constants/errors';
import InternalServerError from 'src/application/errors/internal.server.error';
import NotFoundError from 'src/application/errors/not.found.error';

describe('Class: UserService', (): void => {
  const FIND_USER_BY_PATH = '/api/v1/users/find';
  const JSON_HEADERS = {
    [HTTP_HEADER.CONTENT_TYPE]: MIME_TYPE.JSON,
  };

  const userMapper = new UserMapper();
  const userDto = buildUserDto();
  const serializedUser = userMapper.serializeUserDto(userDto);

  describe('Method: findByOrThrowAsync()', (): void => {
    test.concurrent(
      'Should return user DTO without throwing an error',
      async (): Promise<void> => {
        // Prepare
        const userHttpClient = createHttpClientMock();
        const userService = new UserService(
          userHttpClient,
          userMapper,
          {} as ILogger,
        );

        userHttpClient.postAsync.mockResolvedValueOnce({
          data: userDto,
        });

        // Perform
        const user = await userService.findByOrThrowAsync(userDto);

        // Validate
        expect(user).toEqual(userDto);
        expect(userHttpClient.postAsync).toHaveBeenNthCalledWith(1, {
          path: FIND_USER_BY_PATH,
          headers: JSON_HEADERS,
          body: serializedUser,
        });
      },
    );

    test.concurrent(
      'Should throw an error if failed to parse response data',
      async (): Promise<void> => {
        const userHttpClient = createHttpClientMock();
        const loggerMock = createLoggerMock();
        const responseData = 'Not JSON data!';

        const expectedError = new InternalServerError(
          USER_ERROR.FAILED_TO_PARSE_USER,
        );
        const userService = new UserService(
          userHttpClient,
          userMapper,
          loggerMock,
        );

        loggerMock.error.mockReturnValueOnce();
        userHttpClient.postAsync.mockResolvedValueOnce({
          data: responseData,
        });

        // Perform
        await expect(
          (): Promise<IUserDto> => userService.findByOrThrowAsync(userDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userHttpClient.postAsync).toHaveBeenNthCalledWith(1, {
          path: FIND_USER_BY_PATH,
          headers: JSON_HEADERS,
          body: serializedUser,
        });
        expect(loggerMock.error).toHaveBeenNthCalledWith(
          1,
          `Failed to parse data: ${responseData} from POST: ${FIND_USER_BY_PATH}`,
        );
      },
    );

    test.concurrent(
      'Should throw an error if failed to send a request',
      async (): Promise<void> => {
        const userHttpClient = createHttpClientMock();
        const expectedError = new NotFoundError('User not found!');
        const userService = new UserService(
          userHttpClient,
          userMapper,
          {} as ILogger,
        );

        userHttpClient.postAsync.mockResolvedValueOnce({
          error: expectedError,
        });

        // Perform
        await expect(
          (): Promise<IUserDto> => userService.findByOrThrowAsync(userDto),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(userHttpClient.postAsync).toHaveBeenNthCalledWith(1, {
          path: FIND_USER_BY_PATH,
          headers: JSON_HEADERS,
          body: serializedUser,
        });
      },
    );
  });
});
