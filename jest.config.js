module.exports = {
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
    moduleNameMapper: {
        '@/(.*)': '<rootDir>/$1',
    },
    setupFiles: ['<rootDir>/test/setupTests'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}
