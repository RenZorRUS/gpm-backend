import type { FastifyPluginAsync } from 'fastify';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { IUserValidator } from 'src/application/validators/user.validator';
import type { IEnvConfig } from 'src/application/types/global';
import type { IAuthMapper } from 'src/application/mappers/auth.mapper';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { Agent as HttpAgent } from 'undici';
import { fastifyPlugin } from 'fastify-plugin';
import UserService from 'src/infrastructure/services/user.service';
import StatusService from 'src/infrastructure/services/status.service';
import AuthService from 'src/infrastructure/services/auth.service';
import HttpClient from 'src/infrastructure/clients/http.client';

export interface IDependentServicePluginOptions {
  emailPublisher: IEmailPublisher;
  userRepository: IUserRepository;
  userValidator: IUserValidator;
  authValidator: IAuthValidator;
  errorMapper: IErrorMapper;
  emailMapper: IEmailMapper;
  userMapper: IUserMapper;
  authMapper: IAuthMapper;
  envConfig: IEnvConfig;
  httpAgent: HttpAgent;
}

const dependentServicesPluginAsync: FastifyPluginAsync<
  IDependentServicePluginOptions
> = async (
  server,
  {
    emailPublisher,
    userRepository,
    userValidator,
    authValidator,
    errorMapper,
    emailMapper,
    userMapper,
    authMapper,
    envConfig,
    httpAgent,
  },
): Promise<void> => {
  const authHttpClient = new HttpClient(
    httpAgent,
    errorMapper,
    server.log,
    envConfig.AUTH_SERVICE_ORIGIN,
  );

  server.decorate('statusService', new StatusService(envConfig));
  server.decorate(
    'authService',
    new AuthService(authHttpClient, authMapper, authValidator, server.log),
  );
  server.decorate(
    'userService',
    new UserService(
      emailPublisher,
      emailMapper,
      userRepository,
      userMapper,
      userValidator,
    ),
  );
};

export default fastifyPlugin(dependentServicesPluginAsync);
