import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import type { IEmailMapper } from 'src/application/mappers/email.mapper';
import compileJSONStringify, {
  type CompiledStringify,
} from 'compile-json-stringify';
import type { User } from '@prisma/client';

export default class EmailMapper implements IEmailMapper {
  private static serializeEmailVerificationDto: CompiledStringify<IEmailVerificationMessage> =
    compileJSONStringify({
      additionalProperties: false,
      type: 'object',
      strict: true,
      properties: {
        activationTokenExpiration: { type: 'date' },
        activationToken: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        userId: { type: 'number' },
        email: { type: 'string' },
      },
    });

  public serializeEmailVerificationMessage(
    message: IEmailVerificationMessage,
  ): string {
    return EmailMapper.serializeEmailVerificationDto(message);
  }

  public mapUserToEmailVerificationMessage(
    user: User,
  ): IEmailVerificationMessage {
    return {
      activationTokenExpiration: user.emailActivationTokenExpiration!,
      activationToken: user.emailActivationToken!,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: Number(user.id),
      email: user.email,
    };
  }
}
