import type {
  IValidateAuthTokensDto,
  IAuthTokensValidityResponse,
} from 'src/application/dtos/auth';
import { fakerEN_US } from '@faker-js/faker';

export interface ICreateValidateAuthTokensDtoParams {
  isRefreshTokenProvided?: boolean;
  isAccessTokenProvided?: boolean;
}

export interface ICreateValidateAuthTokensResponse {
  isRefreshTokenValid?: boolean;
  isRefreshTokenExpired?: boolean;
  isAccessTokenValid?: boolean;
  isAccessTokenExpired?: boolean;
}

export const createValidateAuthTokensDto = ({
  isRefreshTokenProvided = true,
  isAccessTokenProvided = true,
}: ICreateValidateAuthTokensDtoParams = {}): IValidateAuthTokensDto => ({
  refreshToken: isRefreshTokenProvided
    ? fakerEN_US.internet.password()
    : undefined,
  accessToken: isAccessTokenProvided
    ? fakerEN_US.internet.password()
    : undefined,
});

export const createValidateAuthTokensResponse = ({
  isRefreshTokenValid = true,
  isRefreshTokenExpired = false,
  isAccessTokenValid = true,
  isAccessTokenExpired = false,
}: ICreateValidateAuthTokensResponse = {}): IAuthTokensValidityResponse => ({
  refreshToken: {
    isValid: isRefreshTokenValid,
    isExpired: isRefreshTokenExpired,
  },
  accessToken: {
    isValid: isAccessTokenValid,
    isExpired: isAccessTokenExpired,
  },
});
