import type {  Preview } from '@storybook/react';
import { Dark, Light } from './themes';
import { DocsContainer } from '@storybook/blocks';
import { useDarkMode } from 'storybook-dark-mode';
import { createElement, useEffect } from 'react';
import { injectTheme, LightTheme, DarkTheme } from '../src/stories/theme';

import '../public/graphik/graphik.css';
import '../public/fira/fira_code.css';
import '../src/styles/globals.css';
import '../src/styles/tw-preflight.css';

const Wrapper = (props: any) => {
    const isDark = useDarkMode();

    useEffect(() => {
        injectTheme(!isDark ? LightTheme : DarkTheme);
    }, [isDark]);

    return props.children;
}

export const decorators = [
    (renderStory) => createElement(Wrapper, {}, renderStory()),
];

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

                useEffect(() => {
                    injectTheme(!isDark ? LightTheme : DarkTheme);
                }, [isDark]);

                return createElement(DocsContainer, props);
            },
        },
        options: {
            storySort: {
                order: ['Welcome', 'Tokens', 'Content', 'Forms', 'Uncategorized'],
            }
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
