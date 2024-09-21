import type { FastifyRequest } from 'fastify';

export interface IAuthHandler {
  checkBearerTokenAsync(request: FastifyRequest): Promise<void>;
}
