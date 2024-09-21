import type { FastifyPluginAsync } from 'fastify';
import type { IAuthHandler } from 'src/application/handlers/auth.handler';
import type UserController from 'src/presentation/controllers/user.controller';
import { USER_TAG } from 'src/domain/constants/tags';
import { HTTP_CODE } from 'src/domain/constants/http';
import {
  CHANGE_USER_DTO_ID,
  CREATE_USER_DTO_ID,
  ERROR_DTO_ID,
  PAGINATION_QUERY_ID,
  USER_DTO_ID,
  USER_PAGINATION_DTO_ID,
} from 'src/domain/constants/schemas';

export interface IUserRoutesPluginOptions {
  userController: UserController;
  authHandler: IAuthHandler;
}

const userRoutesPluginAsync: FastifyPluginAsync<
  IUserRoutesPluginOptions
> = async (server, { userController, authHandler }): Promise<void> => {
  const errorSchema = server.getSchema(ERROR_DTO_ID);
  const userSchema = server.getSchema(USER_DTO_ID);

  server.addHook('onRequest', authHandler.checkBearerTokenAsync);

  server.get(
    '/',
    {
      schema: {
        description: 'Finds many users according to the pagination query.',
        summary: 'Finds many users according to the pagination query.',
        tags: [USER_TAG],
        querystring: server.getSchema(PAGINATION_QUERY_ID),
        response: {
          [HTTP_CODE.OK]: server.getSchema(USER_PAGINATION_DTO_ID),
          [HTTP_CODE.UNAUTHORIZED]: errorSchema,
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
        },
      },
    },
    userController.findManyAsync,
  );

  server.post(
    '/',
    {
      schema: {
        description: 'Creates a new user.',
        summary: 'Creates a new user.',
        tags: [USER_TAG],
        body: server.getSchema(CREATE_USER_DTO_ID),
        response: {
          [HTTP_CODE.CREATED]: userSchema,
          [HTTP_CODE.BAD_REQUEST]: errorSchema,
          [HTTP_CODE.UNAUTHORIZED]: errorSchema,
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
        },
      },
    },
    userController.createAsync,
  );

  server.get(
    '/:userId(^\\d+$)',
    {
      schema: {
        description: 'Finds a user by ID.',
        summary: 'Finds a user by ID.',
        tags: [USER_TAG],
        response: {
          [HTTP_CODE.OK]: userSchema,
          [HTTP_CODE.NOT_FOUND]: errorSchema,
          [HTTP_CODE.UNAUTHORIZED]: errorSchema,
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
        },
      },
    },
    userController.findByIdAsync,
  );

  server.put(
    '/:userId(^\\d+$)',
    {
      schema: {
        description: 'Updates a user by ID.',
        summary: 'Updates a user by ID.',
        tags: [USER_TAG],
        body: server.getSchema(CHANGE_USER_DTO_ID),
        response: {
          [HTTP_CODE.OK]: userSchema,
          [HTTP_CODE.BAD_REQUEST]: errorSchema,
          [HTTP_CODE.NOT_FOUND]: errorSchema,
          [HTTP_CODE.UNAUTHORIZED]: errorSchema,
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
        },
      },
    },
    userController.updateByIdAsync,
  );

  server.delete(
    '/:userId(^\\d+$)',
    {
      schema: {
        description: 'Deletes a user by ID.',
        summary: 'Deletes a user by ID.',
        tags: [USER_TAG],
        response: {
          [HTTP_CODE.NO_CONTENT]: {},
          [HTTP_CODE.NOT_FOUND]: errorSchema,
          [HTTP_CODE.UNAUTHORIZED]: errorSchema,
          [HTTP_CODE.INTERNAL_SERVER_ERROR]: errorSchema,
        },
      },
    },
    userController.deleteByIdAsync,
  );
};

export default userRoutesPluginAsync;
