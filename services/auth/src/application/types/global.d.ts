import type { IStatusService } from 'src/application/services/status.service';
import type { IAuthService } from 'src/application/services/auth.service';
import type { IErrorMapper } from 'src/application/mappers/error.mapper';
import type { IErrorHandler } from 'src/application/handlers/error.handler';
import type { IAuthValidator } from 'src/application/validators/auth.validator';
import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IUserService } from 'src/application/services/user.service';
import type { ITokenMapper } from 'src/application/mappers/token.mapper';
import type { Agent as HttpAgent } from 'undici';
import StatusController from 'src/presentation/controllers/status.controller';
import AuthController from 'src/presentation/controllers/auth.controller';

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
  USER_SERVICE_ORIGIN: string;
  ACCESS_TOKEN_EXPIRATION_TIME: string;
  REFRESH_TOKEN_EXPIRATION_TIME: string;
  JWT_TOKEN_ISSUER: string;
  JWT_PRIVATE_KEY_PATH: string;
  JWT_PUBLIC_KEY_PATH: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    // Services
    statusService: IStatusService;
    cryptoService: ICryptoService;
    authService: IAuthService;
    userService: IUserService;
    // Controllers
    statusController: StatusController;
    authController: AuthController;
    // Validators
    authValidator: IAuthValidator;
    // Handlers
    serviceErrorHandler: IErrorHandler;
    // Mappers
    errorMapper: IErrorMapper;
    tokenMapper: ITokenMapper;
    userMapper: IUserMapper;
    // Agents
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
