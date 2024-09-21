import type { FastifyPluginAsync } from 'fastify';
import getHttpAgentOptions from 'src/infrastructure/configs/http';
import { fastifyPlugin } from 'fastify-plugin';
import { Agent } from 'undici';

const httpAgentPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const httpAgentOptions = getHttpAgentOptions();
  const agent = new Agent(httpAgentOptions);

  // Make HTTP Agent available through the fastify server instance
  server.decorate('httpAgent', agent);

  server.addHook('onClose', async (service): Promise<void> => {
    service.log.info('Closing HTTP agent...');
    await service.httpAgent.close();
    service.log.info('HTTP agent is closed.');
  });
};

export default fastifyPlugin(httpAgentPluginAsync);
