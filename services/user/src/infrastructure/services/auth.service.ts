import type { IHttpClient } from 'src/application/clients/http.client';
import type {
  IValidateAuthTokensDto,
  IAuthTokensValidityResponse,
} from 'src/application/dtos/auth';
import type { IAuthService } from 'src/application/services/auth.service';
import type { ILogger } from 'src/application/loggers/logger';
import type { IAuthMapper } from 'src/application/mappers/auth.mapper';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import { AUTH_ERROR } from 'src/domain/constants/errors';
import InternalServerError from 'src/application/errors/internal-server-error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';

export default class AuthService implements IAuthService {
  private static readonly VALIDATE_AUTH_TOKEN_PATH =
    '/api/v1/auth/validate/token';

  constructor(
    private readonly authHttpClient: IHttpClient,
    private readonly authMapper: IAuthMapper,
    private readonly authValidator: IAuthValidator,
    private readonly logger: ILogger,
  ) {}

  public async validateAuthTokensOrThrowAsync(
    dto: IValidateAuthTokensDto,
  ): Promise<void> {
    if (!dto.accessToken && !dto.refreshToken) {
      throw new UnauthorizedError(AUTH_ERROR.AUTH_TOKENS_NOT_PROVIDED);
    }

    const { data, error } =
      await this.authHttpClient.postAsync<IAuthTokensValidityResponse>({
        body: this.authMapper.serializeAuthTokenValidityDto(dto),
        path: AuthService.VALIDATE_AUTH_TOKEN_PATH,
      });

    if (error) {
      throw error;
    }

    if (typeof data === 'string') {
      this.logger.error(
        `Failed to parse data: ${data} from POST: ${AuthService.VALIDATE_AUTH_TOKEN_PATH}`,
      );
      throw new InternalServerError(AUTH_ERROR.FAILED_TO_VALIDATE_AUTH_TOKENS);
    }

    this.authValidator.validateAuthTokensResponse(dto, data!);
  }
}
