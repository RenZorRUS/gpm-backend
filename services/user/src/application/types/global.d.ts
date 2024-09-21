import type { PrismaClient } from '@prisma/client';
import type { IUserService } from 'src/application/services/user.service';
import type { IStatusService } from 'src/application/services/status.service';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IUserValidator } from 'src/application/validators/user.validator';
import type { IAuthService } from 'src/application/services/auth.service';
import type { IAuthMapper } from 'src/application/mappers/auth.mapper';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { IErrorHandler } from 'src/application/handlers/error.handler';
import type { IAuthHandler } from 'src/application/handlers/auth.handler';
import type { Agent as HttpAgent } from 'undici';
import type {
  Connection as RabbitMqConnection,
  Channel as RabbitMqChannel,
} from 'amqplib';
import type StatusController from 'src/presentation/controllers/status.controller';
import type UserController from 'src/presentation/controllers/user.controller';

export type NodeEnv = 'development' | 'production';

export interface IEnvConfig {
  PORT: string;
  HOST: string;
  API_PREFIX: string;
  APP_VERSION: string;
  APP_TITLE: string;
  APP_DESCRIPTION: string;
  APP_CONTACT_NAME: string;
  APP_CONTACT_URL: string;
  APP_CONTACT_EMAIL: string;
  SWAGGER_PATH: string;
  RABBITMQ_URL: string;
  RABBITMQ_CONNECTION_NAME: string;
  RABBITMQ_EMAIL_QUEUE: string;
  RABBITMQ_EMAIL_EXCHANGE: string;
  RABBITMQ_EMAIL_KEY: string;
  RABBITMQ_DEAD_EMAIL_QUEUE: string;
  RABBITMQ_DEAD_EMAIL_EXCHANGE: string;
  RABBITMQ_DEAD_EMAIL_KEY: string;
  EMAIL_ACTIVATION_TOKEN_EXPIRATION_MIN: string;
  AUTH_SERVICE_ORIGIN: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    // Should be same as the `confKey` in envPlugin `options`
    config: IEnvConfig;
    // Database
    prisma: PrismaClient;
    // RabbitMQ
    rabbitMqConnection: RabbitMqConnection;
    rabbitMqChannel: RabbitMqChannel;
    // Publishers
    emailPublisher: IEmailPublisher;
    // Repositories
    userRepository: IUserRepository;
    // Services
    statusService: IStatusService;
    userService: IUserService;
    cryptoService: ICryptoService;
    authService: IAuthService;
    // Handlers
    serviceErrorHandler: IErrorHandler;
    authHandler: IAuthHandler;
    // Controllers
    statusController: StatusController;
    userController: UserController;
    // Mappers
    userMapper: IUserMapper;
    emailMapper: IEmailMapper;
    authMapper: IAuthMapper;
    errorMapper: IErrorMapper;
    // Validators
    userValidator: IUserValidator;
    authValidator: IAuthValidator;
    // HTTP Agent
    httpAgent: HttpAgent;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IEnvConfig {
      NODE_ENV: NodeEnv | undefined;
    }
  }
}
