import { createTheme } from 'pte';
import type { CSSColor, CSSLength } from '@ssh/csstypes';
import type { Property } from 'csstype';
import type { PartialDeep } from 'type-fest';
import merge from 'ts-deepmerge';
import { Tokens as T } from './tokens';
import type { TokensT } from './tokens';

export type FontDefinition = {
    fontSize: CSSLength,
    fontWeight: number | 'normal',
    lineHeight: CSSLength,
    fontStyle: 'normal' | 'italic',
    letterSpacing: CSSLength | 'normal',
    textTransform: Property.TextTransform,
};

export type FontClassDefinition = Omit<FontDefinition, 'fontSize' | 'lineHeight'>;

export type ShadowDefinition = `${CSSLength} ${CSSLength} ${CSSLength} ${CSSColor}` | 'none';

const Shadows = {
    shallowBelow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
    deepBelow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
    shallowAbove: '0px -4px 20px rgba(0, 0, 0, 0.2)',
    deepAbove: '0px -8px 20px rgba(0, 0, 0, 0.2)',
    shallowPopup: '0px 0px 30px rgba(0, 0, 0, 0.2)',
    deepPopup: '0px 0px 40px rgba(0, 0, 0, 0.2)',
    subtlePopup: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    shallowLeft: '-20px 0px 40px rgba(0, 0, 0, 0.1)',
    shallowRight: '20px 0px 40px rgba(0, 0, 0, 0.1)',
} as const;

export type Theme = {
    tokens: TokensT,
    utils: {
        defaultUserSelect: Property.UserSelect,
    }
    colors: {
        // Primary

        black: CSSColor,
        white: CSSColor,
        accent: CSSColor,
        negative: CSSColor,
        warning: CSSColor,
        positive: CSSColor,

        // Content

        contentPrimary: CSSColor,
        contentSecondary: CSSColor,
        contentTertiary: CSSColor,
        contentDisabled: CSSColor,
        contentAccent: CSSColor,
        contentNegative: CSSColor,
        contentWarning: CSSColor,
        contentPositive: CSSColor,

        // Content Inverse

        contentInversePrimary: CSSColor,
        contentInverseSecondary: CSSColor,
        contentInverseTertiary: CSSColor,
        contentInverseDisabled: CSSColor,

        // Background

        backgroundSidebar: CSSColor,
        backgroundPrimary: CSSColor,
        backgroundSecondary: CSSColor,
        backgroundTertiary: CSSColor,
        backgroundAccent: CSSColor,
        backgroundNegative: CSSColor,
        backgroundWarning: CSSColor,
        backgroundPositive: CSSColor,

        // Background Inverse

        backgroundInverseSidebar: CSSColor,
        backgroundInversePrimary: CSSColor,
        backgroundInverseSecondary: CSSColor,
        backgroundInverseTertiary: CSSColor,
        backgroundInverseNegative: CSSColor,
        backgroundInversePositive: CSSColor,

        // Background Overlays

        backgroundOverlayLight: CSSColor,
        backgroundOverlayXLight: CSSColor,
        backgroundOverlayGrey: CSSColor,
        backgroundOverlayTeal: CSSColor,

        // Border

        borderOpaque: CSSColor,
        borderSelected: CSSColor,
        borderAccent: CSSColor,
        borderNegative: CSSColor,
        borderWarning: CSSColor,
        borderPositive: CSSColor,

        // Border Inverse

        borderInverseOpaque: CSSColor,
        borderInverseSelected: CSSColor,
    },
    typography: {
        fontFamily: string,
        boldFontWeight: number,
        italicLetterSpacing: CSSLength,
        verticalMetricsAdjust: CSSLength;

        styles: {
            // Display

            displayLarge: FontDefinition,
            displayMedium: FontDefinition,
            displaySmall: FontDefinition,

            // Heading

            headingLarge: FontDefinition,
            headingMedium: FontDefinition,
            headingSmall: FontDefinition,
            headingXSmall: FontDefinition,
            headingXXSmall: FontDefinition,

            // Label

            labelXLarge: FontDefinition,
            labelLarge: FontDefinition,
            labelMedium: FontDefinition,
            labelSmall: FontDefinition,
            labelXSmall: FontDefinition,

            // Paragraph

            paragraphLarge: FontDefinition,
            paragraphMedium: FontDefinition,
            paragraphSmall: FontDefinition,
            paragraphXSmall: FontDefinition,
            paragraphXXSmall: FontDefinition,
        }
    },
    lighting: {
        shallowBelow: ShadowDefinition,
        deepBelow: ShadowDefinition,
        shallowAbove: ShadowDefinition,
        deepAbove: ShadowDefinition,
        shallowPopup: ShadowDefinition,
        deepPopup: ShadowDefinition,
        subtlePopup: ShadowDefinition,
        shallowLeft: ShadowDefinition,
        shallowRight: ShadowDefinition,
    },
    borders: {
        // Border Radius
        radius: {
            pill: CSSLength,
            circle: CSSLength,
            rectangle: CSSLength,
            rounded: CSSLength,
            roundedSmall: CSSLength,
            roundedLarge: CSSLength,
        },

        // Dropdowns (Select, Menu, Popovers, etc.)

        dropdown: {
            color: CSSColor,
            shadow: ShadowDefinition,
        }
    },
    animations: {
        interaction: string,
    }
};

