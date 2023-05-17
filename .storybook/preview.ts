import type { Preview } from "@storybook/react";
import { Dark, Light } from './themes';
import { DocsContainer } from '@storybook/blocks';
import { useDarkMode } from 'storybook-dark-mode';
import { createElement } from 'react';

import '../public/graphik/graphik.css';
import '../public/fira/fira_code.css';
import '../src/styles/globals.css';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        docs: {
            container: (context: any) => {
                const isDark = useDarkMode();

                const props = {
                    ...context,
                    theme: isDark ? Dark : Light,
                };

                return createElement(DocsContainer, props);
            },
        },
        darkMode: {
            stylePreview: true,
            // Override the default dark theme
            dark: Dark,
            // Override the default light theme
            light: Light
        }
    },
};

export default preview;