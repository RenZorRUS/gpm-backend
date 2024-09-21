import type { FastifyPluginAsync } from 'fastify';
import type { IAuthDto, ILoginDto } from 'src/application/dtos/auth';
import { S as Schema, type ObjectSchema } from 'fluent-json-schema';
import { fastifyPlugin } from 'fastify-plugin';
import {
  AUTH_DTO_ID,
  AUTH_TOKEN_VALIDITY_RESULT,
  AUTH_TOKENS_VALIDITY_DTO,
  AUTH_TOKENS_VALIDITY_RESPONSE,
  LOGIN_DTO_ID,
  USER_DTO_ID,
} from 'src/domain/constants/schemas';

const authSchemaPluginAsync: FastifyPluginAsync = async (
  server,
): Promise<void> => {
  /**
   * Minimum 8 characters, at least 1 uppercase letter,
   * 1 lowercase letter, 1 number and 1 special character
   */
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const PHONE_REGEX = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const MAX_EMAIL_LENGTH = 255;
  const MAX_PHONE_LENGTH = 30;
  const PHONE_EXAMPLES = [
    '(123) 456-7890',
    '(123)456-7890',
    '123-456-7890',
    '1234567890',
  ];

  const loginDto: ObjectSchema<ILoginDto> = Schema.object()
    .id(LOGIN_DTO_ID)
    .required(['password'])
    .prop('password', Schema.string().pattern(PASSWORD_REGEX))
    .prop('email', Schema.string().maxLength(MAX_EMAIL_LENGTH).format('email'))
    .prop(
      'phone',
      Schema.string()
        .maxLength(MAX_PHONE_LENGTH)
        .pattern(PHONE_REGEX)
        .examples(PHONE_EXAMPLES),
    );

  const authDto: ObjectSchema<IAuthDto> = Schema.object()
    .id(AUTH_DTO_ID)
    .required(['refreshToken', 'accessToken', 'user'])
    .prop('refreshToken', Schema.string())
    .prop('accessToken', Schema.string())
    .prop('user', Schema.ref(USER_DTO_ID));

  const authTokensValidityDto = Schema.object()
    .id(AUTH_TOKENS_VALIDITY_DTO)
    .prop('refreshToken', Schema.string())
    .prop('accessToken', Schema.string());

  const authTokenValidityResult = Schema.object()
    .id(AUTH_TOKEN_VALIDITY_RESULT)
    .prop('isValid', Schema.boolean())
    .prop('isExpired', Schema.boolean());

  const authTokensValidityResponse = Schema.object()
    .id(AUTH_TOKENS_VALIDITY_RESPONSE)
    .prop('refreshToken', Schema.ref(AUTH_TOKEN_VALIDITY_RESULT))
    .prop('accessToken', Schema.ref(AUTH_TOKEN_VALIDITY_RESULT));

  server.addSchema(authTokenValidityResult);
  server.addSchema(authTokensValidityResponse);
  server.addSchema(authTokensValidityDto);
  server.addSchema(loginDto);
  server.addSchema(authDto);
};

export default fastifyPlugin(authSchemaPluginAsync);
