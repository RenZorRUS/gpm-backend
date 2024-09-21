import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import { describe, test, expect } from '@jest/globals';
import { createEmailVerificationMessage } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';
import EmailMapper from 'src/infrastructure/mappers/email.mapper';
import { buildUserEntity } from 'src/infrastructure/services/__tests__/services.test.utils';

describe('Class: EmailMapper', (): void => {
  describe('Method: serializeEmailVerificationMessage()', (): void => {
    test.concurrent.each([
      {
        message: createEmailVerificationMessage(),
        get expectedOutput(): string {
          return (
            `{"activationTokenExpiration":"${this.message.activationTokenExpiration.toISOString()}",` +
            `"activationToken":"${this.message.activationToken}",` +
            `"firstName":"${this.message.firstName}",` +
            `"lastName":"${this.message.lastName}",` +
            `"userId":${this.message.userId},` +
            `"email":"${this.message.email}"}`
          );
        },
      },
      {
        message: {} as IEmailVerificationMessage,
        get expectedOutput(): string {
          return '{}';
        },
      },
    ])(
      'For message: `$message` should return: `$expectedOutput`',
      async ({ message, expectedOutput }): Promise<void> => {
        // Prepare
        const emailMapper = new EmailMapper();

        // Perform
        const result = emailMapper.serializeEmailVerificationMessage(message);

        // Validate
        expect(result).toEqual(expectedOutput);
      },
    );
  });

  describe('Method: mapUserToEmailVerificationMessage()', (): void => {
    test.concurrent(
      'Should map User entity to email verification message',
      async (): Promise<void> => {
        // Prepare
        const user = buildUserEntity();
        const emailMapper = new EmailMapper();

        // Perform
        const result = emailMapper.mapUserToEmailVerificationMessage(user);

        // Validate
        expect(result).toEqual({
          activationTokenExpiration: user.emailActivationTokenExpiration!,
          activationToken: user.emailActivationToken!,
          firstName: user.firstName,
          lastName: user.lastName,
          userId: Number(user.id),
          email: user.email,
        });
      },
    );
  });
});
