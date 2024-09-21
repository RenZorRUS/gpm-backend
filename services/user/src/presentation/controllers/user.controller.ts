import type {
  FastifyReply,
  FastifyRequest,
  RequestGenericInterface,
} from 'fastify';
import type {
  IPaginationQuery,
  IPaginationResponse,
} from 'src/application/dtos/common';
import type { IChangeUserDto, IUserDto } from 'src/application/dtos/users';
import type { IUserService } from 'src/application/services/user.service';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from 'src/domain/constants/common';
import { HTTP_CODE } from 'src/domain/constants/http';

export interface IFindUserByIdParams {
  userId: string;
}
export interface IFindUserByOptions extends RequestGenericInterface {
  Body: Partial<IUserDto>;
}
export interface IFindManyUsersOptions extends RequestGenericInterface {
  Querystring: IPaginationQuery;
}
export interface ICreateUserOptions extends RequestGenericInterface {
  Body: IChangeUserDto;
}
export interface IFindUserByIdOptions extends RequestGenericInterface {
  Params: IFindUserByIdParams;
}
export interface IUpdateUserByIdOptions extends IFindUserByIdOptions {
  Body: IChangeUserDto;
}

export default class UserController {
  constructor(private readonly userService: IUserService) {}

  public async findManyAsync({
    query: { limit, offset },
  }: FastifyRequest<IFindManyUsersOptions>): Promise<
    IPaginationResponse<IUserDto>
  > {
    return this.userService.findManyByAsync({
      limit: limit ?? DEFAULT_PAGINATION_LIMIT,
      offset: offset ?? DEFAULT_PAGINATION_OFFSET,
    });
  }

  public async createAsync(
    { body }: FastifyRequest<ICreateUserOptions>,
    reply: FastifyReply,
  ): Promise<IUserDto> {
    const user = await this.userService.createAsync(body);
    return reply.status(HTTP_CODE.CREATED).send(user);
  }

  public async findByAsync({
    body,
  }: FastifyRequest<IFindUserByOptions>): Promise<IUserDto> {
    const user = await this.userService.findByAsync(body);
    return user;
  }

  public async findByIdAsync({
    params: { userId },
  }: FastifyRequest<IFindUserByIdOptions>): Promise<IUserDto> {
    return this.userService.findByIdAsync(BigInt(userId));
  }

  public async updateByIdAsync({
    params: { userId },
    body,
  }: FastifyRequest<IUpdateUserByIdOptions>): Promise<IUserDto> {
    return this.userService.updateByIdAsync(BigInt(userId), body);
  }

  public async deleteByIdAsync(
    { params: { userId } }: FastifyRequest<IFindUserByIdOptions>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.userService.deleteByIdAsync(BigInt(userId));
    return reply.status(HTTP_CODE.NO_CONTENT).send();
  }
}
