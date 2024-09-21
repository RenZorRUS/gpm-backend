import type { PrismaClient, User } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { IFindManyDto } from 'src/application/dtos/common';
import type {
  ICreateModelOptions,
  IFindManyModelOptions,
  IFindOneModelOptions,
  IUpdateModelOptions,
} from 'src/application/repositories/base.repository';
import NotFoundError from 'src/application/errors/not-found.error';
import { objectToPropsString } from 'src/infrastructure/utilities/converters';

export type UpdateUserOptions = IUpdateModelOptions<
  Prisma.UserUpdateInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserSelect
>;
export type FindOneUserOptions = IFindOneModelOptions<
  Prisma.UserWhereInput,
  Prisma.UserSelect
>;
export type FindManyUsersOptions = IFindManyModelOptions<
  Prisma.UserWhereInput,
  Prisma.UserSelect
>;

export default class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAsync(options: FindOneUserOptions): Promise<User | null> {
    return this.prisma.user.findFirst(options);
  }

  public async findOrThrowAsync(options: FindOneUserOptions): Promise<User> {
    const user = await this.prisma.user.findFirst(options);

    if (!user) {
      throw new NotFoundError(
        `User matching: ${objectToPropsString(options.where)} not found!`,
      );
    }

    return user;
  }

  public async findManyAsync(
    options: FindManyUsersOptions,
  ): Promise<IFindManyDto<User>> {
    const findQuery = this.prisma.user.findMany({
      where: options.where as Prisma.UserWhereInput,
      select: options.select as Prisma.UserSelect,
      skip: options.offset,
      take: options.limit,
    });
    const countTotalQuery = this.prisma.user.count({
      where: options.where as Prisma.UserWhereInput,
    });

    const [data, total] = await this.prisma.$transaction([
      findQuery,
      countTotalQuery,
    ]);

    return { total, data };
  }

  public async countByAsync(where: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }

  public async checkExistsAsync(
    where: Prisma.UserWhereInput,
  ): Promise<boolean> {
    const userCount = await this.prisma.user.count({ where });
    return userCount > 0;
  }

  public async deleteAsync(where: Prisma.UserWhereUniqueInput): Promise<void> {
    await this.prisma.user.delete({ where });
  }

  public async updateAsync(options: UpdateUserOptions): Promise<User> {
    return this.prisma.user.update(options);
  }

  public async createAsync(
    options: ICreateModelOptions<Prisma.UserCreateInput, Prisma.UserSelect>,
  ): Promise<User> {
    return this.prisma.user.create(options);
  }

  get runQueriesInTransactionAsync(): PrismaClient['$transaction'] {
    return this.prisma.$transaction;
  }
}
