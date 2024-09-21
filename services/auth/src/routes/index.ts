import type { FastifyPluginAsync } from 'fastify';
import statusRoutesPlugin from 'src/routes/status';

const addRoutesPlugin: FastifyPluginAsync = async (server): Promise<void> => {
  await server.register(statusRoutesPlugin);
};

export default addRoutesPlugin;
