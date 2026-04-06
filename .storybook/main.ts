import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', 'storybook-dark-mode', '@storybook/addon-docs'],

    framework: '@storybook/nextjs-vite',

    docs: {},

    staticDirs: ['../public'],

    previewHead: (head) => `${head}
<style>
    body {
        color: var(--pte-new-colors-contentPrimary);
        background-color: var(--pte-new-colors-backgroundPrimary);
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    h2#stories {
        letter-spacing: var(--pte-typography-styles-labelMedium-letterSpacing);
    }
</style>`,
};
export default config;