export type ThemeOverrides = PartialDeep<Theme>;

export const DisplayFontClass: FontClassDefinition = {
    fontStyle: 'normal',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    textTransform: 'none',
};

export const HeadingFontClass: FontClassDefinition = {
    fontStyle: 'normal',
    letterSpacing: 'normal',
    fontWeight: 600,
    textTransform: 'none',
};

export const LabelFontClass: FontClassDefinition = {
    fontStyle: 'normal',
    letterSpacing: '0.1em',
    fontWeight: 600,
    textTransform: 'uppercase',
};

export const ParagraphFontClass: FontClassDefinition = {
    fontStyle: 'normal',
    letterSpacing: 'normal',
    fontWeight: 400,
    textTransform: 'none',
};

export const LightTheme: Theme = {
    tokens: T,
    utils: {
        defaultUserSelect: 'none',
    },
    colors: {
        // Primary

        black: T.colors.black,
        white: T.colors.white,
        accent: T.colors.teal,
        negative: T.colors.red,
        warning: T.colors.yellow,
        positive: T.colors.green,

        // Content

        contentPrimary: T.colors.grey1050,
        contentSecondary: T.colors.grey600,
        contentTertiary: T.colors.grey500,
        contentDisabled: T.colors.grey400,
        contentAccent: T.colors.teal400,
        contentNegative: T.colors.red400,
        contentWarning: T.colors.yellow400,
        contentPositive: T.colors.green400,

        // Content Inverse

        contentInversePrimary: T.colors.white,
        contentInverseSecondary: T.colors.grey200,
        contentInverseTertiary: T.colors.grey400,
        contentInverseDisabled: T.colors.grey500,

        // Background

        backgroundSidebar: T.colors.black,
        backgroundPrimary: T.colors.white,
        backgroundSecondary: T.colors.grey50,
        backgroundTertiary: T.colors.grey100,
        backgroundAccent: T.colors.teal100,
        backgroundNegative: T.colors.red100,
        backgroundWarning: T.colors.yellow100,
        backgroundPositive: T.colors.green100,

        // Background Inverse

        backgroundInverseSidebar: T.colors.grey1050,
        backgroundInversePrimary: T.colors.black,
        backgroundInverseSecondary: T.colors.grey900,
        backgroundInverseTertiary: T.colors.grey800,
        backgroundInverseNegative: T.colors.red700,
        backgroundInversePositive: T.colors.green700,

        // Background Overlays

        backgroundOverlayLight: 'rgba(255, 255, 255, 0.07)',
        backgroundOverlayXLight: 'rgba(255, 255, 255, 0.1)',
        backgroundOverlayGrey: 'rgba(175, 175, 175, 0.8)',
        backgroundOverlayTeal: 'rgba(29, 238, 205, 0.1)',

        // Border

        borderOpaque: T.colors.grey200,
        borderSelected: T.colors.grey500,
        borderAccent: T.colors.teal400,
        borderNegative: T.colors.red400,
        borderWarning: T.colors.yellow400,
        borderPositive: T.colors.green400,

        // Border Inverse

        borderInverseOpaque: T.colors.grey750,
        borderInverseSelected: T.colors.grey200,
    },
    typography: {
        fontFamily: '"Graphik Web", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
        boldFontWeight: 500,
        italicLetterSpacing: '-0.01em',
        verticalMetricsAdjust: '1px',

        styles: {
            // Display

            displayLarge: {
                ...DisplayFontClass,
                fontSize: '72px',
                lineHeight: '86px',
            },
            displayMedium: {
                ...DisplayFontClass,
                fontSize: '52px',
                lineHeight: '62px',
            },
            displaySmall: {
                ...DisplayFontClass,
                fontSize: '34px',
                lineHeight: '41px',
            },

            // Heading

            headingLarge: {
                ...HeadingFontClass,
                fontSize: '32px',
                lineHeight: '38px',
            },
            headingMedium: {
                ...HeadingFontClass,
                fontSize: '28px',
                lineHeight: '34px',
            },
            headingSmall: {
                ...HeadingFontClass,
                fontSize: '24px',
                lineHeight: '29px',
            },
            headingXSmall: {
                ...HeadingFontClass,
                fontSize: '20px',
                lineHeight: '24px',
            },
            headingXXSmall: {
                ...HeadingFontClass,
                fontSize: '18px',
                lineHeight: '22px',
            },

            // Label

            labelXLarge: {
                ...LabelFontClass,
                fontSize: '18px',
                lineHeight: '22px',
            },
            labelLarge: {
                ...LabelFontClass,
                fontSize: '16px',
                lineHeight: '19px',
            },
            labelMedium: {
                ...LabelFontClass,
                fontSize: '14px',
                lineHeight: '17px',
            },
            labelSmall: {
                ...LabelFontClass,
                fontSize: '12px',
                lineHeight: '14px',
            },
            labelXSmall: {
                ...LabelFontClass,
                fontSize: '10px',
                lineHeight: '12px',
            },

            // Paragraph

            paragraphLarge: {
                ...ParagraphFontClass,
                fontSize: '18px',
                lineHeight: '150%',
            },
            paragraphMedium: {
                ...ParagraphFontClass,
                fontSize: '16px',
                lineHeight: '150%',
            },
            paragraphSmall: {
                ...ParagraphFontClass,
                fontSize: '14px',
                lineHeight: '150%',
            },
            paragraphXSmall: {
                ...ParagraphFontClass,
                fontSize: '12px',
                lineHeight: '150%',
            },
            paragraphXXSmall: {
                ...ParagraphFontClass,
                fontSize: '10px',
                lineHeight: '150%',
            },
        },
    },
    lighting: {
        ...Shadows,
    },
    borders: {
        radius: {
            pill: '1000px',
            circle: '100%',
            rectangle: '0px',
            rounded: '8px',
            roundedSmall: '4px',
            roundedLarge: '12px',
        },

        dropdown: {
            shadow: Shadows.deepBelow,
            color: 'transparent',
        },
    },
    animations: {
        interaction: '200ms cubic-bezier(0.5, 1, 0.89, 1)',
    },
};

