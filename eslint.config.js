import sshConfig from '@ssh/eslint-config';
import storybookPlugin from 'eslint-plugin-storybook';
import * as cssPlugin from 'eslint-plugin-css';
import typescriptParser from '@typescript-eslint/parser';
import { fixupConfigRules } from '@eslint/compat';

export default [
    // Global ignores
    {
        ignores: ['dist/', 'node_modules/', 'storybook-static/', '.next/'],
    },

    // SSH base configuration
    ...(Array.isArray(sshConfig) ? sshConfig : [sshConfig]),

    // CSS plugin configuration - try a different approach
    {
        plugins: {
            css: cssPlugin,
        },
        rules: {
            // We'll use the plugin without extends for now
        },
    },

    // Storybook configuration with compatibility wrapper
    ...fixupConfigRules([
        {
            files: ['**/*.stories.@(js|jsx|ts|tsx|mjs|cjs)'],
            plugins: {
                storybook: storybookPlugin,
            },
            rules: {
                ...storybookPlugin.configs.recommended.rules,
            },
        },
    ]),

    // TypeScript files configuration
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },

    // Custom rules override
    {
        rules: {
            'react/button-has-type': 'off',
            'react/jsx-props-no-spreading': 'off',
        },
    },
];
