import type { IValidateAuthTokensDto } from 'src/application/dtos/auth';
import type { IAuthMapper } from 'src/application/mappers/auth.mapper';
import compileJsonStringify from 'compile-json-stringify';

export default class AuthMapper implements IAuthMapper {
  private static readonly serializeTokenValidityParams =
    compileJsonStringify<IValidateAuthTokensDto>({
      additionalProperties: false,
      type: 'object',
      strict: true,
      properties: {
        refreshToken: { type: 'string' },
        accessToken: { type: 'string' },
      },
    });

  public serializeAuthTokenValidityDto =
    AuthMapper.serializeTokenValidityParams;
}
