import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IAuthTokensValidityResponse } from 'src/application/dtos/auth';
import type { IUserService } from 'src/application/services/user.service';
import type { IJwtTokenUtils } from 'src/application/utilities/token.utils';
import type { IEnvConfig } from 'src/application/types/global';
import { buildJwtTokenUtilsAsync } from 'src/infrastructure/utilities/tokens.utils';
import { afterAll, describe, expect, test } from '@jest/globals';
import AuthService from 'src/infrastructure/services/auth.service';
import CryptoService from 'src/infrastructure/services/crypto.service';
import {
  buildEnvConfig,
  createTempEdDsaKeyPairAsync,
  createUserServiceMock,
  sleepAsync,
} from 'src/infrastructure/services/__tests__/services.test.utils';
import TokenMapper from 'src/infrastructure/mappers/token.mapper';
import AuthValidator from 'src/infrastructure/validators/auth.validator';
import {
  buildLoginDto,
  buildUserDto,
} from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import ValidationError from 'src/application/errors/validation.error';
import { AUTH_ERROR } from 'src/domain/constants/errors';

describe('Class: AuthService', (): void => {
  const GOOD_VALIDITY_RESULT = {
    isExpired: false,
    isValid: true,
  };
  const EXPIRED_VALIDITY_RESULT = {
    isExpired: true,
    isValid: false,
  };

  const authValidator = new AuthValidator();
  const tokenMapper = new TokenMapper();
  const userDto = buildUserDto();

  let cleanupKeysAsync: () => Promise<void>;
  let baseCryptoService: ICryptoService;
  let baseTokenUtils: IJwtTokenUtils;
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

    baseTokenUtils = await buildJwtTokenUtilsAsync(baseEnvConfig);
    baseCryptoService = new CryptoService(tokenMapper, baseTokenUtils);
  })();

  afterAll((): Promise<void> => cleanupKeysAsync());

  describe('Method: verifyAuthTokens()', (): void => {
    test.concurrent(
      'Should return `{ isExpired: false, isValid: true }` if tokens are valid',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const authService = new AuthService(
          authValidator,
          baseCryptoService,
          {} as IUserService,
        );

        const authTokens = baseCryptoService.createAuthJwtTokens(userDto);

        // Perform
        const result = authService.verifyAuthTokens(authTokens);

        // Validate
        expect(result).toEqual({
          refreshToken: GOOD_VALIDITY_RESULT,
          accessToken: GOOD_VALIDITY_RESULT,
        });
      },
    );

    test.concurrent(
      'Should return a validation error if tokens are empty',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const expectedError = new ValidationError(
          AUTH_ERROR.ACCESS_OR_REFRESH_TOKENS_REQUIRED,
        );
        const authService = new AuthService(
          authValidator,
          baseCryptoService,
          {} as IUserService,
        );

        // Perform & Validate
        expect(
          (): IAuthTokensValidityResponse => authService.verifyAuthTokens({}),
        ).toThrowError(expectedError);
      },
    );

    test.concurrent(
      'Should return `{ isExpired: true, isValid: false }` in case of expired tokens',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const envConfig = buildEnvConfig({
          JWT_PRIVATE_KEY_PATH: privateKeyPath,
          JWT_PUBLIC_KEY_PATH: publicKeyPath,
          REFRESH_TOKEN_EXPIRATION_TIME: '1',
          ACCESS_TOKEN_EXPIRATION_TIME: '1',
        });

        const tokenUtils = await buildJwtTokenUtilsAsync(envConfig);
        const cryptoService = new CryptoService(tokenMapper, tokenUtils);
        const authService = new AuthService(
          authValidator,
          cryptoService,
          {} as IUserService,
        );

        const authTokens = cryptoService.createAuthJwtTokens(userDto);
        await sleepAsync(10);

        // Perform
        const result = authService.verifyAuthTokens(authTokens);

        // Validate
        expect(result).toEqual({
          refreshToken: EXPIRED_VALIDITY_RESULT,
          accessToken: EXPIRED_VALIDITY_RESULT,
        });
      },
    );
  });

  describe('Method: loginAsync()', (): void => {
    test.concurrent.each([buildLoginDto(), buildLoginDto(false)])(
      'Should return an access and refresh tokens for the valid login DTO: `%o`',
      async (loginDto): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const userServiceMock = createUserServiceMock();
        const authService = new AuthService(
          authValidator,
          baseCryptoService,
          userServiceMock,
        );

        userServiceMock.findByOrThrowAsync.mockResolvedValueOnce(userDto);

        // Perform
        const result = await authService.loginAsync(loginDto);

        // Validate
        const findOptions = loginDto.email
          ? { email: loginDto.email }
          : { phone: loginDto.phone };

        expect(userServiceMock.findByOrThrowAsync).toHaveBeenNthCalledWith(
          1,
          findOptions,
        );
        expect(result).toEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: userDto,
        });
      },
    );
  });
});
