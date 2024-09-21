import type { ResponseError } from 'src/application/clients/http.client';
import type { IErrorDto } from 'src/application/dtos/common';
import type { Dispatcher } from 'undici';
import type { FastifyError } from 'fastify';
import type InternalServerError from 'src/application/errors/internal-server-error';
import type UnauthorizedError from 'src/application/errors/unauthorized.error';
import type BadRequestError from 'src/application/errors/bad-request.error';
import type ValidationError from 'src/application/errors/validation.error';
import type PublisherError from 'src/application/errors/publisher.error';
import type NotFoundError from 'src/application/errors/not-found.error';

export type ServiceErrors =
  | InternalServerError
  | UnauthorizedError
  | BadRequestError
  | ValidationError
  | PublisherError
  | NotFoundError
  | FastifyError
  | Error;

export interface IErrorMapper {
  mapResponseErrorAsync(
    response: Dispatcher.ResponseData,
  ): Promise<ResponseError>;

  mapErrorToReply(error: ServiceErrors): IErrorDto;
}
