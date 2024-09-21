import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import type { User } from '@prisma/client';

export interface IEmailMapper {
  serializeEmailVerificationMessage(message: IEmailVerificationMessage): string;
  mapUserToEmailVerificationMessage(user: User): IEmailVerificationMessage;
}
