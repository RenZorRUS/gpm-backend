import { describe, expect, test } from '@jest/globals';
import { addMinutesToDate } from 'src/infrastructure/utilities/date';

describe('Function: addMinutesToDate()', (): void => {
  test.concurrent.each([
    {
      currentDate: '2024-01-01T01:00:00',
      expectedDate: '2024-01-01T01:30:00',
    },
    {
      currentDate: '2024-01-01T01:25:00',
      expectedDate: '2024-01-01T01:55:00',
    },
    {
      currentDate: '2024-01-01T01:50:00',
      expectedDate: '2024-01-01T02:20:00',
    },
  ])(
    'Should add 30 minutes to `$currentDate` and return `$expectedDate`',
    async ({ currentDate, expectedDate }): Promise<void> => {
      // Prepare
      const oldDate = new Date(currentDate);
      const newDate = new Date(expectedDate);

      // Perform
      const result = addMinutesToDate(oldDate, 30);

      // Prepare
      expect(result).toEqual(newDate);
    },
  );
});
