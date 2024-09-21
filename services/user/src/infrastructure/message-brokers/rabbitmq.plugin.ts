import type { FastifyPluginAsync } from 'fastify';
import type { IEnvConfig } from 'src/application/types/global';
import type { ILogger } from 'src/application/loggers/logger';
import { fastifyPlugin } from 'fastify-plugin';
import { AMQP_ENTITY_TYPE, EXCHANGE_TYPE } from 'src/domain/constants/amqp';
import {
  connect,
  type Options,
  type Channel as RabbitMqChannel,
  type Connection as RabbitMqConnection,
} from 'amqplib';

export interface IRabbitMqPluginOptions {
  envConfig: IEnvConfig;
}
export interface IAmqpEntityExistenceParams {
  /** Connection to the RabbitMQ server */
  readonly connection: RabbitMqConnection;
  /** Entity type to check (queue or exchange) */
  readonly type: AMQP_ENTITY_TYPE;
  /** Logger instance */
  readonly logger: ILogger;
  /** Name of the entity to check (e.g. `email-queue`, `email-exchange`) */
  readonly name: string;
}

export interface ICreateExchangeParams {
  /** Options for creating an exchange */
  readonly options: Options.AssertExchange;
  /** Connection to the RabbitMQ server */
  readonly connection: RabbitMqConnection;
  /** Channel on which to issue commands, send messages */
  readonly channel: RabbitMqChannel;
  /** Exchange type (e.g. direct, topic, headers, fanout, match) */
  readonly type: EXCHANGE_TYPE;
  /** Logger instance */
  readonly logger: ILogger;
  /** Exchange name */
  readonly name: string;
}

export interface ICreateQueueParams {
  /** * Connection to the RabbitMQ server */
  readonly connection: RabbitMqConnection;
  /** Options for creating a queue */
  readonly options: Options.AssertQueue;
  /** Channel on which to issue commands, send messages */
  readonly channel: RabbitMqChannel;
  /** Logger instance */
  readonly logger: ILogger;
  /** Queue name */
  readonly name: string;
}

/**
 * - All protocols (ex: AMQP, MQTT) supported by RabbitMQ are TCP-based
 * and assume long-lived connections (a new connection is not opened
 * per protocol operation) for efficiency.
 * - Use separate connections to publish and consume
 *
 * @returns A TCP connection to the RabbitMQ server
 */
export const connectToRabbitMqAsync = async (
  connectionUrl: string,
  connectionName: string,
): Promise<RabbitMqConnection> => {
  try {
    const connection = await connect(connectionUrl, {
      clientProperties: { connection_name: connectionName },
    });
    return connection;
  } catch (error) {
    throw new Error(`Failed to connect to RabbitMQ server: ${error}`);
  }
};

/**
 * - Channel is a logical connections to the broker
 * (one TCP connection can be shared across multiple channels)
 * - Every protocol operation performed by a client happens on a channel
 * - Every channel is completely separate from another channel
 * - Channel only exists in the context of a connection and never on its own
 * - Reuse the same channel per thread for publishing
 *
 * @returns lightweight connections that share a single TCP connection
 */
export const createChannelAsync = async (
  connection: RabbitMqConnection,
): Promise<RabbitMqChannel> => {
  try {
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    throw new Error(`Failed to create RabbitMQ channel: ${error}`);
  }
};

/**
 * - We can't check AMQP entity existence without risking to destroy the channel.
 * - The workaround is to create a temporary channel which we can use to do the check.
 * - The behavior of `check<AMQP entity>` is dictated by the protocol
 */
export const checkAmqpEntityExistenceAsync = async ({
  connection,
  logger,
  type,
  name,
}: IAmqpEntityExistenceParams): Promise<boolean> => {
  const tempChannel = await createChannelAsync(connection);

  return new Promise((resolve): void => {
    tempChannel.once('close', (): void =>
      logger.info(`AMQP ${type}: '${name}' channel closed.`),
    );
    tempChannel.once('error', async (error: Error): Promise<void> => {
      logger.info(error.message);
      resolve(false);
    });

    const checkEntityExistencePromise =
      type === AMQP_ENTITY_TYPE.QUEUE
        ? tempChannel.checkQueue(name)
        : tempChannel.checkExchange(name);

    checkEntityExistencePromise
      .then((): void => {
        tempChannel.close().then((): void => {
          logger.info(`AMQP ${type} ${name} exists.`);
          resolve(true);
        });
      })
      .catch((): void => resolve(false));
  });
};

/** Exchanges distribute message copies to queues using rules called `bindings` */
export const createExchangeAsync = async ({
  connection,
  channel,
  options,
  logger,
  type,
  name,
}: ICreateExchangeParams): Promise<void> => {
  const isExchangeExist = await checkAmqpEntityExistenceAsync({
    type: AMQP_ENTITY_TYPE.EXCHANGE,
    connection,
    logger,
    name,
  });

  if (!isExchangeExist) {
    await channel.assertExchange(name, type, options);
  }
};

