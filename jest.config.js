module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: [
        'lib/**/*.js',
        '!lib/**/*.test.js'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json'],
    testMatch: [
        '**/test/**/*.test.js',
        '**/__tests__/**/*.js'
    ],
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};