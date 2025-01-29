module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/'],
    setupFilesAfterEnv: ['./src/test/setup.ts']
};