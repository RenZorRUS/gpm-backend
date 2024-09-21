import type {
  IAuthDto,
  IAuthTokensValidityDto,
  IAuthTokensValidityResponse,
  ILoginDto,
} from 'src/application/dtos/auth';

export interface IAuthService {
  loginAsync(dto: ILoginDto): Promise<IAuthDto>;
  verifyAuthTokens(dto: IAuthTokensValidityDto): IAuthTokensValidityResponse;
}
