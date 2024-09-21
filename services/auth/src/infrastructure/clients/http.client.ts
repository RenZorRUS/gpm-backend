import type {
  IBaseRequestOptions,
  IHttpClient,
  IRequestOptions,
  IResponse,
  RequestBody,
} from 'src/application/clients/http.client';
import type { Agent as HttpAgent } from 'undici';
import type { IncomingHttpHeaders } from 'undici/types/header';
import type { ILogger } from 'src/application/loggers/logger';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import {
  HTTP_CODE,
  HTTP_HEADER,
  HTTP_METHOD,
  MIME_TYPE,
} from 'src/domain/constants/http';
import { mapToFullUrl } from 'src/infrastructure/utilities/converters.utils';
import InternalServerError from 'src/application/errors/internal.server.error';

export default class HttpClient implements IHttpClient {
  constructor(
    private readonly httpAgent: HttpAgent,
    private readonly errorMapper: IErrorMapper,
    private readonly logger: ILogger,
    private readonly origin?: string,
  ) {}

  public async getAsync<TData>(
    options: IBaseRequestOptions,
  ): Promise<IResponse<TData>> {
    return this.sendRequestAsync(HTTP_METHOD.GET, options);
  }

  public async postAsync<TData>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>> {
    return this.sendRequestAsync(HTTP_METHOD.POST, options);
  }

  public async putAsync<TData>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>> {
    return this.sendRequestAsync(HTTP_METHOD.PUT, options);
  }

  public async deleteAsync<TData>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>> {
    return this.sendRequestAsync(HTTP_METHOD.DELETE, options);
  }

  public async patchAsync<TData>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>> {
    return this.sendRequestAsync(HTTP_METHOD.PATCH, options);
  }

  private async sendRequestAsync<TData>(
    method: HTTP_METHOD,
    options: IRequestOptions,
  ): Promise<IResponse<TData>> {
    const { body, origin, query, path } = options;
    const requestOrigin = origin ?? this.origin;

    try {
      const headers = HttpClient.buildRequestHeaders(method, options);
      const isBodyShouldBeSerialized = HttpClient.checkBodySerialization(
        method,
        headers,
        body,
      );

      const serializedBody = isBodyShouldBeSerialized
        ? JSON.stringify(body)
        : (body as RequestBody);

      const response = await this.httpAgent.request({
        origin: requestOrigin,
        body: serializedBody,
        headers,
        method,
        query,
        path,
      });

      const isResponseOk = HttpClient.checkIsResponseOk(response.statusCode);

      if (!isResponseOk) {
        const error = await this.errorMapper.mapResponseErrorAsync(response);
        return { error };
      }

      const isResponseHasJson = HttpClient.checkJsonHeader(response.headers);

      const data = isResponseHasJson
        ? ((await response.body.json()) as TData)
        : await response.body.text();

      return { data };
    } catch (error) {
      if (error instanceof Error) {
        const fullUrl = mapToFullUrl(path, requestOrigin, query);
        this.logger.error(
          `Failed to send ${method} request to: ${fullUrl}, error: ${error.message}`,
        );
      }
      throw new InternalServerError('Failed to send HTTP request');
    }
  }

  private static checkIsResponseOk(statusCode: number): boolean {
    return (
      statusCode >= HTTP_CODE.OK && statusCode < HTTP_CODE.MULTIPLE_CHOICES
    );
  }

  private static checkJsonHeader(headers: IncomingHttpHeaders): boolean {
    return !!headers[HTTP_HEADER.CONTENT_TYPE]?.includes(MIME_TYPE.JSON);
  }

  private static checkBodySerialization(
    method: HTTP_METHOD,
    headers: IncomingHttpHeaders,
    body?: IRequestOptions['body'],
  ): boolean {
    return (
      method !== HTTP_METHOD.GET &&
      headers[HTTP_HEADER.CONTENT_TYPE] === MIME_TYPE.JSON &&
      typeof body === 'object'
    );
  }

  private static buildRequestHeaders(
    method: HTTP_METHOD,
    options: IRequestOptions,
  ): IncomingHttpHeaders {
    const headers = options.headers ?? {};

    if (
      method !== HTTP_METHOD.GET &&
      !headers[HTTP_HEADER.CONTENT_TYPE] &&
      typeof options.body === 'object'
    ) {
      headers[HTTP_HEADER.CONTENT_TYPE] = MIME_TYPE.JSON;
    }

    return headers;
  }
}
