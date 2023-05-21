import { create, ThemeVars } from '@storybook/theming';
import { LightTheme, DarkTheme, pvar } from '../src/stories/theme';

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
    inputBorderRadius: 0,
};

export const Light = create({
    ...sharedConfig,
    base: 'light',
    brandImage: 'https://fast.slingshot.fm/sling/logo/paris-sb.png',
    appBg: LightTheme.colors.backgroundPrimary,
});

export const Dark = create({
    ...sharedConfig,
    base: 'dark',
    brandImage: 'https://fast.slingshot.fm/sling/logo/paris-sb-white.png',
    appBg: DarkTheme.colors.backgroundPrimary,
    appContentBg: DarkTheme.colors.backgroundPrimary,
});
