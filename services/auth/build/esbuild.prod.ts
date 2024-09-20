// ESBuild configuration: https://esbuild.github.io/api
import { build as buildBundleAsync } from 'esbuild';
import baseSettings from 'build/esbuild.base.js';

buildBundleAsync({
  bundle: true, // Inline any imported dependencies into the file itself
  outfile: 'dist/bundle.prod.mjs', // Sets the output file name for the build operation
  drop: ['console', 'console'], // Edit source code before building to drop certain constructs
  minify: true, // Generated code will be minified instead of pretty-printed
  treeShaking: true, // Uses for dead code elimination
  sourcemap: false, // Do not generate source maps
  tsconfig: 'tsconfig.json', // Configures tsconfig.json file to use
  ...baseSettings,
});
