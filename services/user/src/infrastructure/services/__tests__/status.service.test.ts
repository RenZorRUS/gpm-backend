import type { IEnvConfig } from 'src/application/types/global';
import { describe, test, expect } from '@jest/globals';
import StatusService from 'src/infrastructure/services/status.service';

describe('Class: StatusService', (): void => {
  describe('Method: getStatus()', (): void => {
    test.concurrent.each([
      {
        APP_TITLE: 'Auth Service',
        APP_DESCRIPTION: 'Service description...',
        APP_VERSION: '0.0.3',
      },
      {
        APP_TITLE: 'User Service',
        APP_DESCRIPTION: 'Service description...',
        APP_VERSION: '0.0.1',
      },
    ])(
      'Should return user service status: { title: $APP_TITLE, ' +
        'description: $APP_DESCRIPTION, version: $APP_VERSION }',
      async (config): Promise<void> => {
        // Prepare
        const statusService = new StatusService(config as IEnvConfig);

        // Perform
        const result = statusService.getStatus();

        // Validate
        expect(result).toEqual({
          title: config.APP_TITLE,
          description: config.APP_DESCRIPTION,
          version: config.APP_VERSION,
          status: 'ok',
        });
      },
    );
  });
});
