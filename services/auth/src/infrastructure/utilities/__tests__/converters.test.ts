import { describe, test, expect } from '@jest/globals';
import {
  mapToFullUrl,
  objectToPropsString,
} from 'src/infrastructure/utilities/converters.utils';

describe('Function: objectToPropsString()', (): void => {
  test.concurrent.each([
    [{ a: 1, b: 2, c: 3 }, 'a: 1, b: 2, c: 3'],
    [{ a: 1, b: 2, c: 3, d: 4 }, 'a: 1, b: 2, c: 3, d: 4'],
    [{}, ''],
  ])(
    'Object: `%o` should be converted into: `%s`',
    async (input, expectedOutput): Promise<void> => {
      const result = objectToPropsString(input);
      expect(result).toEqual(expectedOutput);
    },
  );
});

describe('Function: mapToFullUrl()', (): void => {
  test.concurrent.each([
    {
      options: {
        path: '/users',
        origin: 'https://example.com',
        query: { limit: 5, offset: 0 },
      },
      expectedUrl: 'https://example.com/users?limit=5&offset=0',
    },
    {
      options: {
        path: '/users',
        origin: 'https://example.com',
      },
      expectedUrl: 'https://example.com/users',
    },
    {
      options: {
        path: '/users?limit=5&offset=0',
        origin: 'https://example.com',
      },
      expectedUrl: 'https://example.com/users?limit=5&offset=0',
    },
  ])(
    'For request options: `$options` should return: `$expectedUrl`',
    async ({
      options: { path, origin, query },
      expectedUrl,
    }): Promise<void> => {
      // Perform
      const result = mapToFullUrl(path, origin, query);

      // Validate
      expect(result).toEqual(expectedUrl);
    },
  );
});
