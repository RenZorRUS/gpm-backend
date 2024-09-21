import { fileURLToPath } from 'url';

/**
 * Checks if file is being run directly or
 * if it was required as part of an es6 module import
 */
const isMainModule = (): boolean =>
  (import.meta.url && process.argv[1] === fileURLToPath(import.meta.url)) ||
  require.main === module;

export default isMainModule;
