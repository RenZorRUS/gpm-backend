import type { FastifyPluginAsync } from 'fastify';
import type AuthController from 'src/presentation/controllers/auth.controller';
import { HTTP_CODE } from 'src/domain/constants/http';
import { AUTH_TAG } from 'src/domain/constants/tags';
import {
  AUTH_DTO_ID,
  AUTH_TOKENS_VALIDITY_DTO,
  AUTH_TOKENS_VALIDITY_RESPONSE,
  ERROR_DTO_ID,
  LOGIN_DTO_ID,
} from 'src/domain/constants/schemas';

export interface IAuthRoutesPluginOptions {
  authController: AuthController;
}

const authRoutesPluginAsync: FastifyPluginAsync<
  IAuthRoutesPluginOptions
> = async (server, { authController }): Promise<void> => {
  const errorSchema = server.getSchema(ERROR_DTO_ID);

  server.post(
    '/login',
    {
      schema: {
        description:
          'Authorizes user and returns access and refresh JWT tokens',
        summary: 'Authorizes user and returns JWT token',
        tags: [AUTH_TAG],
        body: server.getSchema(LOGIN_DTO_ID),
        response: {
          [HTTP_CODE.OK]: server.getSchema(AUTH_DTO_ID),
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
          [HTTP_CODE.BAD_REQUEST]: errorSchema,
        },
      },
    },
    authController.loginAsync,
  );

  server.post(
    '/validate/tokens',
    {
      schema: {
        description: 'Verifies access and refresh JWT tokens',
        summary: 'Verifies access and refresh JWT tokens',
        body: server.getSchema(AUTH_TOKENS_VALIDITY_DTO),
        tags: [AUTH_TAG],
        response: {
          [HTTP_CODE.OK]: server.getSchema(AUTH_TOKENS_VALIDITY_RESPONSE),
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
          [HTTP_CODE.BAD_REQUEST]: errorSchema,
        },
      },
    },
    authController.verifyTokensAsync,
  );
};

export default authRoutesPluginAsync;
