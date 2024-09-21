import type { TOKEN_TYPE } from 'src/domain/constants/tokens';
import type { IUserDto } from 'src/application/dtos/users';

/** Principal is an entity that can be authenticated by a computer system or network */
export interface ITokenPayload {
  /** Identifies the principal that is the subject of the JWT (user email) */
  readonly sub: string;
  readonly type: TOKEN_TYPE;
  readonly userId: bigint;
}

export interface IDecodedTokenPayload extends ITokenPayload {
  readonly exp: number;
  readonly iat: number;
  readonly iss: number;
}

export interface ITokenMapper {
  mapUserToPayload(type: TOKEN_TYPE, user: IUserDto): ITokenPayload;
}
