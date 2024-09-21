import type { IEnvConfig } from 'src/application/types/global';
import type { IJwtTokenUtils } from 'src/application/utilities/token.utils';
import { readFile as readFileAsync } from 'fs/promises';
import { checkIsFileReadableAsync } from 'src/infrastructure/utilities/file.utils';
import {
  createSigner,
  createVerifier,
  type SignerOptions,
  type VerifierOptions,
} from 'fast-jwt';

export type JwtSecret = { key: string };
export type JwtSignerOptions = Partial<SignerOptions & JwtSecret>;
export type JwtVerifierOptions = Partial<VerifierOptions & JwtSecret>;

export const buildJwtTokenUtilsAsync = async ({
  REFRESH_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_PRIVATE_KEY_PATH,
  JWT_PUBLIC_KEY_PATH,
  JWT_TOKEN_ISSUER,
}: IEnvConfig): Promise<IJwtTokenUtils> => {
  await Promise.all([
    checkIsFileReadableAsync(JWT_PRIVATE_KEY_PATH),
    checkIsFileReadableAsync(JWT_PUBLIC_KEY_PATH),
  ]);

  const { 0: privateKey, 1: publicKey } = await Promise.all([
    readFileAsync(JWT_PRIVATE_KEY_PATH, 'utf8'),
    readFileAsync(JWT_PUBLIC_KEY_PATH, 'utf8'),
  ]);

  const signerBaseOptions: JwtSignerOptions = {
    iss: JWT_TOKEN_ISSUER,
    mutatePayload: false, // provides a raw reference to the payload after claims have been applied
    noTimestamp: false, // `iat` claim should not be added to the token
    algorithm: 'EdDSA',
    key: privateKey,
  };

  const verifierBaseOptions: JwtVerifierOptions = {
    key: publicKey,
    algorithms: ['EdDSA'],
    complete: false, // object with the decoded header, payload, signature and input
    cache: 1000, // the size of the verified tokens cache (using LRU strategy)
    cacheTTL: 10 * 60 * 1000, // 10 min., time to live of a cache entry (in milliseconds)
    errorCacheTTL: -1, // time to live of a cache error entry (in milliseconds)
    ignoreExpiration: false, // do not validate the expiration of the token
    ignoreNotBefore: false, // do not validate the activation of the token
  };

  const verifyToken = createVerifier(verifierBaseOptions);
  const createAccessToken = createSigner({
    ...signerBaseOptions,
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
  const createRefreshToken = createSigner({
    ...signerBaseOptions,
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });

  return {
    createRefreshToken,
    createAccessToken,
    verifyToken,
  };
};
