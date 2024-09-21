import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import type { Channel as RabbitMqChannel } from 'amqplib';
import type { IEnvConfig } from 'src/application/types/global';
import type { ILogger } from 'src/application/loggers/logger';
import { fakerEN_US } from '@faker-js/faker';
import { jest } from '@jest/globals';

export const createEmailVerificationMessage =
  (): IEmailVerificationMessage => ({
    activationTokenExpiration: fakerEN_US.date.recent(),
    activationToken: fakerEN_US.internet.password(),
    firstName: fakerEN_US.person.firstName(),
    lastName: fakerEN_US.person.lastName(),
    userId: fakerEN_US.number.int(),
    email: fakerEN_US.internet.email(),
  });

export const createRabbitMqChannelMock = (): jest.Mocked<RabbitMqChannel> =>
  ({
    publish: jest.fn<RabbitMqChannel['publish']>(),
    once: jest.fn<RabbitMqChannel['once']>(),
  }) as unknown as jest.Mocked<RabbitMqChannel>;

export const createEnvConfig = (): IEnvConfig => ({
  PORT: fakerEN_US.number.int().toString(),
  HOST: fakerEN_US.internet.ip(),
  API_PREFIX: '/api',
  APP_VERSION: '0.0.1',
  APP_TITLE: 'User Service',
  APP_DESCRIPTION: 'Service description...',
  APP_CONTACT_NAME: fakerEN_US.person.fullName(),
  APP_CONTACT_URL: fakerEN_US.internet.url(),
  APP_CONTACT_EMAIL: fakerEN_US.internet.email(),
  SWAGGER_PATH: '/swagger/docs',
  RABBITMQ_URL: fakerEN_US.internet.url(),
  RABBITMQ_CONNECTION_NAME: fakerEN_US.internet.url(),
  RABBITMQ_EMAIL_QUEUE: 'email-queue',
  RABBITMQ_EMAIL_EXCHANGE: 'email-exchange',
  RABBITMQ_EMAIL_KEY: 'email-key',
  RABBITMQ_DEAD_EMAIL_QUEUE: 'dead-email-queue',
  RABBITMQ_DEAD_EMAIL_EXCHANGE: 'dead-email-exchange',
  RABBITMQ_DEAD_EMAIL_KEY: 'dead-email-key',
  EMAIL_ACTIVATION_TOKEN_EXPIRATION_MIN: '30',
  AUTH_SERVICE_ORIGIN: 'http://localhost:8081',
});

export const createLoggerMock = (): jest.Mocked<ILogger> => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
});
