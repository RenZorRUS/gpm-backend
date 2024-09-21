import { describe, expect, test } from '@jest/globals';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import { createEnvConfig } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';
import {
  buildCreateUserDto,
  createCryptoServiceMock,
} from 'src/infrastructure/services/__tests__/services.test.utils';

describe('Class: UserMapper', (): void => {
  describe('Method: mapToCreateDto()', (): void => {
    test.concurrent(
      'Should map create user DTO to user entity data',
      async (): Promise<void> => {
        // Prepare
        const cryptoServiceMock = createCryptoServiceMock();
        const createUserDto = buildCreateUserDto();
        const envConfig = createEnvConfig();
        const userMapper = new UserMapper(cryptoServiceMock, envConfig);

        cryptoServiceMock.hashPassword.mockResolvedValueOnce(
          createUserDto.password,
        );
        cryptoServiceMock.generateVerificationToken.mockReturnValueOnce(
          createUserDto.password,
        );

        // Perform
        const result = await userMapper.mapToCreateDto(createUserDto);

        // Validate
        expect(result).toEqual({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          middleName: createUserDto.middleName,
          passwordHash: createUserDto.password,
          email: createUserDto.email,
          phone: createUserDto.phone,
          gender: createUserDto.gender,
          dateOfBirth: createUserDto.dateOfBirth,
          emailActivationToken: createUserDto.password,
          emailActivationTokenExpiration: result.emailActivationTokenExpiration,
        });
      },
    );
  });
});
