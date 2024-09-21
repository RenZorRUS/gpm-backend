import type { FastifyPluginAsync } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import ErrorMapper from 'src/infrastructure/mappers/error.mapper';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import TokenMapper from 'src/infrastructure/mappers/token.mapper';

const mappersPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  server.decorate('errorMapper', new ErrorMapper());
  server.decorate('userMapper', new UserMapper());
  server.decorate('tokenMapper', new TokenMapper());
};

export default fastifyPlugin(mappersPluginAsync);
