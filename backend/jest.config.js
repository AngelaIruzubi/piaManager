module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'src/index.ts',
    'src/config/',
    'src/entities/'
  ]
};