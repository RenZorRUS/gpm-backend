import type { FastifyPluginAsync } from 'fastify';
import type { Channel as RabbitMqChannel } from 'amqplib';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import type { IEnvConfig } from 'src/application/types/global';
import { fastifyPlugin } from 'fastify-plugin';
import EmailPublisher from 'src/infrastructure/publishers/email.publisher';

export interface IPublisherPluginOptions {
  rabbitMqChannel: RabbitMqChannel;
  emailMapper: IEmailMapper;
  envConfig: IEnvConfig;
}

const publisherPluginAsync: FastifyPluginAsync<
  IPublisherPluginOptions
> = async (
  server,
  { rabbitMqChannel, emailMapper, envConfig },
): Promise<void> => {
  server.decorate(
    'emailPublisher',
    new EmailPublisher(rabbitMqChannel, emailMapper, envConfig, server.log),
  );
};

export default fastifyPlugin(publisherPluginAsync);
