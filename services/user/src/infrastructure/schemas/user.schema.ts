import type { IChangeUserDto, IUserDto } from 'src/application/dtos/users';
import type { IPaginationResponse } from 'src/application/dtos/common';
import type { FastifyPluginAsync } from 'fastify';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import { fastifyPlugin } from 'fastify-plugin';
import {
  BASE_PAGINATION_DTO_ID,
  CHANGE_USER_DTO_ID,
  CREATE_USER_DTO_ID,
  USER_DTO_ID,
  USER_PAGINATION_DTO_ID,
} from 'src/domain/constants/schemas';

const userSchemaPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  /**
   * Minimum eight characters, at least one uppercase letter,
   * one lowercase letter, one number and one special character
   */
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const PHONE_REGEX = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  const MAX_EMAIL_LENGTH = 255;
  const MAX_PHONE_LENGTH = 30;
  const MAX_NAME_LENGTH = 50;
  const PHONE_EXAMPLES = [
    '(123) 456-7890',
    '(123)456-7890',
    '123-456-7890',
    '1234567890',
  ];

  const userDto: ObjectSchema<IUserDto> = Schema.object()
    .id(USER_DTO_ID)
    .prop('id', Schema.integer().minimum(1))
    .prop('firstName', Schema.string().maxLength(MAX_NAME_LENGTH))
    .prop('lastName', Schema.string().maxLength(MAX_NAME_LENGTH))
    .prop('middleName', Schema.string().maxLength(MAX_NAME_LENGTH))
    .prop('email', Schema.string().maxLength(MAX_EMAIL_LENGTH).format('email'))
    .prop(
      'phone',
      Schema.string()
        .maxLength(MAX_PHONE_LENGTH)
        .pattern(PHONE_REGEX)
        .examples(PHONE_EXAMPLES),
    )
    .prop('gender', Schema.string().enum(['MALE', 'FEMALE']))
    .prop('dateOfBirth', Schema.string().format('date'))
    .prop('isActive', Schema.boolean())
    .prop('createdAt', Schema.string().format('date-time'))
    .prop('updatedAt', Schema.string().format('date-time'));

  const changeUserDto: ObjectSchema<IChangeUserDto> = userDto
    .only([
      'firstName',
      'lastName',
      'middleName',
      'email',
      'gender',
      'dateOfBirth',
      'phone',
    ])
    .id(CHANGE_USER_DTO_ID)
    .required(['firstName', 'lastName', 'email'])
    .prop('password', Schema.string().pattern(PASSWORD_REGEX));

  /** @typedef {import('src/application/dtos/users').ICreateUserDto} */
  const createUserDto = Schema.object()
    .id(CREATE_USER_DTO_ID)
    .required(['firstName', 'lastName', 'email', 'password'])
    .prop('password', Schema.string().pattern(PASSWORD_REGEX))
    .extend(changeUserDto);

  const rawPaginationDto = server.getSchema(BASE_PAGINATION_DTO_ID);
  const paginationDto = Schema.raw(rawPaginationDto) as unknown as ObjectSchema<
    IPaginationResponse<unknown>
  >;

  const userPaginationDto = Schema.object()
    .id(USER_PAGINATION_DTO_ID)
    .required(['limit', 'offset', 'total', 'data'])
    .prop('data', Schema.array().items(Schema.ref(USER_DTO_ID)))
    .extend(paginationDto);

  server.addSchema(userDto);
  server.addSchema(changeUserDto);
  server.addSchema(createUserDto);
  server.addSchema(userPaginationDto);
};

export default fastifyPlugin(userSchemaPluginAsync);
