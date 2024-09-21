import type { FastifyRequest, RequestGenericInterface } from 'fastify';

export interface IAuthHandler {
  checkBearerTokenAsync<TRequest extends RequestGenericInterface>(
    request: FastifyRequest<{
      Querystring: TRequest['Querystring'];
      Headers: TRequest['Headers'];
      Params: TRequest['Params'];
      Body: TRequest['Body'];
    }>,
  ): Promise<void>;
}
