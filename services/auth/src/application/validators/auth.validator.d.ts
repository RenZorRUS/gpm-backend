import type {
  IAuthTokensValidityDto,
  ILoginDto,
} from 'src/application/dtos/auth';

export interface IAuthValidator {
  checkAuthTokensOrThrow(dto: IAuthTokensValidityDto): void;
  checkLoginDtoOrThrow(dto: ILoginDto): void;
}
