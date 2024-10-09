/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    testMatch: ['**/src/**/*.test.ts'],
    transformIgnorePatterns: ['/node_modules/'],
  };
  