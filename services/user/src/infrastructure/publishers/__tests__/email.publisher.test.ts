import type { Channel as RabbitMqChannel } from 'amqplib';
import { describe, test, expect } from '@jest/globals';
import EmailPublisher from 'src/infrastructure/publishers/email.publisher';
import {
  createEnvConfig,
  createEmailVerificationMessage,
  createRabbitMqChannelMock,
  createLoggerMock,
} from 'src/infrastructure/publishers/__tests__/publisher.test.utils';
import EmailMapper from 'src/infrastructure/mappers/email.mapper';
import PublisherError from 'src/application/errors/publisher.error';

describe('Class: EmailPublisher', (): void => {
  const DEFAULT_PUBLISHER_OPTIONS = {
    persistent: true,
  };

  const emailMessage = createEmailVerificationMessage();
  const emailMapper = new EmailMapper();
  const envConfig = createEnvConfig();
  const serializedMessage =
    emailMapper.serializeEmailVerificationMessage(emailMessage);
  const messageByteContent = Buffer.from(serializedMessage);

  describe('Method: publishVerificationEmailAsync()', (): void => {
    test.concurrent(
      'Should successfully publish message to the message broker',
      async (): Promise<void> => {
        // Prepare
        const rabbitMqChannelMock = createRabbitMqChannelMock();
        const loggerMock = createLoggerMock();

        rabbitMqChannelMock.publish.mockReturnValueOnce(true);

        const emailPublisher = new EmailPublisher(
          rabbitMqChannelMock,
          emailMapper,
          envConfig,
          loggerMock,
        );

        // Perform
        await emailPublisher.publishVerificationEmailAsync(emailMessage);

        // Validate
        expect(rabbitMqChannelMock.publish).toHaveBeenNthCalledWith(
          1,
          envConfig.RABBITMQ_EMAIL_EXCHANGE,
          envConfig.RABBITMQ_EMAIL_KEY,
          messageByteContent,
          DEFAULT_PUBLISHER_OPTIONS,
        );
      },
    );

    // https://stackoverflow.com/a/18933853/25203640
    test.concurrent(
      'Should wait until drain event if emitted in case of full internal message buffer',
      async (): Promise<void> => {
        // Prepare
        const rabbitMqChannelMock = createRabbitMqChannelMock();
        const loggerMock = createLoggerMock();

        rabbitMqChannelMock.publish.mockReturnValueOnce(false);
        rabbitMqChannelMock.once.mockImplementationOnce(
          (_, callback): RabbitMqChannel => {
            callback();
            return rabbitMqChannelMock;
          },
        );

        const emailPublisher = new EmailPublisher(
          rabbitMqChannelMock,
          emailMapper,
          envConfig,
          loggerMock,
        );

        // Perform
        await emailPublisher.publishVerificationEmailAsync(emailMessage);

        // Validate
        expect(rabbitMqChannelMock.publish).toHaveBeenNthCalledWith(
          1,
          envConfig.RABBITMQ_EMAIL_EXCHANGE,
          envConfig.RABBITMQ_EMAIL_KEY,
          messageByteContent,
          DEFAULT_PUBLISHER_OPTIONS,
        );
        expect(rabbitMqChannelMock.once).toHaveBeenCalledTimes(1);
      },
    );

    test.concurrent(
      'Should throw a publisher error if RabbitMQ channel throws error during message publishing',
      async (): Promise<void> => {
        // Prepare
        const rabbitMqChannelMock = createRabbitMqChannelMock();
        const loggerMock = createLoggerMock();
        const expectedError = new PublisherError(
          `Failed to publish email verification message for ${emailMessage.email}`,
        );

        rabbitMqChannelMock.publish.mockImplementationOnce((): never => {
          throw expectedError;
        });
        loggerMock.error.mockReturnValueOnce();

        const emailPublisher = new EmailPublisher(
          rabbitMqChannelMock,
          emailMapper,
          envConfig,
          loggerMock,
        );

        // Perform
        await expect(
          (): Promise<void> =>
            emailPublisher.publishVerificationEmailAsync(emailMessage),
        ).rejects.toThrowError(expectedError);

        // Validate
        expect(rabbitMqChannelMock.publish).toHaveBeenNthCalledWith(
          1,
          envConfig.RABBITMQ_EMAIL_EXCHANGE,
          envConfig.RABBITMQ_EMAIL_KEY,
          messageByteContent,
          DEFAULT_PUBLISHER_OPTIONS,
        );
        expect(loggerMock.error).toHaveBeenCalledTimes(1);
      },
    );
  });
});