export const DarkTheme: Theme = merge(LightTheme, {
    colors: {
        // Reverse all inverse colors

        contentPrimary: LightTheme.colors.contentInversePrimary,
        contentSecondary: LightTheme.colors.contentInverseSecondary,
        contentTertiary: LightTheme.colors.contentInverseTertiary,
        contentDisabled: LightTheme.colors.contentInverseDisabled,
        backgroundSidebar: LightTheme.colors.backgroundInverseSidebar,
        backgroundPrimary: LightTheme.colors.backgroundInversePrimary,
        backgroundSecondary: LightTheme.colors.backgroundInverseSecondary,
        backgroundTertiary: LightTheme.colors.backgroundInverseTertiary,
        backgroundNegative: LightTheme.colors.backgroundInverseNegative,
        backgroundPositive: LightTheme.colors.backgroundInversePositive,
        borderOpaque: LightTheme.colors.borderInverseOpaque,
        borderSelected: LightTheme.colors.borderInverseSelected,
        contentInversePrimary: LightTheme.colors.contentPrimary,
        contentInverseSecondary: LightTheme.colors.contentSecondary,
        contentInverseTertiary: LightTheme.colors.contentTertiary,
        contentInverseDisabled: LightTheme.colors.contentDisabled,
        backgroundInverseSidebar: LightTheme.colors.backgroundSidebar,
        backgroundInversePrimary: LightTheme.colors.backgroundPrimary,
        backgroundInverseSecondary: LightTheme.colors.backgroundSecondary,
        backgroundInverseTertiary: LightTheme.colors.backgroundTertiary,
        backgroundInverseNegative: LightTheme.colors.backgroundNegative,
        backgroundInversePositive: LightTheme.colors.backgroundPositive,
        borderInverseOpaque: LightTheme.colors.borderOpaque,
        borderInverseSelected: LightTheme.colors.borderSelected,
    },
    borders: {
        dropdown: {
            shadow: 'none',
            color: T.colors.grey600,
        },
    },
} as PartialDeep<Theme>) as Theme;

export const {
    theme,
    pvar,
    pget,
    updateTheme,
    injectTheme,
    generateThemeInjection,
} = createTheme<Theme>(LightTheme);
