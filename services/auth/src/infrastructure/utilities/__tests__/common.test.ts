import { describe, test, expect } from '@jest/globals';
import { resolve as resolvePaths } from 'path';
import isMainModule from 'src/infrastructure/utilities/common.utils';
import { fileURLToPath } from 'url';

describe('Function: isMainModule()', (): void => {
  test.concurrent.each([
    [
      [
        '',
        resolvePaths(fileURLToPath(import.meta.url), '../../common.utils.ts'),
      ],
      true,
    ],
    [['', 'some-script.js'], false],
  ])(
    'For: `%o`, result should be `%s`',
    async (input, expectedOutput): Promise<void> => {
      const result = isMainModule(input);
      expect(result).toEqual(expectedOutput);
    },
  );
});
