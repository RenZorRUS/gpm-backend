import type { ResponseError } from 'src/application/clients/http.client';
import type { IErrorDto } from 'src/application/dtos/common';
import type {
  IErrorMapper,
  ServiceErrors,
} from 'src/application/mappers/error.mapper';
import type { Dispatcher } from 'undici';
import BadRequestError from 'src/application/errors/bad.request.error';
import InternalServerError from 'src/application/errors/internal.server.error';
import NotFoundError from 'src/application/errors/not.found.error';
import UnauthorizedError from 'src/application/errors/unauthorized.error';
import { HTTP_CODE } from 'src/domain/constants/http';

export default class ErrorMapper implements IErrorMapper {
  public mapErrorToReply(error: ServiceErrors): IErrorDto {
    return {
      name: error.name,
      message: error.message,
    };
  }

  public async mapResponseErrorAsync(
    response: Dispatcher.ResponseData,
  ): Promise<ResponseError> {
    const errorMessage = await response.body.text();

    switch (response.statusCode) {
      case HTTP_CODE.BAD_REQUEST:
        return new BadRequestError(errorMessage);
      case HTTP_CODE.UNAUTHORIZED:
        return new UnauthorizedError(errorMessage);
      case HTTP_CODE.NOT_FOUND:
        return new NotFoundError(errorMessage);
      case HTTP_CODE.INTERNAL_SERVER_ERROR:
        return new InternalServerError(errorMessage);
      default:
        return new Error(errorMessage);
    }
  }
}
