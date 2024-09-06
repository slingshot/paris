import { createTheme } from 'pte';
import type { CSSColor, CSSLength, PixelSize } from '@ssh/csstypes';
import type { Property } from 'csstype';
import type { PartialDeep } from 'type-fest';
import merge from 'ts-deepmerge';
import type { TokensT } from './tokens';
import { Tokens as T } from './tokens';

export type FontDefinition = {
    fontSize: CSSLength,
    fontWeight: number | 'normal',
    lineHeight: CSSLength,
    fontStyle: 'normal' | 'italic',
    letterSpacing: CSSLength | 'normal',
    textTransform: Property.TextTransform,
};

export type FontClassDefinition = Omit<FontDefinition, 'fontSize' | 'lineHeight'>;

export type ShadowDefinition = `${PixelSize} ${PixelSize} ${PixelSize} ${PixelSize} ${CSSColor}` | 'none';

export type TimingFunction = `cubic-bezier(${number}, ${number}, ${number}, ${number})` | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
export type Duration = `${number}ms` | `${number}s`;

const TimingFunctions: Omit<Theme['animations']['timing'], 'default'> = {
    easeInOut: 'cubic-bezier(0.42, 0.0, 0.58, 1.0)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.58, 1.0)',
    easeIn: 'cubic-bezier(0.42, 0.0, 1.0, 1.0)',
    easeOutQuad: 'cubic-bezier(0.5, 1, 0.89, 1)',
    easeInQuad: 'cubic-bezier(0.11, 0, 0.5, 0)',
    easeInOutExpo: 'cubic-bezier(0.87, 0, 0.13, 1)',
};

