import type { IEnvConfig } from 'src/application/types/global';
import { readFileSync } from 'node:fs';
import {
  createSigner,
  createVerifier,
  type SignerOptions,
  type VerifierOptions,
  type SignerSync,
  type VerifierSync,
} from 'fast-jwt';

export type JwtSecret = { key: string };
export type JwtSignerOptions = Partial<SignerOptions & JwtSecret>;
export type JwtVerifierOptions = Partial<VerifierOptions & JwtSecret>;

export interface ITokenUtils {
  createAccessToken: typeof SignerSync;
  createRefreshToken: typeof SignerSync;
  verifyToken: typeof VerifierSync;
}

export const getJwtTokenUtils = (envConfig: IEnvConfig): ITokenUtils => {
  const privateKey = readFileSync(envConfig.JWT_PRIVATE_KEY_PATH, 'utf8');
  const publicKey = readFileSync(envConfig.JWT_PUBLIC_KEY_PATH, 'utf8');

  const signerBaseOptions: JwtSignerOptions = {
    key: privateKey,
    iss: envConfig.JWT_TOKEN_ISSUER,
    mutatePayload: false, // provides a raw reference to the payload after claims have been applied
    noTimestamp: false, // `iat` claim should not be added to the token
    algorithm: 'EdDSA',
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

  return {
    createAccessToken: createSigner({
      ...signerBaseOptions,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRATION_TIME,
    }),
    createRefreshToken: createSigner({
      ...signerBaseOptions,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRATION_TIME,
    }),
    verifyToken: createVerifier(verifierBaseOptions),
  };
};
