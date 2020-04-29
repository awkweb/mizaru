module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/errors',
        'prettier/@typescript-eslint',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'import', 'react'],
    rules: {
        'import/no-unresolved': 'error',
        'import/order': [
            'error',
            {
                groups: ['external', 'internal'],
                'newlines-between': 'always-and-inside-groups',
            },
        ],
        'import/no-unresolved': ['error', { ignore: ['^~/', '^next/'] }],
        'jsx-a11y/anchor-is-valid': 'off',
        'react/jsx-boolean-value': ['warn', 'never'],
        'react/no-array-index-key': 'error',
        'react/no-did-mount-set-state': 'error',
        'react/no-did-update-set-state': 'error',
        'react/no-multi-comp': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/self-closing-comp': 'warn',
        'react/jsx-sort-props': [
            'error',
            {
                callbacksLast: true,
            },
        ],
        'react/jsx-wrap-multilines': 'error',
        'sort-imports': [
            'warn',
            {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
            },
        ],
    },
    globals: {
        window: 'writable',
        document: 'writable',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.js', '.jsx', '.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
        react: {
            // Tells eslint-plugin-react to automatically detect the version of React to use
            version: 'detect',
        },
    },
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
}
