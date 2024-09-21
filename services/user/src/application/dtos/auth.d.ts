export interface IValidateAuthTokensDto {
  readonly refreshToken?: string;
  readonly accessToken?: string;
}

export interface IAuthTokenValidityDto {
  readonly isExpired: boolean;
  readonly isValid: boolean;
}

export interface IAuthTokensValidityResponse {
  readonly refreshToken?: IAuthTokenValidityDto;
  readonly accessToken?: IAuthTokenValidityDto;
}
