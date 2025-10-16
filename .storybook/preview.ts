/* eslint-disable react-hooks/rules-of-hooks */
import type { Decorator, Preview } from '@storybook/react';
import { DocsContainer } from '@storybook/blocks';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';
import { createElement, useEffect, useState } from 'react';

import '@fortawesome/fontawesome-svg-core/styles.css';
import '../public/graphik/graphik.css';
import '../public/fira/fira_code.css';
import '../src/styles/globals.css';
import '../src/stories/theme/global.scss';
import { config } from '@fortawesome/fontawesome-svg-core';
import { addons } from '@storybook/preview-api';
import { Dark, Light } from './themes';
import { injectTheme, LightTheme, DarkTheme } from '../src/stories/theme';

config.autoAddCss = false;

export const decorators: Decorator[] = [
    (renderStory) => {
        const isDark = useDarkMode();

        useEffect(() => {
            injectTheme(!isDark ? LightTheme : DarkTheme);
        }, [isDark]);

        return createElement('div', {}, renderStory());
    },
];

const channel = addons.getChannel();

const preview: Preview = {
    parameters: {
        backgrounds: { disable: true },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        docs: {
            container: (props: any) => {
                const [isDark, setDark] = useState();

                useEffect(() => {
                    channel.on(DARK_MODE_EVENT_NAME, setDark);
                    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
                }, [setDark]);

                useEffect(() => {
                    injectTheme(!isDark ? LightTheme : DarkTheme);
                }, [isDark]);

                const containerProps = {
                    ...props,
                    theme: isDark ? Dark : Light,
                };

                return createElement(DocsContainer, containerProps);
            },
        },
        options: {
            storySort: {
                order: [
                    'Welcome',
                    'Tokens',
                    'Inputs',
                    'Content',
                    'Uncategorized',
                ],
            },
        },
        darkMode: {
            stylePreview: true,
            // Override the default dark theme
            dark: Dark,
            // Override the default light theme
            light: Light,
        },
    },
};

export default preview;
