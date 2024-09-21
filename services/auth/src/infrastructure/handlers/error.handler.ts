import type { IErrorHandler } from 'src/application/handlers/error.handler';
import type {
  IErrorMapper,
  ServiceErrors,
} from 'src/application/mappers/error.mapper';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_CODE } from 'src/domain/constants/http';

export default class ErrorHandler implements IErrorHandler {
  constructor(private readonly errorMapper: IErrorMapper) {}

  public async handleServiceErrorAsync(
    error: ServiceErrors,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const mappedError = this.errorMapper.mapErrorToReply(error);

    switch (error.name) {
      case 'NotFoundError':
        return reply.status(HTTP_CODE.NOT_FOUND).send(mappedError);
      case 'ValidationError':
      case 'BadRequestError':
        return reply.status(HTTP_CODE.BAD_REQUEST).send(mappedError);
      case 'UnauthorizedError':
        return reply.status(HTTP_CODE.UNAUTHORIZED).send(mappedError);
      case 'PublisherError':
      case 'InternalServerError':
      default:
        request.log.error(error);
        return reply.status(HTTP_CODE.INTERNAL_SERVER_ERROR).send(mappedError);
    }
  }
}
