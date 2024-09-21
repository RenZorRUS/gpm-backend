import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ServiceErrors } from 'src/application/mappers/error.mapper';

export interface IErrorHandler {
  handleServiceErrorAsync(
    error: ServiceErrors,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void>;
}
