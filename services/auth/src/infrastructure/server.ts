import type { IEnvConfig } from 'src/application/types/global';
import createFastifyServer, {
  type FastifyInstance,
  type FastifyServerOptions,
} from 'fastify';
import swaggerPlugin from '@fastify/swagger';
import swaggerUiPlugin from '@fastify/swagger-ui';
import routesPluginAsync from 'src/presentation/routes/routes.plugin';
import dependentServicesPluginAsync from 'src/infrastructure/services/dependent.services.plugin';
import controllersPluginAsync from 'src/presentation/controllers/controllers.plugin';
import schemasPluginAsync from 'src/infrastructure/schemas/schemas.plugin';
import httpAgentPluginAsync from 'src/infrastructure/agents/http.agent.plugin';
import handlersPluginAsync from 'src/infrastructure/handlers/handlers.plugin';
import mappersPluginAsync from 'src/infrastructure/mappers/mappers.plugin';
import validatorsPluginAsync from 'src/infrastructure/validators/validators.plugin';
import getSwaggerOptions, {
  getSwaggerUiOptions,
} from 'src/infrastructure/configs/swagger';

const buildServerAsync = async (
  serverOptions: FastifyServerOptions,
  envConfig: IEnvConfig,
  isProduction: boolean = false,
): Promise<FastifyInstance> => {
  const server = createFastifyServer(serverOptions);

  await server.register(schemasPluginAsync);
  await server.register(httpAgentPluginAsync);
  await server.register(mappersPluginAsync);
  await server.register(validatorsPluginAsync);
  await server.register(dependentServicesPluginAsync, {
    authValidator: server.authValidator,
    tokenMapper: server.tokenMapper,
    errorMapper: server.errorMapper,
    userMapper: server.userMapper,
    httpAgent: server.httpAgent,
    envConfig,
  });
  await server.register(handlersPluginAsync, {
    errorMapper: server.errorMapper,
  });
  await server.register(controllersPluginAsync, {
    statusService: server.statusService,
    authService: server.authService,
  });

  if (!isProduction) {
    const swaggerOptions = getSwaggerOptions(envConfig);
    const swaggerUiOptions = getSwaggerUiOptions(envConfig);
    await server.register(swaggerPlugin, swaggerOptions);
    await server.register(swaggerUiPlugin, swaggerUiOptions);
  }

  server.setErrorHandler(server.serviceErrorHandler.handleServiceErrorAsync);

  await server.register(routesPluginAsync, {
    statusController: server.statusController,
    authController: server.authController,
    prefix: envConfig.API_PREFIX,
  });

  return server;
};

export default buildServerAsync;
