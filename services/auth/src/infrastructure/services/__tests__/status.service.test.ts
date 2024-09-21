import { buildEnvConfig } from 'src/infrastructure/services/__tests__/services.test.utils';
import StatusService from 'src/infrastructure/services/status.service';
import { describe, expect, test } from '@jest/globals';

describe('Class: StatusService', (): void => {
  const envConfig = buildEnvConfig();
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
