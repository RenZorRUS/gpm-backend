import type { IUserDto } from 'src/application/dtos/users';
import type { TOKEN_TYPE } from 'src/domain/constants/tokens';

/** Principal is an entity that can be authenticated by a computer system or network */
export interface ITokenPayload {
  /** Identifies the principal that is the subject of the JWT (user email) */
  readonly sub: string;
  readonly type: TOKEN_TYPE;
  readonly userId: bigint;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string | null;
  readonly dateOfBirth: Date | null;
}

export interface ITokenMapper {
  mapUserToPayload(type: TOKEN_TYPE, user: IUserDto): ITokenPayload;
}
