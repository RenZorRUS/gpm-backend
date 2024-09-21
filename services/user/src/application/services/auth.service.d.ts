import type { IValidateAuthTokensDto } from 'src/application/dtos/auth';

export interface IAuthService {
  validateAuthTokensOrThrowAsync(params: IValidateAuthTokensDto): Promise<void>;
}
