import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import type { IEmailPublisher } from 'src/application/publishers/email.publisher';
import type { IEnvConfig } from 'src/application/types/global';
import type { Options, Channel as RabbitMqChannel } from 'amqplib';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import PublisherError from 'src/application/errors/publisher.error';
import type { ILogger } from 'src/application/loggers/logger';

export default class EmailPublisher implements IEmailPublisher {
  private static readonly DEFAULT_OPTIONS: Options.Publish = {
    persistent: true, // message will survive broker restarts
  };

  constructor(
    private readonly rabbitMqChannel: RabbitMqChannel,
    private readonly emailMapper: IEmailMapper,
    private readonly envConfig: IEnvConfig,
    private readonly logger: ILogger,
  ) {}

  public async publishVerificationEmailAsync(
    message: IEmailVerificationMessage,
  ): Promise<void> {
    try {
      const serializedMessage =
        this.emailMapper.serializeEmailVerificationMessage(message);

      const isPublished = this.rabbitMqChannel.publish(
        this.envConfig.RABBITMQ_EMAIL_EXCHANGE,
        this.envConfig.RABBITMQ_EMAIL_KEY,
        Buffer.from(serializedMessage),
        EmailPublisher.DEFAULT_OPTIONS,
      );

      if (!isPublished) {
        await new Promise(
          (resolve): RabbitMqChannel =>
            this.rabbitMqChannel.once('drain', resolve),
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = `Failed to publish email verification message for ${message.email}`;
        this.logger.error(`${errorMessage}, error: ${error.message}`);
        throw new PublisherError(errorMessage);
      }
    }
  }
}
