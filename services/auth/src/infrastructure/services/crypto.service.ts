import type { IEnvConfig } from 'src/application/types/global';
import type { IUserDto } from 'src/application/dtos/users';
import type {
  IAuthTokens,
  ICryptoService,
} from 'src/application/services/crypto.service';
import type {
  ITokenMapper,
  ITokenPayload,
} from 'src/application/mappers/token.mapper';
import type { IAuthTokenValidityResult } from 'src/application/dtos/auth';
import { TokenError, type SignerSync, type VerifierSync } from 'fast-jwt';
import InternalServerError from 'src/application/errors/internal.server.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import { getJwtTokenUtils } from 'src/infrastructure/utilities/tokens';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';
import { JWT_ERROR } from 'src/domain/constants/errors';
import ValidationError from 'src/application/errors/validation.error';

export default class CryptoService implements ICryptoService {
  private createRefreshToken: typeof SignerSync;
  private createAccessToken: typeof SignerSync;
  private verifyToken: typeof VerifierSync;

  constructor(
    private readonly tokenMapper: ITokenMapper,
    envConfig: IEnvConfig,
  ) {
    ({
      createAccessToken: this.createAccessToken,
      createRefreshToken: this.createRefreshToken,
      verifyToken: this.verifyToken,
    } = getJwtTokenUtils(envConfig));
  }

  public checkTokenValidity(
    type: TOKEN_TYPE,
    token: string,
  ): IAuthTokenValidityResult {
    try {
      const payload: ITokenPayload = this.verifyToken(token);

      return payload.type === type
        ? { isExpired: false, isValid: true }
        : { isExpired: false, isValid: false };
    } catch (error) {
      if (!(error instanceof TokenError)) {
        throw error;
      }

      if (error.code === 'FAST_JWT_VERIFY_ERROR') {
        throw new InternalServerError(JWT_ERROR.AUTH_TOKEN_VERIFICATION_FAILED);
      }

      return error.code === 'FAST_JWT_EXPIRED'
        ? { isExpired: true, isValid: false }
        : { isExpired: false, isValid: false };
    }
  }

  public decodeAuthTokenOrThrow(
    type: TOKEN_TYPE,
    token: string,
  ): ITokenPayload {
    try {
      const payload: ITokenPayload = this.verifyToken(token);

      if (payload.type !== type) {
        throw new ValidationError(JWT_ERROR.AUTH_TOKEN_TYPE_MISMATCH);
      }

      return payload;
    } catch (error) {
      if (error instanceof TokenError) {
        this.handleTokenError(error);
      }
      throw error;
    }
  }

  public createAuthJwtTokens(user: IUserDto): IAuthTokens {
    const accessTokenPayload = this.tokenMapper.mapUserToPayload(
      TOKEN_TYPE.ACCESS,
      user,
    );
    const refreshTokenPayload = this.tokenMapper.mapUserToPayload(
      TOKEN_TYPE.REFRESH,
      user,
    );

    return {
      refreshToken: this.createRefreshToken(refreshTokenPayload),
      accessToken: this.createAccessToken(accessTokenPayload),
    };
  }

  private handleTokenError(error: TokenError): void {
    switch (error.code) {
      case 'FAST_JWT_VERIFY_ERROR':
        throw new InternalServerError(JWT_ERROR.AUTH_TOKEN_VERIFICATION_FAILED);
      case 'FAST_JWT_EXPIRED':
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_EXPIRED);
      case 'FAST_JWT_MALFORMED':
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_MALFORMED);
      default:
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_INVALID);
    }
  }
}
