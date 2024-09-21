import type { IUserDto } from 'src/application/dtos/users';
import type {
  IAuthTokens,
  ICryptoService,
} from 'src/application/services/crypto.service';
import type {
  IDecodedTokenPayload,
  ITokenMapper,
  ITokenPayload,
} from 'src/application/mappers/token.mapper';
import type { IAuthTokenValidityResult } from 'src/application/dtos/auth';
import type { IJwtTokenUtils } from 'src/application/utilities/token.utils';
import InternalServerError from 'src/application/errors/internal.server.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import ValidationError from 'src/application/errors/validation.error';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';
import { JWT_ERROR } from 'src/domain/constants/errors';
import { TokenError } from 'fast-jwt';

export default class CryptoService implements ICryptoService {
  constructor(
    private readonly tokenMapper: ITokenMapper,
    private readonly tokenUtils: IJwtTokenUtils,
  ) {}

  public checkTokenValidity(
    type: TOKEN_TYPE,
    token: string,
  ): IAuthTokenValidityResult {
    try {
      const { type: tokenType }: ITokenPayload =
        this.tokenUtils.verifyToken(token);

      return tokenType === type
        ? { isExpired: false, isValid: true }
        : { isExpired: false, isValid: false };
    } catch (error) {
      if (!(error instanceof TokenError)) {
        throw error;
      }

      return error.code === 'FAST_JWT_EXPIRED'
        ? { isExpired: true, isValid: false }
        : { isExpired: false, isValid: false };
    }
  }

  public decodeAuthTokenOrThrow(
    type: TOKEN_TYPE,
    token: string,
  ): IDecodedTokenPayload {
    try {
      const payload: IDecodedTokenPayload = this.tokenUtils.verifyToken(token);

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

    const accessToken = this.tokenUtils.createAccessToken(accessTokenPayload);
    const refreshToken =
      this.tokenUtils.createRefreshToken(refreshTokenPayload);

    return {
      refreshToken,
      accessToken,
    };
  }

  private handleTokenError(error: TokenError): void {
    switch (error.code) {
      case 'FAST_JWT_VERIFY_ERROR':
        throw new InternalServerError(JWT_ERROR.AUTH_TOKEN_VERIFICATION_FAILED);
      case 'FAST_JWT_INVALID_SIGNATURE':
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_INVALID_SIGNATURE);
      case 'FAST_JWT_MALFORMED':
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_MALFORMED);
      case 'FAST_JWT_EXPIRED':
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_EXPIRED);
      default:
        throw new UnauthorizedError(JWT_ERROR.AUTH_TOKEN_INVALID);
    }
  }
}
