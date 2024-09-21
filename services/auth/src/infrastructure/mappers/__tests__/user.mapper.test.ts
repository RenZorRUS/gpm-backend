import { describe, test, expect } from '@jest/globals';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import UserMapper from 'src/infrastructure/mappers/user.mapper';

describe('Class: UserMapper', (): void => {
  const userMapper = new UserMapper();

  describe('Method: serializeUserDto()', (): void => {
    test.concurrent.each([
      {
        user: buildUserDto(),
        get expectedOutput(): string {
          return JSON.stringify(this.user);
        },
      },
      {
        user: buildUserDto(),
        get expectedOutput(): string {
          return JSON.stringify(this.user);
        },
      },
    ])(
      'Should serialize user DTO: `$user` into the `$expectedOutput`',
      async ({ user, expectedOutput }): Promise<void> => {
        // Perform
        const serializedUser = userMapper.serializeUserDto(user);

        // Validate
        expect(serializedUser).toEqual(expectedOutput);
      },
    );
  });
});
