import type { IValidateAuthTokensDto } from 'src/application/dtos/auth';

export interface IAuthMapper {
  serializeAuthTokenValidityDto(data: IValidateAuthTokensDto): string;
}
