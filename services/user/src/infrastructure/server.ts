import type { IEnvConfig } from 'src/application/types/global';
import createFastifyServer, {
  type FastifyInstance,
  type FastifyServerOptions,
} from 'fastify';
import swaggerPlugin from '@fastify/swagger';
import swaggerUiPlugin from '@fastify/swagger-ui';
import routesPluginAsync from 'src/presentation/routes/routes.plugin';
import prismaPluginAsync from 'src/infrastructure/database/prisma.plugin';
import repositoryPluginAsync from 'src/infrastructure/repositories/repository.plugin';
import controllersPluginAsync from 'src/presentation/controllers/controllers.plugin';
import mapperPluginAsync from 'src/infrastructure/mappers/mapper.plugin';
import mainServicesPlugin from 'src/infrastructure/services/main.services.plugin';
import dependentServicesPluginAsync from 'src/infrastructure/services/dependent.services.plugin';
import schemasPluginAsync from 'src/infrastructure/schemas/schemas.plugin';
import rabbitmqPluginAsync from 'src/infrastructure/message-brokers/rabbitmq.plugin';
import publisherPluginAsync from 'src/infrastructure/publishers/publisher.plugin';
import validatorPluginAsync from 'src/infrastructure/validators/validator.plugin';
import httpAgentPluginAsync from 'src/infrastructure/agents/http.agent.plugin';
import handlerPluginAsync from 'src/infrastructure/handlers/handlers.plugin';
import getSwaggerOptions, {
  getSwaggerUiOptions,
} from 'src/infrastructure/configs/swagger';

const buildServerAsync = async (
  serverOptions: FastifyServerOptions,
  envConfig: IEnvConfig,
  isProduction: boolean = false,
): Promise<FastifyInstance> => {
  const server = createFastifyServer(serverOptions);

  await server.register(prismaPluginAsync, { isProduction });
  await server.register(repositoryPluginAsync, { prisma: server.prisma });
  await server.register(rabbitmqPluginAsync, { envConfig });
  await server.register(httpAgentPluginAsync);
  await server.register(schemasPluginAsync);
  await server.register(mainServicesPlugin);
  await server.register(validatorPluginAsync, {
    userRepository: server.userRepository,
  });
  await server.register(mapperPluginAsync, {
    cryptoService: server.cryptoService,
    envConfig,
  });
  await server.register(publisherPluginAsync, {
    rabbitMqChannel: server.rabbitMqChannel,
    emailMapper: server.emailMapper,
    envConfig,
  });
  await server.register(dependentServicesPluginAsync, {
    emailPublisher: server.emailPublisher,
    userRepository: server.userRepository,
    userValidator: server.userValidator,
    authValidator: server.authValidator,
    errorMapper: server.errorMapper,
    emailMapper: server.emailMapper,
    authMapper: server.authMapper,
    userMapper: server.userMapper,
    httpAgent: server.httpAgent,
    envConfig,
  });
  await server.register(handlerPluginAsync, {
    errorMapper: server.errorMapper,
    authService: server.authService,
  });
  await server.register(controllersPluginAsync, {
    statusService: server.statusService,
    userService: server.userService,
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
    userController: server.userController,
    authHandler: server.authHandler,
    prefix: envConfig.API_PREFIX,
  });

  return server;
};

export default buildServerAsync;
