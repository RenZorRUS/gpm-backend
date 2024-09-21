import { fileURLToPath } from 'url';

/**
 * Checks if file is being run directly or
 * if it was required as part of an es6 module import
 */
const isMainModule = (processArgs: NodeJS.Process['argv']): boolean => {
  let isMainModule = false;

  try {
    isMainModule = require.main === module;
  } catch {
    console.log(
      'Current script is not CommonJS module, ' +
        'checking if script is being run directly as ESM',
    );
  }

  if (isMainModule) {
    return isMainModule;
  }

  try {
    const modulePath = fileURLToPath(import.meta.url);
    isMainModule = processArgs[1] === modulePath;
  } catch {
    console.log('Current script is not ESM module');
  }

  return isMainModule;
};

export default isMainModule;
