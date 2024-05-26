import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            'no-console': 'off',
            indent: ['warn', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            semi: ['error', 'always'],
            'no-unused-vars': ['warn', { args: 'none' }],
        },
        ignores: ['docs', 'dist', 'test', 'scripts', 'node_modules', 'packages/**/node_modules', 'packages/**/dist'],
    },
];
