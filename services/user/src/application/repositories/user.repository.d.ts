import type { IBaseRepository } from 'src/application/repositories/base.repository';
import type { Prisma, User } from '@prisma/client';

export type IUserRepository = IBaseRepository<
  Prisma.UserWhereUniqueInput,
  Prisma.UserCreateInput,
  Prisma.UserWhereInput,
  Prisma.UserSelect,
  Prisma.UserUpdateInput,
  User
>;
