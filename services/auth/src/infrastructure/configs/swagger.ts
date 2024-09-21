import type { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import type { SwaggerOptions } from '@fastify/swagger';
import type { IEnvConfig } from 'src/application/types/global';

const getSwaggerOptions = (config: IEnvConfig): SwaggerOptions => ({
  mode: 'dynamic', // API schemas will be auto-generated from route schemas
  stripBasePath: true,
  hideUntagged: false,
  openapi: {
    openapi: '3.0.0',
    info: {
      title: config.APP_TITLE,
      description: config.APP_DESCRIPTION,
      contact: {
        name: config.APP_CONTACT_NAME,
        url: config.APP_CONTACT_URL,
        email: config.APP_CONTACT_EMAIL,
      },
      version: config.APP_VERSION,
    },
    servers: [
      {
        url: `http://${config.HOST}:${config.PORT}`,
        description: config.APP_DESCRIPTION,
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    tags: [
      { name: 'Status', description: 'Service status related endpoints' },
      { name: 'Auth', description: 'Authentication related endpoints' },
    ],
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
  },
});

const getSwaggerUiOptions = (config: IEnvConfig): FastifySwaggerUiOptions => ({
  routePrefix: config.SWAGGER_PATH,
  staticCSP: true,
  transformStaticCSP: (header): string => header,
  transformSpecification: (swaggerObject): Readonly<Record<string, string>> =>
    swaggerObject,
  transformSpecificationClone: true,
  uiConfig: {
    displayOperationId: false,
    deepLinking: false,
    defaultModelRendering: 'example',
    displayRequestDuration: true,
    docExpansion: 'full',
    filter: true,
    operationsSorter: 'method',
    showExtensions: true,
    showCommonExtensions: true,
    tagsSorter: 'alpha',
    syntaxHighlight: {
      activate: true,
      theme: 'monokai',
    },
    tryItOutEnabled: true,
    requestSnippets: {
      defaultExpanded: false,
      languagesMask: ['curl_bash'],
    },
    withCredentials: true,
    persistAuthorization: true,
  },
});

export { getSwaggerUiOptions };
export default getSwaggerOptions;
