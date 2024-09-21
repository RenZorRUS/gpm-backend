import type { ICreateUserDto } from 'src/application/dtos/users';
import type { Prisma } from '@prisma/client';

export interface IUserMapper {
  mapToCreateDto(data: ICreateUserDto): Promise<Prisma.UserCreateInput>;
}
