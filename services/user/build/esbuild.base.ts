import type { BuildOptions } from 'esbuild';

const baseSettings: BuildOptions = {
  platform: 'node', // Bundle will be created for the Node environment
  entryPoints: ['src/index.ts'], // Files that each serve as an input to the bundling algorithm
  format: 'esm', // Converts other import systems in ECMAScript module syntax
  legalComments: 'none', // Do not preserve any legal comments
  resolveExtensions: ['.ts', '.js'], // Full order of implicit file extensions
  logLevel: 'info', // Show warnings, errors, and an output file summary
  write: true, // Build API call writes to the file system directly
  packages: 'external', // All package imports considered external to the bundle
};

export default baseSettings;