export type Theme = {
    tokens: TokensT,
    utils: {
        defaultUserSelect: Property.UserSelect,
    }
    colors: {
        // Primary
        black: CSSColor, // archive
        white: CSSColor, // archive
        accent: CSSColor, // archive
        negative: CSSColor, // archive
        warning: CSSColor, // archive
        positive: CSSColor, // archive

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
        backgroundSidebar: CSSColor, // archive maybe
        backgroundPrimary: CSSColor,
        backgroundSecondary: CSSColor,
        backgroundTertiary: CSSColor, // archive
        backgroundAccent: CSSColor,
        backgroundNegative: CSSColor,
        backgroundWarning: CSSColor,
        backgroundPositive: CSSColor,
        // Background New
        backgroundMobilePrimary: CSSColor,
        backgroundMobileSecondary: CSSColor,
        backgroundNegativeMedium: CSSColor,
        backgroundNegativeStrong: CSSColor,
        backgroundWarningMedium: CSSColor,
        backgroundWarningStrong: CSSColor,
        backgroundPositiveMedium: CSSColor,
        backgroundPositiveStrong: CSSColor,
        backgroundAccentMedium: CSSColor,
        backgroundAccentStrong: CSSColor,

        // Surface New
        surfacePrimary: CSSColor,
        surfaceSecondary: CSSColor,
        surfaceTertiary: CSSColor,
        surfaceQuaternary: CSSColor,

        // Border New
        borderSubtle: CSSColor,
        borderMedium: CSSColor,
        borderStrong: CSSColor,
        borderUltrastrong: CSSColor,

        // Button New
        buttonFill: CSSColor,
        buttonFillHover: CSSColor,
        buttonFillDisabled: CSSColor,
        buttonFillHoverAlt: CSSColor,
        buttonFillHoverNegative: CSSColor,
        buttonBorder: CSSColor,
        buttonBorderDisabled: CSSColor,
        buttonBorderNegative: CSSColor,

        // Input New
        inputFill: CSSColor,
        inputFillFocus: CSSColor,
        inputFillNegative: CSSColor,
        inputFillDisabled: CSSColor,
        inputBorderFocus: CSSColor,
        inputBorderNegative: CSSColor,

        // Overlay New
        overlaySubtle: CSSColor,
        overlayMedium: CSSColor,
        overlayStrong: CSSColor,
        overlayInverseSubtle: CSSColor,
        overlayInverseMedium: CSSColor,
        overlayWhiteSubtle: CSSColor,
        overlayWhiteMedium: CSSColor,
        overlayWhiteStrong: CSSColor,
        overlayWhiteUltrastrong: CSSColor,
        overlayBlackSubtle: CSSColor,
        overlayBlackMedium: CSSColor,
        overlayBlackStrong: CSSColor,
        overlayPageBackground: CSSColor,
        overlayRed: CSSColor,
        overlayTeal: CSSColor,

        // Background Inverse
        backgroundInverseSidebar: CSSColor, // archive
        backgroundInversePrimary: CSSColor, // archive
        backgroundInverseSecondary: CSSColor, // archive
        backgroundInverseTertiary: CSSColor, // archive
        backgroundInverseNegative: CSSColor, // archive
        backgroundInverseWarning: CSSColor, // archive
        backgroundInversePositive: CSSColor, // archive

        // Background Overlays
        backgroundOverlayLight: CSSColor, // archive
        backgroundOverlayXLight: CSSColor, // archive
        backgroundOverlayGrey: CSSColor, // archive
        backgroundOverlayDark: CSSColor, // archive
        backgroundOverlayTeal: CSSColor, // archive

        // Border
        borderOpaque: CSSColor, // archive
        borderSelected: CSSColor, // archive
        borderAccent: CSSColor, // archive
        borderNegative: CSSColor, // archive
        borderWarning: CSSColor, // archive
        borderPositive: CSSColor, // archive

        // Border Inverse
        borderInverseOpaque: CSSColor, // archive
        borderInverseSelected: CSSColor, // archive
    },
    blurs: {
        strong: string,
        ultrastrong: string,
    },
    typography: {
        fontFamily: string,
        italicLetterSpacing: CSSLength,
        verticalMetricsAdjust: CSSLength;

        fontWeights: {
            thin: number,
            extralight: number,
            light: number,
            normal: number,
            medium: number,
            semibold: number,
            bold: number,
            extrabold: number,
            black: number,
            extrablack: number,
        },

        fontStyles: {
            normal: string,
            italic: string,
        }

        styles: {
            // Display

            displayLarge: FontDefinition,
            displayMedium: FontDefinition,
            display: FontDefinition,
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
            labelXXSmall: FontDefinition,

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
        shallowRight: ShadowDefinition, // archive
    },
    materials: {
        // Simple Materials
        whiteThin: {
            background: CSSColor,
        },
        whiteRegular: {
            background: CSSColor,
        },
        whiteThick: {
            background: CSSColor,
        },
        blackThin: {
            background: CSSColor,
        },
        blackRegular: {
            background: CSSColor,
        },
        blackThick: {
            background: CSSColor,
        },

        // Multi-part Materials
        lightGreyUltrathin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        lightGreyThin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        lightGreyRegular: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        lightGreyThick: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        darkGreyUltrathin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        darkGreyThin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        darkGreyRegular: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        darkGreyThick: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        greyUltrathin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        greyThin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        greyRegular: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        greyThick: {
            background: CSSColor,
            backgroundBlendMode: string,
        },

        // Material Variables
        primaryThin: {
            background: CSSColor,
        },
        primaryRegular: {
            background: CSSColor,
        },
        primaryThick: {
            background: CSSColor,
        },
        secondaryUltrathin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        secondaryThin: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        secondaryRegular: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
        secondaryThick: {
            background: CSSColor,
            backgroundBlendMode: string,
        },
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
            roundedXL: CSSLength,
        },

        // Dropdowns (Select, Menu, Popovers, etc.)

        dropdown: {
            color: CSSColor,
            shadow: ShadowDefinition,
            border: `${number}px ${string} ${CSSColor}` | 'none',
        },
    },
    surfaces: {
        dialog: {
            border: `${number}px ${string} ${CSSColor}`,
            outline: `${number}px ${string} ${CSSColor}`,
            background: CSSColor,
            backdropFilter: string,
        },
    },
    animations: {
        interaction: string,
        timing: {
            easeInOut: TimingFunction,
            easeOut: TimingFunction,
            easeIn: TimingFunction,
            easeOutQuad: TimingFunction,
            easeInQuad: TimingFunction,
            easeInOutExpo: TimingFunction,
            default: TimingFunction,
        },
        duration: {
            rapid: Duration,
            fast: Duration,
            normal: Duration,
            relaxed: Duration,
            slow: Duration,
            gradual: Duration,
        },
    },
    breakpoints: {
        sm: `${number}px`,
        md: `${number}px`,
        lg: `${number}px`,
        xl: `${number}px`,
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
        black: T.colors.old_black, // archive
        white: T.colors.old_white, // archive
        accent: T.colors.old_teal, // archive
        negative: T.colors.old_red, // archive
        warning: T.colors.old_yellow, // archive
        positive: T.colors.old_green, // archive

        // Content
        contentPrimary: T.colors.grey2400,
        contentSecondary: T.colors.old_grey600, // grey1600
        contentTertiary: T.colors.old_grey500, // grey1400
        contentDisabled: T.colors.old_grey400, // grey1100
        contentAccent: T.colors.teal400,
        contentNegative: T.colors.red400,
        contentWarning: T.colors.old_yellow400, // yellow500
        contentPositive: T.colors.green400,

        // Content Inverse
        contentInversePrimary: T.colors.white,
        contentInverseSecondary: T.colors.grey600,
        contentInverseTertiary: T.colors.grey1000,
        contentInverseDisabled: T.colors.old_grey500, // grey1400

        // Background
        backgroundSidebar: T.colors.old_black, // archive, though maybe not
        backgroundPrimary: T.colors.white,
        backgroundSecondary: T.colors.old_grey50, // grey100
        backgroundTertiary: T.colors.old_grey100, // archive
        backgroundAccent: T.colors.teal100,
        backgroundNegative: T.colors.red100,
        backgroundWarning: T.colors.yellow100,
        backgroundPositive: T.colors.green100,
        // Background New
        backgroundMobilePrimary: T.colors.white,
        backgroundMobileSecondary: T.colors.grey100,
        backgroundNegativeMedium: T.colors.red200,
        backgroundNegativeStrong: T.colors.red300,
        backgroundWarningMedium: T.colors.yellow200,
        backgroundWarningStrong: T.colors.yellow300,
        backgroundPositiveMedium: T.colors.green200,
        backgroundPositiveStrong: T.colors.green300,
        backgroundAccentMedium: T.colors.teal200,
        backgroundAccentStrong: T.colors.teal300,

        // Surface New
        surfacePrimary: T.colors.white,
        surfaceSecondary: T.colors.grey200,
        surfaceTertiary: T.colors.grey400,
        surfaceQuaternary: T.colors.grey100,

        // Border New
        borderSubtle: T.colors.grey400,
        borderMedium: T.colors.grey600,
        borderStrong: T.colors.grey700,
        borderUltrastrong: T.colors.grey1400,

        // Button New
        buttonFill: T.colors.grey2400,
        buttonFillHover: T.colors.grey1900,
        buttonFillDisabled: T.colors.grey500,
        buttonFillHoverAlt: T.colors.grey300,
        buttonFillHoverNegative: T.colors.red100,
        buttonBorder: T.colors.grey2400,
        buttonBorderDisabled: T.colors.grey1000,
        buttonBorderNegative: T.colors.red400,

        // Input New
        inputFill: T.colors.grey300,
        inputFillFocus: T.colors.grey400,
        inputFillNegative: T.colors.red100,
        inputFillDisabled: T.colors.grey200,
        inputBorderFocus: T.colors.grey1400,
        inputBorderNegative: T.colors.red400,

        // Overlay New
        overlaySubtle: 'rgba(0, 0, 0, 0.02)',
        overlayMedium: 'rgba(0, 0, 0, 0.03)',
        overlayStrong: 'rgba(0, 0, 0, 0.05)',
        overlayInverseSubtle: 'rgba(255, 255, 255, 0.02)',
        overlayInverseMedium: 'rgba(255, 255, 255, 0.05)',
        overlayWhiteSubtle: 'rgba(255, 255, 255, 0.04)',
        overlayWhiteMedium: 'rgba(255, 255, 255, 0.09)',
        overlayWhiteStrong: 'rgba(255, 255, 255, 0.11)',
        overlayWhiteUltrastrong: 'rgba(255, 255, 255, 0.85)',
        overlayBlackSubtle: 'rgba(0, 0, 0, 0.04)',
        overlayBlackMedium: 'rgba(0, 0, 0, 0.07)',
        overlayBlackStrong: 'rgba(0, 0, 0, 0.1)',
        overlayPageBackground: 'rgba(60, 60, 60, 0.65)',
        overlayRed: 'rgba(253, 77, 46, 0.07)',
        overlayTeal: 'rgba(29, 238, 205, 0.1)',

        // Background Inverse
        backgroundInverseSidebar: T.colors.old_grey1050, // archive
        backgroundInversePrimary: T.colors.old_black, // archive
        backgroundInverseSecondary: T.colors.old_grey900, // archive
        backgroundInverseTertiary: T.colors.old_grey800, // archive
        backgroundInverseNegative: T.colors.old_red700, // archive
        backgroundInverseWarning: T.colors.old_yellow600, // archive
        backgroundInversePositive: T.colors.old_green700, // archive

        // Background Overlays
        backgroundOverlayLight: 'rgba(255, 255, 255, 0.07)', // archive
        backgroundOverlayXLight: 'rgba(255, 255, 255, 0.1)', // archive
        backgroundOverlayGrey: 'rgba(60, 60, 60, 0.65)', // archive
        backgroundOverlayDark: 'rgba(0, 0, 0, 0.1)', // archive
        backgroundOverlayTeal: 'rgba(29, 238, 205, 0.1)', // archive

        // Border
        borderOpaque: T.colors.old_grey200, // archive
        borderSelected: T.colors.old_grey500, // archive
        borderAccent: T.colors.old_teal400, // archive
        borderNegative: T.colors.old_red400, // archive
        borderWarning: T.colors.old_yellow400, // archive
        borderPositive: T.colors.old_green400, // archive

        // Border Inverse
        borderInverseOpaque: T.colors.old_grey750, // archive
        borderInverseSelected: T.colors.old_grey200, // archive
    },
    blurs: {
        strong: 'blur(17.5px)',
        ultrastrong: 'blur(37.5px)',
    },
    typography: {
        fontFamily: '"Graphik Web", -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif',
        italicLetterSpacing: '-0.01em',
        verticalMetricsAdjust: '1px',

        fontWeights: {
            thin: 100,
            extralight: 200,
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
            extrablack: 950,
        },

        fontStyles: {
            italic: 'italic',
            normal: 'normal',
        },

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
            display: {
                ...DisplayFontClass,
                fontSize: '42px',
                lineHeight: '50.4px',
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
            labelXXSmall: {
                ...LabelFontClass,
                fontSize: '9px',
                lineHeight: '10.8px',
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
        shallowAbove: '0px -4px 20px 0px rgba(0, 0, 0, 0.2)',
        deepAbove: '0px -8px 20px 0px rgba(0, 0, 0, 0.2)',
        shallowBelow: '0px 4px 20px 0px rgba(0, 0, 0, 0.2)',
        deepBelow: '0px 8px 20px 0px rgba(0, 0, 0, 0.2)',
        shallowLeft: '-20px 0px 40px 0px rgba(0, 0, 0, 0.1)',
        shallowRight: '20px 0px 40px 0px rgba(0, 0, 0, 0.1)', // archive
        subtlePopup: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
        shallowPopup: '0px 0px 30px 0px rgba(0, 0, 0, 0.2)',
        deepPopup: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)',
    },
    materials: {
        whiteThin: {
            background: 'rgba(255, 255, 255, 0.5)',
        },
        whiteRegular: {
            background: 'rgba(255, 255, 255, 0.85)',
        },
        whiteThick: {
            background: 'rgba(255, 255, 255, 0.93)',
        },
        blackThin: {
            background: 'rgba(0, 0, 0, 0.3)',
        },
        blackRegular: {
            background: 'rgba(0, 0, 0, 0.75)',
        },
        blackThick: {
            background: 'rgba(0, 0, 0, 0.85)',
        },

        lightGreyUltrathin: {
            background: 'linear-gradient(0deg, #303030 0%, #303030 100%), rgba(191, 191, 191, 0.44)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        lightGreyThin: {
            background: 'linear-gradient(0deg, #3D3D3D 0%, #3D3D3D 100%), rgba(166, 166, 166, 0.70)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        lightGreyRegular: {
            background: 'linear-gradient(0deg, #434343 0%, #434343 100%), rgba(179, 179, 179, 0.82)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        lightGreyThick: {
            background: 'linear-gradient(0deg, #5F5F5F 0%, #5F5F5F 100%), rgba(153, 153, 153, 0.97)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        darkGreyUltrathin: {
            background: 'linear-gradient(0deg, #9C9C9C 0%, #9C9C9C 100%), rgba(37, 37, 37, 0.55)',
            backgroundBlendMode: 'overlay, normal',
        },
        darkGreyThin: {
            background: 'linear-gradient(0deg, #9C9C9C 0%, #9C9C9C 100%), rgba(37, 37, 37, 0.70)',
            backgroundBlendMode: 'overlay, normal',
        },
        darkGreyRegular: {
            background: 'linear-gradient(0deg, #8C8C8C 0%, #8C8C8C 100%), rgba(37, 37, 37, 0.82)',
            backgroundBlendMode: 'overlay, normal',
        },
        darkGreyThick: {
            background: 'linear-gradient(0deg, #7C7C7C 0%, #7C7C7C 100%), rgba(37, 37, 37, 0.90)',
            backgroundBlendMode: 'overlay, normal',
        },
        greyUltrathin: {
            background: 'linear-gradient(0deg, #D2D2D2 0%, #D2D2D2 100%), rgba(37, 37, 37, 0.55)',
            backgroundBlendMode: 'overlay, normal',
        },
        greyThin: {
            background: 'linear-gradient(0deg, #CFCFCF 0%, #CFCFCF 100%), rgba(37, 37, 37, 0.70)',
            backgroundBlendMode: 'overlay, normal',
        },
        greyRegular: {
            background: 'linear-gradient(0deg, #BCBCBC 0%, #BCBCBC 100%), rgba(37, 37, 37, 0.82)',
            backgroundBlendMode: 'overlay, normal',
        },
        greyThick: {
            background: 'linear-gradient(0deg, #B6B6B6 0%, #B6B6B6 100%), rgba(37, 37, 37, 0.90)',
            backgroundBlendMode: 'overlay, normal',
        },

        primaryThin: {
            background: 'rgba(255, 255, 255, 0.5)',
        },
        primaryRegular: {
            background: 'rgba(255, 255, 255, 0.85)',
        },
        primaryThick: {
            background: 'rgba(255, 255, 255, 0.93)',
        },
        secondaryUltrathin: {
            background: 'linear-gradient(0deg, #303030 0%, #303030 100%), rgba(191, 191, 191, 0.44)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        secondaryThin: {
            background: 'linear-gradient(0deg, #3D3D3D 0%, #3D3D3D 100%), rgba(166, 166, 166, 0.70)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        secondaryRegular: {
            background: 'linear-gradient(0deg, #434343 0%, #434343 100%), rgba(179, 179, 179, 0.82)',
            backgroundBlendMode: 'color-dodge, normal',
        },
        secondaryThick: {
            background: 'linear-gradient(0deg, #5F5F5F 0%, #5F5F5F 100%), rgba(153, 153, 153, 0.97)',
            backgroundBlendMode: 'color-dodge, normal',
        },
    },
    borders: {
        radius: {
            pill: '1000px',
            circle: '100%',
            rectangle: '0px',
            rounded: '8px',
            roundedSmall: '4px',
            roundedLarge: '12px',
            roundedXL: '16px',
        },

        dropdown: {
            shadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.2)',
            color: 'transparent',
            border: 'none',
        },
    },
    surfaces: {
        dialog: {
            border: '8px solid rgba(0, 0, 0, 0.2)',
            outline: '1px solid rgba(0, 0, 0, 0.25)',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(6px)',
        },
    },
    animations: {
        interaction: '200ms cubic-bezier(0.5, 1, 0.89, 1)',
        timing: {
            ...TimingFunctions,
            default: TimingFunctions.easeOut,
        },
        duration: {
            rapid: '50ms',
            fast: '100ms',
            normal: '200ms',
            relaxed: '300ms',
            slow: '400ms',
            gradual: '600ms',
        },
    },
    breakpoints: {
        sm: '480px',
        md: '640px',
        lg: '768px',
        xl: '1024px',
    },
};

