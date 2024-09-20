export type NodeEnv = 'development' | 'production';
export type EnvConfig = {
  PORT: number;
  HOST: string;
  API_PREFIX: string;
  SERVICE_VERSION: string;
};

declare module 'fastify' {
  interface FastifyInstance {
    // Should be same as the `confKey` in envPlugin `options`
    config: EnvConfig;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvConfig {
      NODE_ENV: NodeEnv | undefined;
    }
  }
}
