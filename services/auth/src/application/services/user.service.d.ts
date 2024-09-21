import type { IUserDto } from 'src/application/dtos/users';

export type FindUserOptions = Partial<IUserDto>;

export interface IUserService {
  findByOrThrowAsync(options: FindUserOptions): Promise<IUserDto>;
}
