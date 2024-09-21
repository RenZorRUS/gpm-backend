import type { IAuthService } from 'src/application/services/auth.service';
import type { FastifyRequest } from 'fastify';
import type {
  IAuthDto,
  IAuthTokensValidityDto,
  IAuthTokensValidityResponse,
  ILoginDto,
} from 'src/application/dtos/auth';

export default class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public async loginAsync(
    request: FastifyRequest<{ Body: ILoginDto }>,
  ): Promise<IAuthDto> {
    const authDto = await this.authService.loginAsync(request.body);
    return authDto;
  }

  public async verifyTokensAsync(
    request: FastifyRequest<{ Body: IAuthTokensValidityDto }>,
  ): Promise<IAuthTokensValidityResponse> {
    const response = this.authService.verifyAuthTokens(request.body);
    return response;
  }
}
