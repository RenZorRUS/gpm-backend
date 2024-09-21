import type { FastifyReply, FastifyRequest } from 'fastify';
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

export default class UserController {
  constructor(private readonly userService: IUserService) {}

  public async findManyAsync(
    request: FastifyRequest<{ Querystring: IPaginationQuery }>,
  ): Promise<IPaginationResponse<IUserDto>> {
    return this.userService.findManyByAsync({
      limit: request.query.limit ?? DEFAULT_PAGINATION_LIMIT,
      offset: request.query.offset ?? DEFAULT_PAGINATION_OFFSET,
    });
  }

  public async createAsync(
    request: FastifyRequest<{ Body: IChangeUserDto }>,
    reply: FastifyReply,
  ): Promise<IUserDto> {
    const user = await this.userService.createAsync(request.body);
    return reply.status(HTTP_CODE.CREATED).send(user);
  }

  public async findByIdAsync(
    request: FastifyRequest<{ Params: IFindUserByIdParams }>,
  ): Promise<IUserDto> {
    return this.userService.findByIdAsync(BigInt(request.params.userId));
  }

  public async updateByIdAsync(
    request: FastifyRequest<{ Params: IFindUserByIdParams; Body: IUserDto }>,
  ): Promise<IUserDto> {
    return this.userService.updateByIdAsync(
      BigInt(request.params.userId),
      request.body,
    );
  }

  public async deleteByIdAsync(
    request: FastifyRequest<{ Params: IFindUserByIdParams }>,
    reply: FastifyReply,
  ): Promise<void> {
    await this.userService.deleteByIdAsync(BigInt(request.params.userId));
    return reply.status(HTTP_CODE.NO_CONTENT).send();
  }
}
