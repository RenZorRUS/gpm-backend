// ESBuild configuration: https://esbuild.github.io/api
import { build as buildBundleAsync } from 'esbuild';
import baseSettings from 'build/esbuild.base.js';

buildBundleAsync({
  bundle: true, // Inline any imported dependencies into the file itself
  outfile: 'dist/bundle.dev.mjs', // Sets the output file name for the build operation
  sourcemap: 'inline', // Encodes the information to translate from a line/column offset in output file back to a line/column offset in original input file
  tsconfig: 'tsconfig.dev.json', // Configures tsconfig.json file to use
  ...baseSettings,
});