export const DarkTheme: Theme = merge(LightTheme, {
    colors: {
        // Reverse all inverse colors

        contentPrimary: LightTheme.colors.contentInversePrimary, // T.colors.grey200
        contentSecondary: LightTheme.colors.contentInverseSecondary, // T.colors.grey800
        contentTertiary: LightTheme.colors.contentInverseTertiary, // T.colors.grey1000
        contentDisabled: LightTheme.colors.contentInverseDisabled, // T.colors.grey1300

        contentInversePrimary: LightTheme.colors.contentPrimary, // T.colors.grey2400
        contentInverseSecondary: LightTheme.colors.contentSecondary, // T.colors.grey1600
        contentInverseTertiary: LightTheme.colors.contentTertiary, // T.colors.grey1400
        contentInverseDisabled: LightTheme.colors.contentDisabled, // T.colors.grey1000

        backgroundSidebar: LightTheme.colors.backgroundInverseSidebar, // archive
        backgroundPrimary: LightTheme.colors.backgroundInversePrimary, // T.colors.grey2400
        backgroundSecondary: LightTheme.colors.backgroundInverseSecondary, // T.colors.grey2200
        backgroundTertiary: LightTheme.colors.backgroundInverseTertiary, // archive
        backgroundNegative: LightTheme.colors.backgroundInverseNegative, // T.colors.red800
        backgroundWarning: LightTheme.colors.backgroundInverseWarning, // T.colors.yellow800
        backgroundPositive: LightTheme.colors.backgroundInversePositive, // T.colors.green800

        // Background New
        backgroundMobilePrimary: T.colors.black,
        backgroundMobileSecondary: T.colors.grey2300,
        backgroundNegativeMedium: T.colors.red700,
        backgroundNegativeStrong: T.colors.red600,
        backgroundWarningMedium: T.colors.yellow700,
        backgroundWarningStrong: T.colors.yellow600,
        backgroundPositiveMedium: T.colors.green700,
        backgroundPositiveStrong: T.colors.green600,
        backgroundAccent: T.colors.teal800,
        backgroundAccentMedium: T.colors.teal700,
        backgroundAccentStrong: T.colors.teal600,

        // Surface
        surfacePrimary: T.colors.grey2000,
        surfaceSecondary: T.colors.grey2100,
        surfaceTertiary: T.colors.grey2200,
        surfaceQuaternary: T.colors.grey1900,

        // Border
        borderSubtle: T.colors.grey2000,
        borderMedium: T.colors.grey1700,
        borderStrong: T.colors.grey1600,
        borderUltrastrong: T.colors.grey900,

        // Button
        buttonFill: T.colors.grey200,
        buttonFillHover: T.colors.grey400,
        buttonFillDisabled: T.colors.grey1700,
        buttonFillHoverAlt: T.colors.grey2000,
        buttonFillHoverNegative: T.colors.red800,
        buttonBorder: T.colors.grey100,
        buttonBorderDisabled: T.colors.grey1400,
        buttonBorderNegative: T.colors.red400,

        // Input
        inputFill: T.colors.grey2200,
        inputFillFocus: T.colors.grey2300,
        inputFillNegative: T.colors.red800,
        inputFillDisabled: T.colors.grey2100,
        inputBorderFocus: T.colors.grey900,

        // Overlay
        overlaySubtle: 'rgba(255, 255, 255, 0.03)',
        overlayMedium: 'rgba(255, 255, 255, 0.07)',
        overlayStrong: 'rgba(255, 255, 255, 0.09)',
        overlayInverseSubtle: 'rgba(0, 0, 0, 0.02)',
        overlayInverseMedium: 'rgba(0, 0, 0, 0.05)',
        overlayWhiteUltrastrong: 'rgba(0, 0, 0, 0.18)',
        overlayBlackSubtle: 'rgba(255, 255, 255, 0.2)',
        overlayBlackMedium: 'rgba(255, 255, 255, 0.3)',
        overlayBlackStrong: 'rgba(255, 255, 255, 0.4)',
        overlayPageBackground: 'rgba(18, 18, 18, 0.75)',

        // Archive
        borderOpaque: LightTheme.colors.borderInverseOpaque,
        borderSelected: LightTheme.colors.borderInverseSelected,

        backgroundInverseSidebar: LightTheme.colors.backgroundSidebar,
        backgroundInversePrimary: LightTheme.colors.backgroundPrimary,
        backgroundInverseSecondary: LightTheme.colors.backgroundSecondary,
        backgroundInverseTertiary: LightTheme.colors.backgroundTertiary,
        backgroundInverseNegative: LightTheme.colors.backgroundNegative,
        backgroundInverseWarning: LightTheme.colors.backgroundWarning,
        backgroundInversePositive: LightTheme.colors.backgroundPositive,

        borderInverseOpaque: LightTheme.colors.borderOpaque,
        borderInverseSelected: LightTheme.colors.borderSelected,
    },
    lighting: {
        deepBelow: '0px 20px 30px 10px rgba(0, 0, 0, 0.5)',
        shallowLeft: '-20px 0px 60px 20px rgba(0, 0, 0, 0.25)',
        deepPopup: '0px 0px 40px 15px rgba(0, 0, 0, 0.35)',
    },
    materials: {
        primaryThin: {
            background: 'rgba(0, 0, 0, 0.3)',
        },
        primaryRegular: {
            background: 'rgba(0, 0, 0, 0.75)',
        },
        primaryThick: {
            background: 'rgba(0, 0, 0, 0.85)',
        },
        secondaryUltrathin: {
            background: 'linear-gradient(0deg, #9C9C9C 0%, #9C9C9C 100%), rgba(37, 37, 37, 0.55)',
            backgroundBlendMode: 'overlay, normal',
        },
        secondaryThin: {
            background: 'linear-gradient(0deg, #9C9C9C 0%, #9C9C9C 100%), rgba(37, 37, 37, 0.70)',
            backgroundBlendMode: 'overlay, normal',
        },
        secondaryRegular: {
            background: 'linear-gradient(0deg, #8C8C8C 0%, #8C8C8C 100%), rgba(37, 37, 37, 0.82)',
            backgroundBlendMode: 'overlay, normal',
        },
        secondaryThick: {
            background: 'linear-gradient(0deg, #7C7C7C 0%, #7C7C7C 100%), rgba(37, 37, 37, 0.90)',
            backgroundBlendMode: 'overlay, normal',
        },
    },
    borders: {
        dropdown: {
            shadow: 'none',
            color: T.colors.old_grey600,
            border: `1px solid ${T.colors.old_grey600}`,
        },
    },
    surfaces: {
        dialog: {
            border: '8px solid rgba(255, 255, 255, 0.2)',
            outline: '1px solid rgba(255, 255, 255, 0.25)',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(6px)',
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
