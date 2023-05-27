import type {  Preview } from '@storybook/react';
import { Dark, Light } from './themes';
import { DocsContainer } from '@storybook/blocks';
import { useDarkMode } from 'storybook-dark-mode';
import { createElement, useEffect } from 'react';
import { injectTheme, LightTheme, DarkTheme } from '../src/stories/theme';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '../public/graphik/graphik.css';
import '../public/fira/fira_code.css';
import '../src/styles/globals.css';
import '../src/stories/theme/global.scss';
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

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
        backgrounds: { disable: true },
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
                order: [
                    'Welcome',
                    'Tokens',
                    'Inputs',
                    'Content',
                    'Uncategorized'
                ],
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
