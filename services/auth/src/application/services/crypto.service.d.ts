import type { IDecodedTokenPayload } from 'src/application/mappers/token.mapper';
import type { IAuthTokenValidityResult } from 'src/application/dtos/auth';
import type { TOKEN_TYPE } from 'src/domain/constants/tokens';
import type { IUserDto } from 'src/application/dtos/users';

export interface IAuthTokens {
  refreshToken: string;
  accessToken: string;
}

export interface ICryptoService {
  decodeAuthTokenOrThrow(type: TOKEN_TYPE, token: string): IDecodedTokenPayload;
  checkTokenValidity(type: TOKEN_TYPE, token: string): IAuthTokenValidityResult;
  createAuthJwtTokens(user: IUserDto): IAuthTokens;
}
