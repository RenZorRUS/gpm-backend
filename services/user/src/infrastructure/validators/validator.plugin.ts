import type { FastifyPluginAsync } from 'fastify';
import type { IUserRepository } from 'src/application/repositories/user.repository';
import { fastifyPlugin } from 'fastify-plugin';
import UserValidator from 'src/infrastructure/validators/user.validator';
import AuthValidator from 'src/infrastructure/validators/auth.validator';

export interface IValidatorPluginOptions {
  userRepository: IUserRepository;
}

const validatorPluginAsync: FastifyPluginAsync<
  IValidatorPluginOptions
> = async (server, { userRepository }): Promise<void> => {
  server.decorate('userValidator', new UserValidator(userRepository));
  server.decorate('authValidator', new AuthValidator());
};

export default fastifyPlugin(validatorPluginAsync);
