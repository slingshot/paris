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

export type ShadowsType = {
    shallowAbove: ShadowDefinition,
    deepAbove: ShadowDefinition,
    shallowBelow: ShadowDefinition,
    deepBelow: ShadowDefinition,
    shallowLeft: ShadowDefinition,
    shallowRight: ShadowDefinition,
    subtlePopup: ShadowDefinition,
    shallowPopup: ShadowDefinition,
    deepPopup: ShadowDefinition,
};

const Shadows: ShadowsType = {
    shallowAbove: '0px -4px 20px 0px rgba(0, 0, 0, 0.2)',
    deepAbove: '0px -8px 20px 0px rgba(0, 0, 0, 0.2)',
    shallowBelow: '0px 4px 20px 0px rgba(0, 0, 0, 0.2)',
    deepBelow: '0px 8px 20px 0px rgba(0, 0, 0, 0.2)',
    shallowLeft: '-20px 0px 40px 0px rgba(0, 0, 0, 0.1)',
    shallowRight: '20px 0px 40px 0px rgba(0, 0, 0, 0.1)',
    subtlePopup: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    shallowPopup: '0px 0px 30px 0px rgba(0, 0, 0, 0.2)',
    deepPopup: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)',
};

const ShadowsDark: ShadowsType = {
    ...Shadows,
    deepBelow: '0px 20px 30px 10px rgba(0, 0, 0, 0.5)',
    shallowLeft: '-20px 0px 60px 20px rgba(0, 0, 0, 0.25)',
    shallowRight: '20px 0px 60px 20px rgba(0, 0, 0, 0.25)',
    deepPopup: '0px 0px 40px 15px rgba(0, 0, 0, 0.35)',
};

export type GlowsType = {
    glowSubtle1: ShadowDefinition,
    glowSubtle2: ShadowDefinition,
    glowSubtle3: ShadowDefinition,
    glowDeep1: ShadowDefinition,
    glowDeep2: ShadowDefinition,
    glowDeep3: ShadowDefinition,
};

const Glows: GlowsType = {
    glowSubtle1: '0px 0px 3px 0px rgba(29, 238, 205, 0.3)',
    glowSubtle2: '0px 0px 6px 0px rgba(29, 238, 205, 0.2)',
    glowSubtle3: '0px 0px 9px 0px rgba(29, 238, 205, 0.1)',
    glowDeep1: '0px 0px 3px 1px rgba(29, 238, 205, 0.3)',
    glowDeep2: '0px 0px 9px 3px rgba(29, 238, 205, 0.3)',
    glowDeep3: '0px 0px 15px 0px rgba(29, 238, 205, 0.2)',
};

