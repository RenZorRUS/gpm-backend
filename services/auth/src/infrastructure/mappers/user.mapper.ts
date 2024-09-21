import type { IUserMapper } from 'src/application/mappers/user.mapper';
import type { IUserDto } from 'src/application/dtos/users';
import compileJsonStringify, {
  type CompiledStringify,
} from 'compile-json-stringify';

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
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  });

  public serializeUserDto = UserMapper.serializeUserDto;
}
