import type { SignerSync, VerifierSync } from 'fast-jwt';

export interface IJwtTokenUtils {
  createRefreshToken: typeof SignerSync;
  createAccessToken: typeof SignerSync;
  verifyToken: typeof VerifierSync;
}
