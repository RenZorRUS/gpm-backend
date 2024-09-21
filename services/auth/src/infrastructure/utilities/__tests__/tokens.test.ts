import type { IEnvConfig } from 'src/application/types/global';
import { afterAll, describe, test, expect } from '@jest/globals';
import { buildJwtTokenUtilsAsync } from 'src/infrastructure/utilities/tokens.utils';
import {
  buildEnvConfig,
  createTempEdDsaKeyPairAsync,
} from 'src/infrastructure/services/__tests__/services.test.utils';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import TokenMapper from 'src/infrastructure/mappers/token.mapper';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';
import type { IDecodedTokenPayload } from 'src/application/mappers/token.mapper';

describe('Function: buildJwtTokenUtilsAsync()', (): void => {
  const tokenMapper = new TokenMapper();
  const userDto = buildUserDto();

  let cleanupKeysAsync: () => Promise<void>;
  let baseEnvConfig: IEnvConfig;
  let privateKeyPath: string;
  let publicKeyPath: string;

  const prepareSharedDataTask = (async (): Promise<void> => {
    ({ privateKeyPath, publicKeyPath, cleanupKeysAsync } =
      await createTempEdDsaKeyPairAsync());

    baseEnvConfig = buildEnvConfig({
      JWT_PRIVATE_KEY_PATH: privateKeyPath,
      JWT_PUBLIC_KEY_PATH: publicKeyPath,
    });
  })();

  afterAll((): Promise<void> => cleanupKeysAsync());

  test.concurrent(
    'Should build JWT token utilities without throwing an error',
    async (): Promise<void> => {
      // Prepare
      await prepareSharedDataTask;

      // Perform
      const { createRefreshToken, createAccessToken, verifyToken } =
        await buildJwtTokenUtilsAsync(baseEnvConfig);

      // Validate
      const accessPayload = tokenMapper.mapUserToPayload(
        TOKEN_TYPE.ACCESS,
        userDto,
      );
      const refreshPayload = tokenMapper.mapUserToPayload(
        TOKEN_TYPE.REFRESH,
        userDto,
      );

      const accessToken = createAccessToken(accessPayload);
      const refreshToken = createRefreshToken(refreshPayload);

      const accessTokenPayload: IDecodedTokenPayload = verifyToken(accessToken);
      const refreshTokenPayload: IDecodedTokenPayload =
        verifyToken(refreshToken);

      expect(accessTokenPayload.type).toStrictEqual(TOKEN_TYPE.ACCESS);
      expect(refreshTokenPayload.type).toStrictEqual(TOKEN_TYPE.REFRESH);
      expect(refreshTokenPayload.exp > accessTokenPayload.exp).toBeTruthy();
      expect(accessTokenPayload).toMatchObject({ ...accessPayload });
      expect(refreshTokenPayload).toMatchObject({ ...refreshPayload });
    },
  );
});
