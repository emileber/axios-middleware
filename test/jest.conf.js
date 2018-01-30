const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '../'),
    moduleFileExtensions: [
        'js',
        'json',
    ],
    // moduleNameMapper: {
    //     '^@/(.*)$': '<rootDir>/src/$1', // 'src' directory alias
    //     '^~/(.*)$': '<rootDir>/test/$1', // 'test' directory alias
    // },
    // transform: {
    //     '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    // },
    // setupFiles: ['<rootDir>/test/setup'],
    mapCoverage: true,
    coverageDirectory: '<rootDir>/test/coverage',
    collectCoverageFrom: [
        'src/**/*.js',
        '!**/node_modules/**',
    ],
};
