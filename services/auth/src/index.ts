import createFastifyServer, { type FastifyPluginAsync } from 'fastify';
import envPlugin from '@fastify/env';
import getServerOptions, { getServerListenOptions } from 'src/configs/server';
import getEnvOptions from 'src/configs/env';
import isMainModule from 'src/utilities/common';
import addRoutesPlugin from 'src/routes';

/**
 * Everything in Fastify is a plugin.
 * Plugin allows us easily import it in our testing suite and
 * add this application as a sub-component of another Fastify app.
 */
const initServerPlugin: FastifyPluginAsync = async (server): Promise<void> => {
  const envOptions = getEnvOptions(process.env.NODE_ENV);
  await server.register(envPlugin, envOptions);
  await server.register(addRoutesPlugin, { prefix: server.config.API_PREFIX });
};

/**
 * Entry point of our application
 */
const runServerAsync = async (): Promise<void> => {
  const serverOptions = getServerOptions(process.env.NODE_ENV);
  const server = createFastifyServer(serverOptions);

  await server.register(initServerPlugin);

  try {
    const listenOptions = getServerListenOptions(process.env);
    await server.listen(listenOptions);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

if (isMainModule()) {
  runServerAsync();
}

export default initServerPlugin;
