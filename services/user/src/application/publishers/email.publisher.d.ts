import type { IEmailVerificationMessage } from 'src/application/dtos/emails';

export interface IEmailPublisher {
  publishVerificationEmailAsync(
    options: IEmailVerificationMessage,
  ): Promise<void>;
}
