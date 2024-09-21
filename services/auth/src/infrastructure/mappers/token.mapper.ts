import type { IUserDto } from 'src/application/dtos/users';
import type { TOKEN_TYPE } from 'src/domain/constants/tokens';
import type {
  ITokenMapper,
  ITokenPayload,
} from 'src/application/mappers/token.mapper';

export default class TokenMapper implements ITokenMapper {
  public mapUserToPayload(type: TOKEN_TYPE, user: IUserDto): ITokenPayload {
    return {
      dateOfBirth: user.dateOfBirth,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      sub: user.email,
      userId: user.id,
      type,
    };
  }
}
