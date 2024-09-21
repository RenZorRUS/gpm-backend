import type { IEmailVerificationMessage } from 'src/application/dtos/emails';
import { describe, test, expect } from '@jest/globals';
import { createEmailVerificationMessage } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';
import EmailMapper from 'src/infrastructure/mappers/email.mapper';
import { buildUserEntity } from 'src/infrastructure/services/__tests__/services.test.utils';

describe('Class: EmailMapper', (): void => {
  const emailMapper = new EmailMapper();
  const user = buildUserEntity();

  describe('Method: serializeEmailVerificationMessage()', (): void => {
    test.concurrent.each([
      {
        message: createEmailVerificationMessage(),
        get expectedOutput(): string {
          return JSON.stringify(this.message);
        },
      },
      {
        message: {} as IEmailVerificationMessage,
        get expectedOutput(): string {
          return JSON.stringify(this.message);
        },
      },
    ])(
      'For message: `$message` should return: `$expectedOutput`',
      async ({ message, expectedOutput }): Promise<void> => {
        // Perform
        const result = emailMapper.serializeEmailVerificationMessage(message);

        // Validate
        expect(result).toEqual(expectedOutput);
      },
    );
  });

  describe('Method: mapUserToEmailVerificationMessage()', (): void => {
    test.concurrent(
      'Should map user entity to email verification message',
      async (): Promise<void> => {
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
