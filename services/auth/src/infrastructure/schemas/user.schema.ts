import type { IUserDto } from 'src/application/dtos/users';
import type { FastifyPluginAsync } from 'fastify';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import { fastifyPlugin } from 'fastify-plugin';
import { USER_DTO_ID } from 'src/domain/constants/schemas';

const userSchemaPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  const userDto: ObjectSchema<IUserDto> = Schema.object()
    .id(USER_DTO_ID)
    .prop('id', Schema.integer().minimum(1))
    .prop('firstName', Schema.string())
    .prop('lastName', Schema.string())
    .prop('middleName', Schema.string())
    .prop('email', Schema.string().format('email'))
    .prop('phone', Schema.string())
    .prop('gender', Schema.string().enum(['MALE', 'FEMALE']))
    .prop('dateOfBirth', Schema.string().format('date'))
    .prop('isActive', Schema.boolean())
    .prop('createdAt', Schema.string().format('date-time'))
    .prop('updatedAt', Schema.string().format('date-time'));

  server.addSchema(userDto);
};

export default fastifyPlugin(userSchemaPluginAsync);
