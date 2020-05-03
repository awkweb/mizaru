module.exports = {
    collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
    setupFiles: ['./test/setupTests'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}
