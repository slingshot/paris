import type { Property } from 'csstype';
import type { TokensT } from './tokens';
import type { CSSColor, CSSLength } from '@ssh/csstypes';
import type { PartialDeep } from 'type-fest';

export type FontDefinition = {
    fontSize: CSSLength,
    fontWeight: number | 'normal',
    lineHeight: CSSLength,
    fontStyle: 'normal' | 'italic',
    letterSpacing: CSSLength | 'normal',
    textTransform: Property.TextTransform,
};

export type FontClassDefinition = Omit<FontDefinition, 'fontSize' | 'lineHeight'>;

export type Theme = {
    tokens: TokensT,
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
    },
};

export type ThemeOverrides = PartialDeep<Theme>;
