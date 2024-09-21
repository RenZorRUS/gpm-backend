import type { Readable } from 'stream';
import type NotFoundError from 'src/application/errors/not-found.error';
import type InternalServerError from 'src/application/errors/internal-server-error';
import type BadRequestError from 'src/application/errors/bad-request.error';

export type QueryValue = string | number | boolean | null;
export type QueryParams = Record<string, QueryValue>;
export type IncomingHttpHeaders = Record<string, string | undefined>;
export type RequestBody =
  | Uint8Array
  | Readable
  | string
  | Buffer
  | null
  | undefined;
export type ResponseError =
  | InternalServerError
  | BadRequestError
  | NotFoundError
  | Error;

export interface IBaseRequestOptions {
  readonly headers?: IncomingHttpHeaders;
  readonly query?: QueryParams;
  readonly origin?: string;
  readonly path: string;
}

export interface IRequestOptions extends IBaseRequestOptions {
  readonly body?: RequestBody | object;
}

export interface IResponse<TData = unknown> {
  readonly data?: TData | string;
  readonly error?: ResponseError;
}

export interface IHttpClient {
  getAsync<TData = unknown>(
    options: IBaseRequestOptions,
  ): Promise<IResponse<TData>>;

  postAsync<TData = unknown>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>>;

  putAsync<TData = unknown>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>>;

  deleteAsync<TData = unknown>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>>;

  patchAsync<TData = unknown>(
    options: IRequestOptions,
  ): Promise<IResponse<TData>>;
}
