import { cpus } from 'os';

/** @returns {Promise<import('jest').Config>} Jest configuration object */
export default async () => {
  const allowedCpuCount = Math.max(1, cpus().length - 1);

  /** @type {import('ts-jest').JsWithTsEsmTransformOptions} */
  const tsJestConfig = {
    tsconfig: 'tsconfig.test.json',
    compiler: 'typescript',
    useESM: true,
  };

  /** @type {import('jest').Config} */
  const config = {
    automock: false, // all imported modules in your tests should be mocked automatically
    bail: 0, // stop running tests after `n` failures
    cacheDirectory: '.cache/', // where Jest should store its cached dependency information
    clearMocks: false, // automatically clear mock calls, instances, contexts and results before every test
    collectCoverage: true, // the coverage information should be collected while executing the test
    collectCoverageFrom: [
      // a set of files for which coverage information should be collected
      // each glob pattern is applied in the order they are specified in the config
      'src/**/*.{js,ts}',
      '!src/**/*.test.utils.ts',
      '!src/**/*.plugin.ts',
      '!src/application/**',
      '!src/domain/**',
      '!src/infrastructure/configs/**',
      '!src/infrastructure/schemas/**',
      '!src/presentation/**',
      '!src/infrastructure/server.ts',
      '!src/index.ts',
    ],
    coverageDirectory: 'coverage/', // the directory where Jest should output its coverage files
    coverageProvider: 'v8', // instrument code for coverage
    coverageReporters: ['text', 'html'], // a list of reporter names that Jest uses when writing coverage reports
    coverageThreshold: {
      // configures minimum threshold enforcement for coverage results
      // if thresholds aren't met, jest will fail.
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: -10,
      },
    },
    displayName: 'auth-service', // a label to be printed alongside a test while it is running
    errorOnDeprecated: false, // make calling deprecated APIs throw helpful error messages
    extensionsToTreatAsEsm: ['.ts'], // enables esm support
    injectGlobals: false, // automatically inject global variables into all test files
    maxConcurrency: allowedCpuCount, // limiting the number of tests that are allowed to run at the same time
    maxWorkers: allowedCpuCount, // specifies the maximum number of workers the worker-pool will spawn for running tests
    moduleDirectories: ['node_modules'], // directory names to be searched recursively up from the requiring module's location
    moduleFileExtensions: ['ts', 'js'], // file extensions our modules use
    modulePathIgnorePatterns: ['build/'], // to be not considered 'visible' to the module loader
    openHandlesTimeout: 2000, // a warning indicating that there are probable open handles if Jest does not exit cleanly
    resetMocks: false, // automatically reset mock state before every test
    resetModules: false, // automatically reset modules before every test
    restoreMocks: false, // automatically restore mock state and implementation before every test
    slowTestThreshold: 5, // The number of seconds after which a test is considered as slow and reported as such in the results
    testEnvironment: 'node', // the test environment that will be used for testing
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'], // uses to detect test files
    testPathIgnorePatterns: ['node_modules/'], // If the test path matches any of the patterns, it will be skipped
    verbose: true, // indicates whether each individual test should be reported during the run
    workerIdleMemoryLimit: '512MB', // Specifies the memory limit for workers before they are recycled
    workerThreads: true, // use worker threads for parallelization
    transform: {
      // jest runs JavaScript, hence a transformer is needed if we use some syntax not supported by Node out of the box (such as TS)
      '^.+.ts$': ['ts-jest', tsJestConfig],
    },
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },
  };

  return config;
};
