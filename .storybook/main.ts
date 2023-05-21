import type { StorybookConfig } from "@storybook/nextjs";
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "storybook-dark-mode",
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    staticDirs: [
        '../public'
    ],
    previewHead: (head) => (
        `${head}
<style>
    body {
        color: var(--pte-colors-contentPrimary);
        background-color: var(--pte-colors-backgroundPrimary);
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }
    
    h2#stories {
        letter-spacing: var(--pte-typography-styles-labelMedium-letterSpacing);
    }
</style>`
    ),
    webpackFinal: async (config) => {
        config.resolve.plugins = [
            new TsconfigPathsPlugin()
        ];
        return config;
    }
};
export default config;
