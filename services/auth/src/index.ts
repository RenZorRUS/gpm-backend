import type { IEnvConfig } from 'src/application/types/global';
import getServerOptions, {
  getServerListenOptions,
} from 'src/infrastructure/configs/server';
import buildServerAsync from 'src/infrastructure/server';
import isMainModule from 'src/infrastructure/utilities/common.utils';

/** Entry point of the authorization service */
const runServerAsync = async (
  isProduction: boolean,
  envConfig: IEnvConfig,
): Promise<void> => {
  const serverOptions = getServerOptions(isProduction);
  const server = await buildServerAsync(serverOptions, envConfig, isProduction);

  try {
    const listenOptions = getServerListenOptions(envConfig);
    await server.listen(listenOptions);
  } catch (error) {
    server.log.error(error);
    await server.close();
  }
};

if (isMainModule(process.argv)) {
  const isProduction = process.env.NODE_ENV === 'production';
  runServerAsync(isProduction, process.env);
}
