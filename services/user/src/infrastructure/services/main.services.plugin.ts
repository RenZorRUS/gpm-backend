import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import CryptoService from 'src/infrastructure/services/crypto.service';

const mainServicesPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  server.decorate('cryptoService', new CryptoService());
};

export default fastifyPlugin(mainServicesPluginAsync);
