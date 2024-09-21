import type { FastifyPluginAsync } from 'fastify';
import type { ICryptoService } from 'src/application/services/crypto.service';
import type { IEnvConfig } from 'src/application/types/global';
import { fastifyPlugin } from 'fastify-plugin';
import UserMapper from 'src/infrastructure/mappers/user.mapper';
import EmailMapper from 'src/infrastructure/mappers/email.mapper';
import AuthMapper from 'src/infrastructure/mappers/auth.mapper';
import ErrorMapper from 'src/infrastructure/mappers/error.mapper';

export interface IMapperPluginOptions {
  cryptoService: ICryptoService;
  envConfig: IEnvConfig;
}

const mapperPluginAsync: FastifyPluginAsync<IMapperPluginOptions> = async (
  server,
  { cryptoService, envConfig },
): Promise<void> => {
  server.decorate('userMapper', new UserMapper(cryptoService, envConfig));
  server.decorate('errorMapper', new ErrorMapper());
  server.decorate('authMapper', new AuthMapper());
  server.decorate('emailMapper', new EmailMapper());
};

export default fastifyPlugin(mapperPluginAsync);
