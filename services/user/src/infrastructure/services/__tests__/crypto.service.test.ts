import { describe, expect, test } from '@jest/globals';
import { fakerEN_US } from '@faker-js/faker';
import CryptoService from 'src/infrastructure/services/crypto.service';

describe('Class: CryptoService', (): void => {
  const password = fakerEN_US.internet.password();

  const cryptoService = new CryptoService();

  describe('Method: generateVerificationToken()', (): void => {
    test.concurrent.each([16, 32, 64])(
      'Should create random string for random byte size of %i',
      async (input): Promise<void> => {
        // Prepare
        const randomStringSetLength = 1000;
        const randomStrings: string[] = [];

        // Perform
        for (let index = 0; index < randomStringSetLength; index++) {
          const token = cryptoService.generateVerificationToken(input);
          randomStrings.push(token);
        }

        // Validate
        const uniqueCount = new Set(randomStrings).size;
        expect(uniqueCount).toEqual(randomStringSetLength);
      },
    );
  });

  describe('Method: hashPassword()', (): void => {
    test.concurrent(
      'Should return many different hashes for the single password',
      async (): Promise<void> => {
        // Prepare
        const passwordHashTasks: Promise<string>[] = [];
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          const passwordHashTask = cryptoService.hashPassword(password);
          passwordHashTasks.push(passwordHashTask);
        }

        const results = await Promise.all(passwordHashTasks);

        // Validate
        const uniqueCount = new Set(results).size;
        expect(uniqueCount).toEqual(results.length);
      },
    );

    test.concurrent(
      'Password hash should be verifiable',
      async (): Promise<void> => {
        // Prepare
        const passwordHashTasks: Promise<string>[] = [];
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          const passwordHashTask = cryptoService.hashPassword(password);
          passwordHashTasks.push(passwordHashTask);
        }

        const results = await Promise.all(passwordHashTasks);

        // Validate
        const verifyPasswordTasks = results.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(password, passwordHash),
        );

        const passwordVerificationResults =
          await Promise.all(verifyPasswordTasks);

        passwordVerificationResults.forEach((result): void =>
          expect(result).toBeTruthy(),
        );
      },
    );
  });

  describe('Method: verifyPassword()', (): void => {
    test.concurrent(
      'Should return `true` for the valid password',
      async (): Promise<void> => {
        // Prepare
        const invalidPasswordHashTasks: Promise<string>[] = [];
        const validPasswordHashTasks: Promise<string>[] = [];
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          const passwordHashTask = cryptoService.hashPassword(password);
          const invalidPasswordHashTask = cryptoService.hashPassword(
            `${password}!`,
          );

          validPasswordHashTasks.push(passwordHashTask);
          invalidPasswordHashTasks.push(invalidPasswordHashTask);
        }

        const validResults = await Promise.all(validPasswordHashTasks);
        const invalidResults = await Promise.all(invalidPasswordHashTasks);

        // Validate
        const verifyValidPasswordTasks = validResults.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(password, passwordHash),
        );
        const verifyInvalidPasswordTasks = invalidResults.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(password, passwordHash),
        );

        const validVerificationResults = await Promise.all(
          verifyValidPasswordTasks,
        );
        const invalidVerificationResults = await Promise.all(
          verifyInvalidPasswordTasks,
        );

        validVerificationResults.forEach((result): void =>
          expect(result).toBeTruthy(),
        );
        invalidVerificationResults.forEach((result): void =>
          expect(result).toBeFalsy(),
        );
      },
    );
  });
});
