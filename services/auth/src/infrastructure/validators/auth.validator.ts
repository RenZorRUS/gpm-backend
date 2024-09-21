import type {
  IAuthTokensValidityDto,
  ILoginDto,
} from 'src/application/dtos/auth';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import ValidationError from 'src/application/errors/validation.error';
import { AUTH_ERROR } from 'src/domain/constants/errors';

export default class AuthValidator implements IAuthValidator {
  public checkAuthTokensOrThrow(dto: IAuthTokensValidityDto): void {
    if (!dto.accessToken || !dto.refreshToken) {
      throw new ValidationError(AUTH_ERROR.ACCESS_OR_REFRESH_TOKENS_REQUIRED);
    }
  }

  public checkLoginDtoOrThrow(dto: ILoginDto): void {
    if (dto.email && dto.phone) {
      throw new ValidationError(AUTH_ERROR.ONLY_EMAIL_OR_PHONE);
    }

    if (!dto.email && !dto.phone) {
      throw new ValidationError(AUTH_ERROR.EMAIL_OR_PHONE_REQUIRED);
    }
  }
}
