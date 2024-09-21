import { createTempEdDsaKeyPairAsync } from 'src/infrastructure/services/__tests__/services.test.utils';
import { checkIsFileReadableAsync } from 'src/infrastructure/utilities/file.utils';
import { describe, test, expect } from '@jest/globals';
import InternalServerError from 'src/application/errors/internal.server.error';

describe('Function: checkIsFileReadableAsync()', (): void => {
  test.concurrent(
    'Should not throw internal server error if file is exists and readable',
    async (): Promise<void> => {
      // Prepare
      const { privateKeyPath, publicKeyPath, cleanupKeysAsync } =
        await createTempEdDsaKeyPairAsync();

      // Perform & Validate
      await Promise.all([
        expect(
          (): Promise<void> => checkIsFileReadableAsync(privateKeyPath),
        ).not.toThrow(),
        expect(
          (): Promise<void> => checkIsFileReadableAsync(publicKeyPath),
        ).not.toThrow(),
      ]);

      // Finalize
      await cleanupKeysAsync();
    },
  );

  test.concurrent(
    'Should throw internal server error if file is not exists or readable',
    async (): Promise<void> => {
      // Prepare
      const filePath = 'not-exists-path';
      const expectedError = new InternalServerError(
        `File: ${filePath} is not readable or exists.`,
      );

      // Perform & Validate
      await expect(
        (): Promise<void> => checkIsFileReadableAsync(filePath),
      ).rejects.toThrowError(expectedError);
    },
  );
});
