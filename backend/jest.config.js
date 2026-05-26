/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: './src',
    testMatch: ['**/__tests__/**/*.test.ts'],
    clearMocks: true,
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.test.json'
        }
    },
    collectCoverage: true,
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/generated/'
    ]
};