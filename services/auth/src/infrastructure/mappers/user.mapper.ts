import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IUserDto } from 'src/application/dtos/users';
import type { CompiledStringify } from 'compile-json-stringify';
import compileJsonStringify from 'compile-json-stringify';

export default class UserMapper implements IUserMapper {
  private static readonly serializeUserDto: CompiledStringify<
    Partial<IUserDto>
  > = compileJsonStringify({
    additionalProperties: false,
    type: 'object',
    strict: true,
    properties: {
      id: { type: 'number' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      middleName: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      gender: { type: 'string' },
      dateOfBirth: { type: 'date' },
      isActive: { type: 'boolean' },
      createAt: { type: 'date' },
      updateAt: { type: 'date' },
    },
  });

  public serializeUserDto(dto: Partial<IUserDto>): string {
    return UserMapper.serializeUserDto(dto);
  }
}
