import globals from 'globals';

import typescriptConfig from '@ssh/eslint-config/typescript';
import reactConfig from '@ssh/eslint-config/react';
import baseConfig from '@ssh/eslint-config/base';
import storybookPlugin from 'eslint-plugin-storybook';

export default [
    {
        name: 'paris_overrides',
        ignores: ['dist/', 'node_modules/', '.next/', '!.storybook'],
    },

    ...storybookPlugin.configs['flat/recommended'],
    ...reactConfig,
    ...baseConfig,
    ...typescriptConfig,
    {
        name: 'paris_unused',
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    {
        name: 'paris_typescript',
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: true,
            },
        },
        rules: {
            'no-undef': 'off',
            'import/named': 'off',
            'import/no-unresolved': 'off',
        },
    },
    {
        name: 'paris_react',
        files: ['src/**/*.{jsx,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/button-has-type': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/jsx-no-bind': 'off',
        },
    },
    {
        name: 'paris_node',
        files: ['**/*.js'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        name: 'paris_imports',
        files: ['!src/'],
        rules: {
            'import/no-extraneous-dependencies': 'off',
            'no-console': 'off',
            'global-require': 'off',
        },
    },
];
