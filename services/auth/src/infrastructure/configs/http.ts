import { interceptors, type Agent } from 'undici';

const getHttpAgentOptions = (): Agent.Options => ({
  maxHeaderSize: 16 * 1024, // 16kb
  headersTimeout: 300e3, // 300 seconds
  connectTimeout: 30e3, // 30 seconds
  bodyTimeout: 300e3, // 300 seconds
  keepAliveTimeout: 30e3, // 30 seconds
  keepAliveMaxTimeout: 600e3, // 600 seconds
  strictContentLength: true,
  connections: null,
  pipelining: 1,
  interceptors: {
    Client: [
      interceptors.redirect({ maxRedirections: 3 }),
      interceptors.retry({
        maxRetries: 3,
        minTimeout: 1e3, // 1 second
        maxTimeout: 10e3, // 10 seconds
        timeoutFactor: 2,
        retryAfter: true,
      }),
    ],
  },
});

export default getHttpAgentOptions;
