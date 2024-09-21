import type { IUserDto } from 'src/application/dtos/users';

export interface IUserMapper {
  serializeUserDto(dto: Partial<IUserDto>): string;
}
