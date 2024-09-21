import type {
  ILoginDto,
  IAuthDto,
  IAuthTokensValidityDto,
  IAuthTokensValidityResponse,
} from 'src/application/dtos/auth';
import type { IAuthService } from 'src/application/services/auth.service';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IUserService } from 'src/application/services/user.service';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import { TOKEN_TYPE } from 'src/domain/constants/tokens';

export default class AuthService implements IAuthService {
  constructor(
    private readonly authValidator: IAuthValidator,
    private readonly cryptoService: ICryptoService,
    private readonly userService: IUserService,
  ) {}

  public verifyAuthTokens(
    dto: IAuthTokensValidityDto,
  ): IAuthTokensValidityResponse {
    this.authValidator.checkAuthTokensOrThrow(dto);

    const validityResult: IAuthTokensValidityResponse = {};
    const { accessToken, refreshToken } = dto;

    if (accessToken) {
      validityResult.accessToken = this.cryptoService.checkTokenValidity(
        TOKEN_TYPE.ACCESS,
        accessToken,
      );
    }

    if (refreshToken) {
      validityResult.refreshToken = this.cryptoService.checkTokenValidity(
        TOKEN_TYPE.REFRESH,
        refreshToken,
      );
    }

    return validityResult;
  }

  public async loginAsync(dto: ILoginDto): Promise<IAuthDto> {
    this.authValidator.checkLoginDtoOrThrow(dto);

    const user = dto.email
      ? await this.userService.findByOrThrowAsync({ email: dto.email })
      : await this.userService.findByOrThrowAsync({ phone: dto.phone });

    const authTokens = this.cryptoService.createAuthJwtTokens(user);

    return {
      ...authTokens,
      user,
    };
  }
}
