import type { IUserDto } from 'src/application/dtos/users';

export interface ILoginDto {
  readonly password: string;
  readonly phone?: string;
  readonly email?: string;
}

export interface IAuthTokensValidityDto {
  readonly refreshToken?: string;
  readonly accessToken?: string;
}

export interface IAuthTokenValidityResult {
  readonly isExpired: boolean;
  readonly isValid: boolean;
}

export interface IAuthTokensValidityResponse {
  refreshToken?: IAuthTokenValidityResult;
  accessToken?: IAuthTokenValidityResult;
}

export interface IAuthDto {
  readonly refreshToken: string;
  readonly accessToken: string;
  readonly user: IUserDto;
}
