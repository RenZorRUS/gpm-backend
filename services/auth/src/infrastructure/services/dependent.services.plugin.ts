import type { IEnvConfig } from 'src/application/types/global';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { ITokenMapper } from 'src/application/mappers/token.mapper';
import type { FastifyPluginAsync } from 'fastify';
import type { Agent as HttpAgent } from 'undici';
import { buildJwtTokenUtilsAsync } from 'src/infrastructure/utilities/tokens.utils';
import StatusService from 'src/infrastructure/services/status.service';
import CryptoService from 'src/infrastructure/services/crypto.service';
import AuthService from 'src/infrastructure/services/auth.service';
import UserService from 'src/infrastructure/services/user.service';
import HttpClient from 'src/infrastructure/clients/http.client';
import { fastifyPlugin } from 'fastify-plugin';

export interface IDependentServicesPluginOptions {
  authValidator: IAuthValidator;
  tokenMapper: ITokenMapper;
  errorMapper: IErrorMapper;
  userMapper: IUserMapper;
  envConfig: IEnvConfig;
  httpAgent: HttpAgent;
}

const dependentServicesPluginAsync: FastifyPluginAsync<
  IDependentServicesPluginOptions
> = async (
  server,
  { envConfig, httpAgent, errorMapper, userMapper, authValidator, tokenMapper },
): Promise<void> => {
  const tokenUtils = await buildJwtTokenUtilsAsync(envConfig);
  const userHttpClient = new HttpClient(
    httpAgent,
    errorMapper,
    server.log,
    envConfig.USER_SERVICE_ORIGIN,
  );

  const userService = new UserService(userHttpClient, userMapper, server.log);
  const cryptoService = new CryptoService(tokenMapper, tokenUtils);

  server.decorate('statusService', new StatusService(envConfig));
  server.decorate('cryptoService', cryptoService);
  server.decorate('userService', userService);
  server.decorate(
    'authService',
    new AuthService(authValidator, cryptoService, userService),
  );
};

export default fastifyPlugin(dependentServicesPluginAsync);
