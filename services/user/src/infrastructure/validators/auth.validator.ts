import type {
  IAuthTokenValidityDto,
  IValidateAuthTokensDto,
  IAuthTokensValidityResponse,
} from 'src/application/dtos/auth';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import { AUTH_TOKEN } from 'src/domain/constants/auth';

export type AuthTokenType = 'Access' | 'Refresh';
export type AuthTokenValidityErrors = Record<
  keyof IValidateAuthTokensDto,
  string[]
>;

export default class AuthValidator implements IAuthValidator {
  public validateAuthTokensResponse(
    dto: IValidateAuthTokensDto,
    response: IAuthTokensValidityResponse,
  ): void {
    const errors: AuthTokenValidityErrors = {
      refreshToken: [],
      accessToken: [],
    };

    if (dto.accessToken) {
      AuthValidator.checkTokenValidity(
        AUTH_TOKEN.ACCESS,
        response.accessToken!,
        errors.accessToken,
      );
    }

    if (dto.refreshToken) {
      AuthValidator.checkTokenValidity(
        AUTH_TOKEN.REFRESH,
        response.refreshToken!,
        errors.refreshToken,
      );
    }

    if (errors.accessToken.length || errors.refreshToken.length) {
      const accessTokenErrors = errors.accessToken.join('\n');
      const refreshTokenErrors = errors.refreshToken.join('\n');
      throw new UnauthorizedError(
        `${accessTokenErrors}${accessTokenErrors && refreshTokenErrors && '\n'}${refreshTokenErrors}`,
      );
    }
  }

  private static checkTokenValidity(
    tokenType: AuthTokenType,
    tokenDto: IAuthTokenValidityDto,
    errors: string[],
  ): void {
    if (tokenDto.isExpired) {
      errors.push(`${tokenType} token is expired!`);
    }

    if (!tokenDto.isValid) {
      errors.push(`${tokenType} token is invalid!`);
    }
  }
}