const GlowsDark: GlowsType = {
    glowSubtle1: '0px 0px 3px 0px rgba(29, 238, 205, 0.15)',
    glowSubtle2: '0px 0px 6px 0px rgba(29, 238, 205, 0.1)',
    glowSubtle3: '0px 0px 9px 0px rgba(29, 238, 205, 0.05)',
    glowDeep1: '0px 0px 3px 1px rgba(29, 238, 205, 0.15)',
    glowDeep2: '0px 0px 9px 3px rgba(29, 238, 205, 0.15)',
    glowDeep3: '0px 0px 12px 0px rgba(29, 238, 205, 0.1)',
};

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
    new: {
        tokens: TokensT['new'],
        utils: {
            defaultUserSelect: Property.UserSelect,
        }
        colors: {
            // Content
            contentPrimary: CSSColor,
            contentSecondary: CSSColor,
            contentTertiary: CSSColor,
            contentDisabled: CSSColor,
            contentAccent: CSSColor,
            contentNegative: CSSColor,
            contentWarning: CSSColor,
            contentPositive: CSSColor,
            contentLink: CSSColor,

            // Content Inverse
            contentInversePrimary: CSSColor,
            contentInverseSecondary: CSSColor,
            contentInverseTertiary: CSSColor,
            contentInverseDisabled: CSSColor,

            // Background
            backgroundPrimary: CSSColor,
            backgroundSecondary: CSSColor,
            backgroundMobilePrimary: CSSColor,
            backgroundMobileSecondary: CSSColor,
            backgroundNegative: CSSColor,
            backgroundNegativeMedium: CSSColor,
            backgroundNegativeStrong: CSSColor,
            backgroundWarning: CSSColor,
            backgroundWarningMedium: CSSColor,
            backgroundWarningStrong: CSSColor,
            backgroundPositive: CSSColor,
            backgroundPositiveMedium: CSSColor,
            backgroundPositiveStrong: CSSColor,
            backgroundAccent: CSSColor,
            backgroundAccentMedium: CSSColor,
            backgroundAccentStrong: CSSColor,

            // Surface
            surfacePrimary: CSSColor,
            surfaceSecondary: CSSColor,
            surfaceTertiary: CSSColor,
            surfaceQuaternary: CSSColor,

            // Border
            borderSubtle: CSSColor,
            borderMedium: CSSColor,
            borderStrong: CSSColor,
            borderUltrastrong: CSSColor,

            // Button
            buttonFill: CSSColor,
            buttonFillHover: CSSColor,
            buttonFillDisabled: CSSColor,
            buttonFillHoverAlt: CSSColor,
            buttonFillHoverNegative: CSSColor,
            buttonBorder: CSSColor,
            buttonBorderDisabled: CSSColor,
            buttonBorderNegative: CSSColor,

            // Input
            inputFill: CSSColor,
            inputFillFocus: CSSColor,
            inputFillNegative: CSSColor,
            inputFillDisabled: CSSColor,
            inputBorderFocus: CSSColor,
            inputBorderNegative: CSSColor,

            // Overlay
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
            shallowRight: ShadowDefinition,
            glowSubtle1: ShadowDefinition,
            glowSubtle2: ShadowDefinition,
            glowSubtle3: ShadowDefinition,
            glowDeep1: ShadowDefinition,
            glowDeep2: ShadowDefinition,
            glowDeep3: ShadowDefinition,
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
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            lightGreyThin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            lightGreyRegular: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            lightGreyThick: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            darkGreyUltrathin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            darkGreyThin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            darkGreyRegular: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            darkGreyThick: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            greyUltrathin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            greyThin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            greyRegular: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            greyThick: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
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
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            secondaryThin: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            secondaryRegular: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
            },
            secondaryThick: {
                background: CSSColor,
                backgroundBlend: CSSColor
                mixBlendMode: Property.MixBlendMode,
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
                roundedMedium: CSSLength,
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
    },
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
        backgroundInverseWarning: CSSColor,
        backgroundInversePositive: CSSColor,

        // Background Overlays

        backgroundOverlayLight: CSSColor,
        backgroundOverlayXLight: CSSColor,
        backgroundOverlayGrey: CSSColor,
        backgroundOverlayDark: CSSColor,
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
    new: {
        tokens: T.new,
        utils: {
            defaultUserSelect: 'none',
        },
        colors: {
            // Content
            contentPrimary: T.new.colors.grey2400,
            contentSecondary: T.new.colors.grey1600,
            contentTertiary: T.new.colors.grey1400,
            contentDisabled: T.new.colors.grey1100,
            contentAccent: T.new.colors.teal400,
            contentNegative: T.new.colors.red400,
            contentWarning: T.new.colors.yellow500,
            contentPositive: T.new.colors.green400,
            contentLink: T.new.colors.blue500,

            // Content Inverse
            contentInversePrimary: T.new.colors.white,
            contentInverseSecondary: T.new.colors.grey600,
            contentInverseTertiary: T.new.colors.grey1000,
            contentInverseDisabled: T.new.colors.grey1400,

            // Background
            backgroundPrimary: T.new.colors.white,
            backgroundSecondary: T.new.colors.grey100,
            backgroundMobilePrimary: T.new.colors.white,
            backgroundMobileSecondary: T.new.colors.grey100,
            backgroundNegative: T.new.colors.red100,
            backgroundNegativeMedium: T.new.colors.red200,
            backgroundNegativeStrong: T.new.colors.red300,
            backgroundWarning: T.new.colors.yellow100,
            backgroundWarningMedium: T.new.colors.yellow200,
            backgroundWarningStrong: T.new.colors.yellow300,
            backgroundPositive: T.new.colors.green100,
            backgroundPositiveMedium: T.new.colors.green200,
            backgroundPositiveStrong: T.new.colors.green300,
            backgroundAccent: T.new.colors.teal100,
            backgroundAccentMedium: T.new.colors.teal200,
            backgroundAccentStrong: T.new.colors.teal300,

            // Surface
            surfacePrimary: T.new.colors.white,
            surfaceSecondary: T.new.colors.grey200,
            surfaceTertiary: T.new.colors.grey400,
            surfaceQuaternary: T.new.colors.grey100,

            // Border
            borderSubtle: T.new.colors.grey400,
            borderMedium: T.new.colors.grey600,
            borderStrong: T.new.colors.grey700,
            borderUltrastrong: T.new.colors.grey1400,

            // Button
            buttonFill: T.new.colors.grey2400,
            buttonFillHover: T.new.colors.grey1900,
            buttonFillDisabled: T.new.colors.grey500,
            buttonFillHoverAlt: T.new.colors.grey300,
            buttonFillHoverNegative: T.new.colors.red100,
            buttonBorder: T.new.colors.grey2400,
            buttonBorderDisabled: T.new.colors.grey1000,
            buttonBorderNegative: T.new.colors.red400,

            // Input
            inputFill: T.new.colors.grey300,
            inputFillFocus: T.new.colors.grey400,
            inputFillNegative: T.new.colors.red100,
            inputFillDisabled: T.new.colors.grey200,
            inputBorderFocus: T.new.colors.grey1400,
            inputBorderNegative: T.new.colors.red400,

            // Overlay
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
            ...Shadows,
            ...Glows,
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
                background: 'rgba(191, 191, 191, 0.44)',
                backgroundBlend: '#303030',
                mixBlendMode: 'color-dodge',
            },
            lightGreyThin: {
                background: 'rgba(166, 166, 166, 0.70)',
                backgroundBlend: '#3D3D3D',
                mixBlendMode: 'color-dodge',
            },
            lightGreyRegular: {
                background: 'rgba(179, 179, 179, 0.82)',
                backgroundBlend: '#434343',
                mixBlendMode: 'color-dodge',
            },
            lightGreyThick: {
                background: 'rgba(153, 153, 153, 0.97)',
                backgroundBlend: '#5F5F5F',
                mixBlendMode: 'color-dodge',
            },
            darkGreyUltrathin: {
                background: 'rgba(37, 37, 37, 0.55)',
                backgroundBlend: '#9C9C9C',
                mixBlendMode: 'overlay',
            },
            darkGreyThin: {
                background: 'rgba(37, 37, 37, 0.70)',
                backgroundBlend: '#9C9C9C',
                mixBlendMode: 'overlay',
            },
            darkGreyRegular: {
                background: 'rgba(37, 37, 37, 0.82)',
                backgroundBlend: '#8C8C8C',
                mixBlendMode: 'overlay',
            },
            darkGreyThick: {
                background: 'rgba(37, 37, 37, 0.90)',
                backgroundBlend: '#7C7C7C',
                mixBlendMode: 'overlay',
            },
            greyUltrathin: {
                background: 'rgba(37, 37, 37, 0.55)',
                backgroundBlend: '#D2D2D2',
                mixBlendMode: 'overlay',
            },
            greyThin: {
                background: 'rgba(37, 37, 37, 0.70)',
                backgroundBlend: '#CFCFCF',
                mixBlendMode: 'overlay',
            },
            greyRegular: {
                background: 'rgba(37, 37, 37, 0.82)',
                backgroundBlend: '#BCBCBC',
                mixBlendMode: 'overlay',
            },
            greyThick: {
                background: 'rgba(37, 37, 37, 0.90)',
                backgroundBlend: '#B6B6B6',
                mixBlendMode: 'overlay',
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
                background: 'rgba(191, 191, 191, 0.44)',
                backgroundBlend: '#303030',
                mixBlendMode: 'color-dodge',
            },
            secondaryThin: {
                background: 'rgba(166, 166, 166, 0.70)',
                backgroundBlend: '#3D3D3D',
                mixBlendMode: 'color-dodge',
            },
            secondaryRegular: {
                background: 'rgba(179, 179, 179, 0.82)',
                backgroundBlend: '#434343',
                mixBlendMode: 'color-dodge',
            },
            secondaryThick: {
                background: 'rgba(153, 153, 153, 0.97)',
                backgroundBlend: '#5F5F5F',
                mixBlendMode: 'color-dodge',
            },
        },
        borders: {
            radius: {
                pill: '1000px',
                circle: '100%',
                rectangle: '0px',
                rounded: '8px',
                roundedSmall: '4px',
                roundedMedium: '6px',
                roundedLarge: '12px',
                roundedXL: '16px',
            },

            dropdown: {
                shadow: Shadows.deepBelow,
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
    },
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
        backgroundInverseWarning: T.colors.yellow600,
        backgroundInversePositive: T.colors.green700,

        // Background Overlays

        backgroundOverlayLight: 'rgba(255, 255, 255, 0.07)',
        backgroundOverlayXLight: 'rgba(255, 255, 255, 0.1)',
        backgroundOverlayGrey: 'rgba(60, 60, 60, 0.65)',
        backgroundOverlayDark: 'rgba(0, 0, 0, 0.1)',
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
            roundedXL: '16px',
        },

        dropdown: {
            shadow: Shadows.deepBelow,
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
    new: {
        colors: {
            // Content
            contentPrimary: T.new.colors.grey200,
            contentSecondary: T.new.colors.grey800,
            contentTertiary: T.new.colors.grey1000,
            contentDisabled: T.new.colors.grey1300,
            contentLink: T.new.colors.blue400,

            contentInversePrimary: T.new.colors.grey2400,
            contentInverseSecondary: T.new.colors.grey1600,
            contentInverseTertiary: T.new.colors.grey1400,
            contentInverseDisabled: T.new.colors.grey1000,

            // Background
            backgroundPrimary: T.new.colors.grey2400,
            backgroundSecondary: T.new.colors.grey2200,
            backgroundMobilePrimary: T.new.colors.black,
            backgroundMobileSecondary: T.new.colors.grey2300,
            backgroundNegative: T.new.colors.red800,
            backgroundNegativeMedium: T.new.colors.red700,
            backgroundNegativeStrong: T.new.colors.red600,
            backgroundWarning: T.new.colors.yellow800,
            backgroundWarningMedium: T.new.colors.yellow700,
            backgroundWarningStrong: T.new.colors.yellow600,
            backgroundPositive: T.new.colors.green800,
            backgroundPositiveMedium: T.new.colors.green700,
            backgroundPositiveStrong: T.new.colors.green600,
            backgroundAccent: T.new.colors.teal800,
            backgroundAccentMedium: T.new.colors.teal700,
            backgroundAccentStrong: T.new.colors.teal600,

            // Surface
            surfacePrimary: T.new.colors.grey2000,
            surfaceSecondary: T.new.colors.grey2100,
            surfaceTertiary: T.new.colors.grey2200,
            surfaceQuaternary: T.new.colors.grey1900,

            // Border
            borderSubtle: T.new.colors.grey2000,
            borderMedium: T.new.colors.grey1700,
            borderStrong: T.new.colors.grey1600,
            borderUltrastrong: T.new.colors.grey900,

            // Button
            buttonFill: T.new.colors.grey200,
            buttonFillHover: T.new.colors.grey400,
            buttonFillDisabled: T.new.colors.grey1700,
            buttonFillHoverAlt: T.new.colors.grey2000,
            buttonFillHoverNegative: T.new.colors.red800,
            buttonBorder: T.new.colors.grey100,
            buttonBorderDisabled: T.new.colors.grey1400,
            buttonBorderNegative: T.new.colors.red400,

            // Input
            inputFill: T.new.colors.grey2200,
            inputFillFocus: T.new.colors.grey2300,
            inputFillNegative: T.new.colors.red800,
            inputFillDisabled: T.new.colors.grey2100,
            inputBorderFocus: T.new.colors.grey900,

            // Overlay
            overlaySubtle: 'rgba(255, 255, 255, 0.03)',
            overlayMedium: 'rgba(255, 255, 255, 0.07)',
            overlayStrong: 'rgba(255, 255, 255, 0.09)',
            overlayInverseSubtle: 'rgba(0, 0, 0, 0.02)',
            overlayInverseMedium: 'rgba(0, 0, 0, 0.05)',
            overlayWhiteUltrastrong: 'rgba(0, 0, 0, 0.18)',
            overlayBlackSubtle: 'rgba(0, 0, 0, 0.2)',
            overlayBlackMedium: 'rgba(0, 0, 0, 0.3)',
            overlayBlackStrong: 'rgba(0, 0, 0, 0.4)',
            overlayPageBackground: 'rgba(18, 18, 18, 0.75)',
        },
        lighting: {
            ...ShadowsDark,
            ...GlowsDark,
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
                background: 'rgba(37, 37, 37, 0.55)',
                backgroundBlend: '#9C9C9C',
                mixBlendMode: 'overlay',
            },
            secondaryThin: {
                background: 'rgba(37, 37, 37, 0.70)',
                backgroundBlend: '#9C9C9C',
                mixBlendMode: 'overlay',
            },
            secondaryRegular: {
                background: 'rgba(37, 37, 37, 0.82)',
                backgroundBlend: '#8C8C8C',
                mixBlendMode: 'overlay',
            },
            secondaryThick: {
                background: 'rgba(37, 37, 37, 0.90)',
                backgroundBlend: '#7C7C7C',
                mixBlendMode: 'overlay',
            },
        },
        borders: {
            dropdown: {
                shadow: ShadowsDark.deepBelow,
                color: 'transparent',
                border: 'none',
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
    },
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
        backgroundWarning: LightTheme.colors.backgroundInverseWarning,
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
        backgroundInverseWarning: LightTheme.colors.backgroundWarning,
        backgroundInversePositive: LightTheme.colors.backgroundPositive,
        borderInverseOpaque: LightTheme.colors.borderOpaque,
        borderInverseSelected: LightTheme.colors.borderSelected,
    },
    borders: {
        dropdown: {
            shadow: 'none',
            color: T.colors.grey600,
            border: `1px solid ${T.colors.grey600}`,
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
