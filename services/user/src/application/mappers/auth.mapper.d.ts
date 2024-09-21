import type { IValidateAuthTokensDto } from 'src/application/dtos/auth';

export interface IAuthMapper {
  serializeTokenValidityParams(data: IValidateAuthTokensDto): string;
}
