import { describe, test, expect } from '@jest/globals';
import StatusService from 'src/infrastructure/services/status.service';
import { createEnvConfig } from 'src/infrastructure/publishers/__tests__/publisher.test.utils';

describe('Class: StatusService', (): void => {
  const envConfig = createEnvConfig();

  const statusService = new StatusService(envConfig);

  describe('Method: getStatus()', (): void => {
    test.concurrent(
      'Should return user service status',
      async (): Promise<void> => {
        // Perform
        const result = statusService.getStatus();

        // Validate
        expect(result).toEqual({
          description: envConfig.APP_DESCRIPTION,
          version: envConfig.APP_VERSION,
          title: envConfig.APP_TITLE,
          status: 'ok',
        });
      },
    );
  });
});
