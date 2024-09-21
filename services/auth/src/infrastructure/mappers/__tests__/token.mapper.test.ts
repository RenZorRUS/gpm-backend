import { describe, test, expect } from '@jest/globals';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import TokenMapper from 'src/infrastructure/mappers/token.mapper';

describe('Class: TokenMapper', (): void => {
  const tokenMapper = new TokenMapper();
  const userDto = buildUserDto();

  describe('Method: mapUserToPayload()', (): void => {
    test.concurrent.each([TOKEN_TYPE.ACCESS, TOKEN_TYPE.REFRESH])(
      'Should map user DTO to the $tokenType token payload',
      async (tokenType): Promise<void> => {
        // Perform
        const payload = tokenMapper.mapUserToPayload(tokenType, userDto);

        // Validate
        expect(payload).toEqual({
          sub: userDto.email,
          userId: userDto.id,
          type: tokenType,
        });
      },
    );
  });
});
