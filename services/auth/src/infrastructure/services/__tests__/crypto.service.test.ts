import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IJwtTokenUtils } from 'src/application/utilities/token.utils';
import type { IEnvConfig } from 'src/application/types/global';
import type { IAuthTokenValidityResult } from 'src/application/dtos/auth';
import type { ITokenPayload } from 'src/application/mappers/token.mapper';
import { afterAll, describe, test, expect } from '@jest/globals';
import TokenMapper from 'src/infrastructure/mappers/token.mapper';
import {
  buildEnvConfig,
  createJwtTokenUtilsMock,
  createTempEdDsaKeyPairAsync,
  EMAIL_REGEX,
  sleepAsync,
} from 'src/infrastructure/services/__tests__/services.test.utils';
import { buildUserDto } from 'src/infrastructure/mappers/__tests__/mappers.test.utils';
import { buildJwtTokenUtilsAsync } from 'src/infrastructure/utilities/tokens.utils';
import InternalServerError from 'src/application/errors/internal.server.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import CryptoService from 'src/infrastructure/services/crypto.service';
import ValidationError from 'src/application/errors/validation.error';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';
import { JWT_ERROR } from 'src/domain/constants/errors';
import { TokenError } from 'fast-jwt';

describe('Class: CryptoService', (): void => {
  const EXPIRED_TOKEN_VALIDITY: IAuthTokenValidityResult = {
    isExpired: true,
    isValid: false,
  };
  const BAD_TOKEN_VALIDITY: IAuthTokenValidityResult = {
    isExpired: false,
    isValid: false,
  };
  const TOKEN_VALIDITY_OK: IAuthTokenValidityResult = {
    isExpired: false,
    isValid: true,
  };

  const unexpectedError = new Error('Something goes wrong!');
  const tokenMapper = new TokenMapper();
  const userDto = buildUserDto();

  let cleanupKeysAsync: () => Promise<void>;
  let baseCryptoService: ICryptoService;
  let baseTokenUtils: IJwtTokenUtils;
  let baseEnvConfig: IEnvConfig;
  let baseRefreshToken: string;
  let baseAccessToken: string;
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

    ({ accessToken: baseAccessToken, refreshToken: baseRefreshToken } =
      baseCryptoService.createAuthJwtTokens(userDto));
  })();

  afterAll((): Promise<void> => cleanupKeysAsync());

  describe('Method: checkTokenValidity()', (): void => {
    test.concurrent.each([
      {
        type: TOKEN_TYPE.ACCESS,
        expectedResult: TOKEN_VALIDITY_OK,
      },
      {
        type: TOKEN_TYPE.REFRESH,
        expectedResult: TOKEN_VALIDITY_OK,
      },
    ])(
      'Should return: `$expectedResult` for valid `$type` tokens',
      async ({ type, expectedResult }): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const token =
          type === TOKEN_TYPE.ACCESS ? baseAccessToken : baseRefreshToken;

        // Perform
        const result = baseCryptoService.checkTokenValidity(type, token);

        // Validate
        expect(result).toEqual(expectedResult);
      },
    );

    test.concurrent(
      'Should return `{ isExpired: false, isValid: false }` for the token with mismatched type',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        // Perform
        const result = baseCryptoService.checkTokenValidity(
          TOKEN_TYPE.REFRESH,
          baseAccessToken,
        );

        // Validate
        expect(result).toEqual(BAD_TOKEN_VALIDITY);
      },
    );

    test.concurrent(
      'Should return `{ isExpired: true, isValid: false }` for expired tokens',
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

        const { accessToken } = cryptoService.createAuthJwtTokens(userDto);
        await sleepAsync(10);

        // Perform
        const result = cryptoService.checkTokenValidity(
          TOKEN_TYPE.ACCESS,
          accessToken,
        );

        // Validate
        expect(result).toEqual(EXPIRED_TOKEN_VALIDITY);
      },
    );

    test.concurrent(
      'Should return `{ isExpired: false, isValid: false }` for tokens with invalid signature',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        // Perform
        const result = baseCryptoService.checkTokenValidity(
          TOKEN_TYPE.ACCESS,
          baseAccessToken + 'a',
        );

        // Validate
        expect(result).toEqual(BAD_TOKEN_VALIDITY);
      },
    );

    test.concurrent(
      "Should throw an error if it's not related to TokenError",
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const tokenUtilsMock = createJwtTokenUtilsMock();
        const cryptoService = new CryptoService(tokenMapper, tokenUtilsMock);

        tokenUtilsMock.verifyToken.mockImplementationOnce((): void => {
          throw unexpectedError;
        });

        // Perform & Validate
        expect(
          (): IAuthTokenValidityResult =>
            cryptoService.checkTokenValidity(
              TOKEN_TYPE.ACCESS,
              baseAccessToken,
            ),
        ).toThrowError(unexpectedError);
      },
    );
  });

  describe('Method: decodeAuthTokenOrThrow()', (): void => {
    test.concurrent(
      "Should throw an error if it's not related to TokenError",
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const tokenUtilsMock = createJwtTokenUtilsMock();
        const cryptoService = new CryptoService(tokenMapper, tokenUtilsMock);

        tokenUtilsMock.verifyToken.mockImplementationOnce((): void => {
          throw unexpectedError;
        });

        // Perform & Validate
        expect(
          (): ITokenPayload =>
            cryptoService.decodeAuthTokenOrThrow(
              TOKEN_TYPE.ACCESS,
              baseAccessToken,
            ),
        ).toThrowError(unexpectedError);
      },
    );

    test.concurrent(
      'Should throw a validation error is token type is mismatched',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const expectedError = new ValidationError(
          JWT_ERROR.AUTH_TOKEN_TYPE_MISMATCH,
        );

        // Perform & Validate
        expect(
          (): ITokenPayload =>
            baseCryptoService.decodeAuthTokenOrThrow(
              TOKEN_TYPE.ACCESS,
              baseRefreshToken,
            ),
        ).toThrowError(expectedError);
      },
    );

    test.concurrent(
      'Should return a payload for a valid token without throwing an error',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        // Perform
        const result = baseCryptoService.decodeAuthTokenOrThrow(
          TOKEN_TYPE.ACCESS,
          baseAccessToken,
        );

        // Validate
        const currentDate = Date.now();

        expect(result.sub).toMatch(EMAIL_REGEX);
        expect(result.iat * 1e3).toBeLessThanOrEqual(currentDate);
        expect(result.exp * 1e3).toBeGreaterThan(currentDate);
        expect(result.iss).toStrictEqual('auth-service');
        expect(result.userId).toBeGreaterThan(1);
        expect([TOKEN_TYPE.ACCESS, TOKEN_TYPE.REFRESH]).toContainEqual(
          result.type,
        );
      },
    );

    test.concurrent.each([
      {
        expectedError: new InternalServerError(
          JWT_ERROR.AUTH_TOKEN_VERIFICATION_FAILED,
        ),
        errorToThrow: TokenError.wrap(
          unexpectedError,
          'FAST_JWT_VERIFY_ERROR',
          unexpectedError.message,
        ),
      },
      {
        expectedError: new UnauthorizedError(
          JWT_ERROR.AUTH_TOKEN_INVALID_SIGNATURE,
        ),
        errorToThrow: TokenError.wrap(
          unexpectedError,
          'FAST_JWT_INVALID_SIGNATURE',
          unexpectedError.message,
        ),
      },
      {
        expectedError: new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_EXPIRED),
        errorToThrow: TokenError.wrap(
          unexpectedError,
          'FAST_JWT_EXPIRED',
          unexpectedError.message,
        ),
      },
      {
        expectedError: new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_MALFORMED),
        errorToThrow: TokenError.wrap(
          unexpectedError,
          'FAST_JWT_MALFORMED',
          unexpectedError.message,
        ),
      },
      {
        expectedError: new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_INVALID),
        errorToThrow: TokenError.wrap(
          unexpectedError,
          'FAST_JWT_INVALID_PAYLOAD',
          unexpectedError.message,
        ),
      },
    ])(
      'Should thrown a error: `$expectedError.message` in case of a token error code: `$errorToThrow.code`',
      async ({ expectedError, errorToThrow }): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        const tokenUtilsMock = createJwtTokenUtilsMock();
        const cryptoService = new CryptoService(tokenMapper, tokenUtilsMock);

        tokenUtilsMock.verifyToken.mockImplementationOnce((): void => {
          throw errorToThrow;
        });

        // Perform & Validate
        expect(
          (): ITokenPayload =>
            cryptoService.decodeAuthTokenOrThrow(
              TOKEN_TYPE.ACCESS,
              baseAccessToken,
            ),
        ).toThrowError(expectedError);
      },
    );
  });

  describe('Method: createAuthJwtTokens()', (): void => {
    test.concurrent(
      'Should return an access and refresh authorization tokens for a user without throwing an error',
      async (): Promise<void> => {
        // Prepare
        await prepareSharedDataTask;

        // Perform
        const { accessToken, refreshToken } =
          baseCryptoService.createAuthJwtTokens(userDto);

        // Validate
        const authTokenValidity = baseCryptoService.checkTokenValidity(
          TOKEN_TYPE.ACCESS,
          accessToken,
        );
        const refreshTokenValidity = baseCryptoService.checkTokenValidity(
          TOKEN_TYPE.REFRESH,
          refreshToken,
        );

        expect(authTokenValidity).toEqual(TOKEN_VALIDITY_OK);
        expect(refreshTokenValidity).toEqual(TOKEN_VALIDITY_OK);
      },
    );
  });
});