/**
 * - Queue (in RabbitMQ) is an ordered FIFO collection of messages ("first in, first out")
 * - Queues have names so that applications can reference them
 */
export const createQueueAsync = async ({
  connection,
  options,
  channel,
  logger,
  name,
}: ICreateQueueParams): Promise<void> => {
  const isQueueExist = await checkAmqpEntityExistenceAsync({
    type: AMQP_ENTITY_TYPE.QUEUE,
    connection,
    logger,
    name,
  });

  if (!isQueueExist) {
    await channel.assertQueue(name, options);
  }
};

/**
 * Creates AMQP entities related to the email message handling
 * Docs: https://www.rabbitmq.com/tutorials/amqp-concepts
 */
export const createAmqpEmailEntitiesAsync = async (
  connection: RabbitMqConnection,
  channel: RabbitMqChannel,
  config: IEnvConfig,
  logger: ILogger,
): Promise<void> => {
  const BASE_QUEUE_OPTIONS = {
    durable: true, // queue will survive broker restarts
    exclusive: false, // scopes the queue to the connection
    autoDelete: false, // queue will be deleted when the number of consumers drops to zero
  };
  const BASE_EXCHANGE_OPTIONS = {
    durable: true,
    internal: false, // messages cannot be published directly to the exchange (i.e., only target of bindings)
    autoDelete: false,
  };

  // Dead AMQP email entities
  await createQueueAsync({
    name: config.RABBITMQ_DEAD_EMAIL_QUEUE,
    options: BASE_QUEUE_OPTIONS,
    connection,
    channel,
    logger,
  });
  await createExchangeAsync({
    name: config.RABBITMQ_DEAD_EMAIL_EXCHANGE,
    options: BASE_EXCHANGE_OPTIONS,
    type: EXCHANGE_TYPE.DIRECT,
    connection,
    channel,
    logger,
  });
  await channel.bindQueue(
    config.RABBITMQ_DEAD_EMAIL_QUEUE,
    config.RABBITMQ_DEAD_EMAIL_EXCHANGE,
    config.RABBITMQ_DEAD_EMAIL_KEY,
  );

  // Normal AMQP email entities
  await createQueueAsync({
    name: config.RABBITMQ_EMAIL_QUEUE,
    connection,
    channel,
    logger,
    options: {
      ...BASE_QUEUE_OPTIONS,
      maxLength: 100, // maximum number of messages allowed on the queue
      deadLetterExchange: config.RABBITMQ_DEAD_EMAIL_EXCHANGE, // exchange to which messages discarded from the queue (ex: expired, rejected or the queue limit is reached) will be resent
      deadLetterRoutingKey: config.RABBITMQ_DEAD_EMAIL_KEY, // set a routing key for discarded messages
    },
  });
  await createExchangeAsync({
    name: config.RABBITMQ_EMAIL_EXCHANGE,
    type: EXCHANGE_TYPE.DIRECT,
    connection,
    channel,
    logger,
    options: {
      ...BASE_EXCHANGE_OPTIONS,
      alternateExchange: config.RABBITMQ_DEAD_EMAIL_EXCHANGE,
    },
  });
  await channel.bindQueue(
    config.RABBITMQ_EMAIL_QUEUE,
    config.RABBITMQ_EMAIL_EXCHANGE,
    config.RABBITMQ_EMAIL_KEY,
  );
};

/**
 * RabbitMQ plugin does the following steps:
 * 1. Connect to the RabbitMQ server
 * 2. Create one or more channels on which to issue commands, send messages
 * 3. Initialize RabbitMQ resources (ex: queue, exchange, binding)
 */
const rabbitmqPluginAsync: FastifyPluginAsync<IRabbitMqPluginOptions> = async (
  server,
  { envConfig },
): Promise<void> => {
  server.log.info('Connecting to RabbitMQ server...');
  const connection = await connectToRabbitMqAsync(
    envConfig.RABBITMQ_URL,
    envConfig.RABBITMQ_CONNECTION_NAME,
  );
  server.log.info('Connected to RabbitMQ server.');

  server.log.info('Creating RabbitMQ channel...');
  const channel = await createChannelAsync(connection);
  server.log.info('Created RabbitMQ channel.');

  await createAmqpEmailEntitiesAsync(
    connection,
    channel,
    envConfig,
    server.log,
  );

  // Make RabbitMQ connection & channel available through the fastify server instance
  server.decorate('rabbitMqConnection', connection);
  server.decorate('rabbitMqChannel', channel);

  server.addHook('onClose', async (service): Promise<void> => {
    service.log.info('Disconnecting from the RabbitMQ...');
    await service.rabbitMqChannel.close();
    await service.rabbitMqConnection.close();
    service.log.info('Disconnected from the RabbitMQ.');
  });
};

export default fastifyPlugin(rabbitmqPluginAsync);
