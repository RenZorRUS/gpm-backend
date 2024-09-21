import type { IUserDto } from 'src/application/dtos/users';
import type { TOKEN_TYPE } from 'src/domain/constants/tokens';
import type {
  ITokenMapper,
  ITokenPayload,
} from 'src/application/mappers/token.mapper';

export default class TokenMapper implements ITokenMapper {
  public mapUserToPayload(
    type: TOKEN_TYPE,
    { id, email }: IUserDto,
  ): ITokenPayload {
    return {
      sub: email,
      userId: id,
      type,
    };
  }
}
