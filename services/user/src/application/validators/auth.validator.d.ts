import type {
  IAuthTokensValidityResponse,
  IValidateAuthTokensDto,
} from 'src/application/dtos/auth';

export interface IAuthValidator {
  validateAuthTokensResponse(
    dto: IValidateAuthTokensDto,
    response: IAuthTokensValidityResponse,
  ): void;
}
