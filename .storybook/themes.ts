import { create, ThemeVars } from '@storybook/theming';

/**
 * Shared theme variables across light and dark themes.
 */
const sharedConfig: Partial<ThemeVars> = {
    brandTitle: 'Paris',
    brandUrl: 'https://slingshot.fm',
    brandTarget: '_blank',
    colorSecondary: '#FB46BE',
    fontBase: '"Graphik Web", sans-serif',
    fontCode: '"Fira Code VF", monospace',
};

export const Light = create({
    ...sharedConfig,
    base: 'light',
    brandImage: 'https://fast.slingshot.fm/sling/logo/paris-sb.png',
});

export const Dark = create({
    ...sharedConfig,
    base: 'dark',
    appBg: '#000',
    appContentBg: '#141414',
    brandImage: 'https://fast.slingshot.fm/sling/logo/paris-sb-white.png',
});
