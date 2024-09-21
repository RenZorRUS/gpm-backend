import type { IAuthValidator } from 'src/application/validators/auth.validator';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IUserService } from 'src/application/services/user.service';
import type { IJwtTokenUtils } from 'src/application/utilities/token.utils';
import type { IEnvConfig } from 'src/application/types/global';
import { file as createTmpFileAsync } from 'tmp-promise';
import {
  mkdir as createDirAsync,
  writeFile as writeFileAsync,
} from 'fs/promises';
import { generateKeyPair } from 'crypto';
import { jest } from '@jest/globals';
import { promisify } from 'util';

export interface IKeyPairKeyObjectResult {
  privateKey: string;
  publicKey: string;
}
export interface ICreateTempEdDsaKeyPairOptions {
  privateKeyTemplate?: string;
  publicKeyTemplate?: string;
  tempDirPath?: string;
}
export interface ICreateTempEdDsaKeyPairResult {
  cleanupKeysAsync: () => Promise<void>;
  privateKeyPath: string;
  publicKeyPath: string;
}

export const PHONE_REGEX =
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
export const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
export const ISO_DATE_REGEX =
  /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/;

export const createAuthValidatorMock = (): jest.Mocked<IAuthValidator> => ({
  checkAuthTokensOrThrow: jest.fn(),
  checkLoginDtoOrThrow: jest.fn(),
});

export const createCryptoServiceMock = (): jest.Mocked<ICryptoService> => ({
  createAuthJwtTokens: jest.fn(),
  decodeAuthTokenOrThrow: jest.fn(),
  checkTokenValidity: jest.fn(),
});

export const createUserServiceMock = (): jest.Mocked<IUserService> => ({
  findByOrThrowAsync: jest.fn(),
});

export const generateKeyPairAsync = promisify(generateKeyPair);

export const sleepAsync = promisify(setTimeout);

export const createTempEdDsaKeyPairAsync = async ({
  publicKeyTemplate = 'ed25519-XXXXXX.temp.pub.pem',
  privateKeyTemplate = 'ed25519-XXXXXX.temp.pem',
  tempDirPath = '.temp',
}: ICreateTempEdDsaKeyPairOptions = {}): Promise<ICreateTempEdDsaKeyPairResult> => {
  await createDirAsync(tempDirPath, { recursive: true });

  const baseTempFileOptions = {
    dir: tempDirPath,
    tmpdir: '.',
  };
  const createPrivateKeyTask = createTmpFileAsync({
    ...baseTempFileOptions,
    template: privateKeyTemplate,
  });
  const createPublicKeyTask = createTmpFileAsync({
    ...baseTempFileOptions,
    template: publicKeyTemplate,
  });

  const {
    0: { path: privateKeyPath, cleanup: cleanupPrivateKeyAsync },
    1: { path: publicKeyPath, cleanup: cleanupPublicKeyAsync },
  } = await Promise.all([createPrivateKeyTask, createPublicKeyTask]);

  const { privateKey, publicKey } = await generateKeyPairAsync('ed25519', {
    privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
    publicKeyEncoding: { format: 'pem', type: 'spki' },
  });

  await Promise.all([
    writeFileAsync(privateKeyPath, privateKey),
    writeFileAsync(publicKeyPath, publicKey),
  ]);

  const cleanupKeysAsync = async (): Promise<void> => {
    await Promise.all([cleanupPrivateKeyAsync(), cleanupPublicKeyAsync()]);
  };

  return {
    cleanupKeysAsync,
    privateKeyPath,
    publicKeyPath,
  };
};

export const createJwtTokenUtilsMock = (): jest.Mocked<IJwtTokenUtils> => ({
  createRefreshToken: jest.fn(),
  createAccessToken: jest.fn(),
  verifyToken: jest.fn(),
});

export const buildEnvConfig = (
  config: Partial<IEnvConfig> = {},
): IEnvConfig => ({
  PORT: config.PORT ?? '8082',
  HOST: config.HOST ?? 'localhost',
  API_PREFIX: config.API_PREFIX ?? '/api',
  APP_VERSION: config.APP_VERSION ?? '0.0.5',
  APP_TITLE: config.APP_TITLE ?? 'auth-service',
  APP_DESCRIPTION: config.APP_DESCRIPTION ?? 'Authorization service',
  APP_CONTACT_NAME: config.APP_CONTACT_NAME ?? 'Roman Z.',
  APP_CONTACT_URL: config.APP_CONTACT_URL ?? 'https://github.com/roman-z/',
  APP_CONTACT_EMAIL: config.APP_CONTACT_EMAIL ?? 'pWf9Y@example.com',
  SWAGGER_PATH: config.SWAGGER_PATH ?? '/swagger',
  USER_SERVICE_ORIGIN: config.USER_SERVICE_ORIGIN ?? 'http://localhost:8081',
  ACCESS_TOKEN_EXPIRATION_TIME: config.ACCESS_TOKEN_EXPIRATION_TIME ?? '30m',
  REFRESH_TOKEN_EXPIRATION_TIME: config.REFRESH_TOKEN_EXPIRATION_TIME ?? '30d',
  JWT_TOKEN_ISSUER: config.JWT_TOKEN_ISSUER ?? 'auth-service',
  JWT_PRIVATE_KEY_PATH: config.JWT_PRIVATE_KEY_PATH ?? 'ed25519.pem',
  JWT_PUBLIC_KEY_PATH: config.JWT_PUBLIC_KEY_PATH ?? 'ed25519.pub.pem',
});
