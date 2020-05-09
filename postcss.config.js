const purgecss = [
    '@fullhuman/postcss-purgecss',
    {
        content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    },
]

module.exports = {
    plugins: [
        'postcss-import',
        'tailwindcss',
        ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
        'postcss-preset-env',
    ],
}
