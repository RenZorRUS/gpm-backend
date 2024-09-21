import type { FastifyRequest } from 'fastify';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import type { IAuthHandler } from 'src/application/handlers/auth.handler';
import type { IAuthService } from 'src/application/services/auth.service';
import { AUTH_ERROR } from 'src/domain/constants/errors';

export default class AuthHandler implements IAuthHandler {
  private static readonly BEARER_TOKEN_START = 'Bearer ';
  private static readonly BEARER_TOKEN_REGEX =
    /^Bearer\s+([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/;

  constructor(private readonly authService: IAuthService) {}

  public async checkBearerTokenAsync(request: FastifyRequest): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError(AUTH_ERROR.AUTH_HEADER_REQUIRED);
    }

    if (!authHeader.includes(AuthHandler.BEARER_TOKEN_START)) {
      throw new UnauthorizedError(AUTH_ERROR.BEARER_TOKEN_REQUIRED);
    }

    const accessToken = AuthHandler.getAuthTokenOrThrow(authHeader);
    await this.authService.validateAuthTokensOrThrowAsync({ accessToken });
  }

  private static getAuthTokenOrThrow(authHeader: string): string {
    const matchResult = authHeader.match(AuthHandler.BEARER_TOKEN_REGEX);

    if (!matchResult) {
      throw new UnauthorizedError(AUTH_ERROR.AUTH_JWT_TOKEN_REQUIRED);
    }

    return matchResult[1]!;
  }
}
