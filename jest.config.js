module.exports = {
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    setupFiles: ['./test/setupTests'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}
