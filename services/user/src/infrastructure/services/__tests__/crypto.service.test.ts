import { describe, expect, test } from '@jest/globals';
import { fakerEN_US } from '@faker-js/faker';
import CryptoService from 'src/infrastructure/services/crypto.service';

describe('Class: CryptoService', (): void => {
  describe('Method: generateVerificationToken()', (): void => {
    test.concurrent.each([16, 32, 64])(
      'Should create random string for random byte size of %i',
      async (input): Promise<void> => {
        // Prepare
        const cryptoService = new CryptoService();
        const randomStrings: string[] = [];
        const randomStringSetLength = 1000;

        // Perform
        for (let index = 0; index < randomStringSetLength; index++) {
          randomStrings.push(cryptoService.generateVerificationToken(input));
        }

        // Validate
        expect(new Set(randomStrings).size).toEqual(randomStringSetLength);
      },
    );
  });

  describe('Method: hashPassword()', (): void => {
    test.concurrent.each([
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
    ])(
      'Should return many different hashes for the single password: `%s`',
      async (input): Promise<void> => {
        // Prepare
        const passwordHashTasks: Promise<string>[] = [];
        const cryptoService = new CryptoService();
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          passwordHashTasks.push(cryptoService.hashPassword(input));
        }

        const results = await Promise.all(passwordHashTasks);

        // Validate
        expect(new Set(results).size).toEqual(results.length);
      },
    );

    test.concurrent.each([
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
    ])(
      'Password hash should be verifiable for the password: `%s`',
      async (input): Promise<void> => {
        // Prepare
        const passwordHashTasks: Promise<string>[] = [];
        const cryptoService = new CryptoService();
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          passwordHashTasks.push(cryptoService.hashPassword(input));
        }

        const results = await Promise.all(passwordHashTasks);

        // Validate
        const verifyPasswordTasks = results.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(input, passwordHash),
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
    test.concurrent.each([
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
      fakerEN_US.internet.password(),
    ])(
      'Should return `true` for the valid password: `%s`',
      async (input): Promise<void> => {
        // Prepare
        const validPasswordHashTasks: Promise<string>[] = [];
        const invalidPasswordHashTasks: Promise<string>[] = [];
        const cryptoService = new CryptoService();
        const hashRetries = 5;

        // Perform
        for (let index = 0; index < hashRetries; index++) {
          validPasswordHashTasks.push(cryptoService.hashPassword(input));
          invalidPasswordHashTasks.push(
            cryptoService.hashPassword(`${input} invalid password!`),
          );
        }

        const validResults = await Promise.all(validPasswordHashTasks);
        const invalidResults = await Promise.all(invalidPasswordHashTasks);

        // Validate
        const verifyValidPasswordTasks = validResults.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(input, passwordHash),
        );
        const verifyInvalidPasswordTasks = invalidResults.map(
          (passwordHash): Promise<boolean> =>
            cryptoService.verifyPassword(input, passwordHash),
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
