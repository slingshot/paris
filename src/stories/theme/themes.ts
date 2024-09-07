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

const Shadows = {
    shallowAbove: '0px -4px 20px 0px rgba(0, 0, 0, 0.2)',
    deepAbove: '0px -8px 20px 0px rgba(0, 0, 0, 0.2)',
    shallowBelow: '0px 4px 20px 0px rgba(0, 0, 0, 0.2)',
    deepBelow: '0px 8px 20px 0px rgba(0, 0, 0, 0.2)',
    shallowLeft: '-20px 0px 40px 0px rgba(0, 0, 0, 0.1)',
    shallowRight: '20px 0px 40px 0px rgba(0, 0, 0, 0.1)',
    subtlePopup: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    shallowPopup: '0px 0px 30px 0px rgba(0, 0, 0, 0.2)',
    deepPopup: '0px 0px 40px 0px rgba(0, 0, 0, 0.2)',
} as const;

const ShadowsDark = {
    deepBelow: '0px 20px 30px 10px rgba(0, 0, 0, 0.5)',
    shallowLeft: '-20px 0px 60px 20px rgba(0, 0, 0, 0.25)',
    shallowRight: '20px 0px 60px 20px rgba(0, 0, 0, 0.25)',
    deepPopup: '0px 0px 40px 15px rgba(0, 0, 0, 0.35)',
} as const;

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
        tokens: TokensT,
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
        tokens: T,
        utils: {
            defaultUserSelect: 'none',
        },
        colors: {
            // Content
            contentPrimary: T.colors.new.grey2400,
            contentSecondary: T.colors.new.grey1600,
            contentTertiary: T.colors.new.grey1400,
            contentDisabled: T.colors.new.grey1100,
            contentAccent: T.colors.new.teal400,
            contentNegative: T.colors.new.red400,
            contentWarning: T.colors.new.yellow500,
            contentPositive: T.colors.new.green400,

            // Content Inverse
            contentInversePrimary: T.colors.new.white,
            contentInverseSecondary: T.colors.new.grey600,
            contentInverseTertiary: T.colors.new.grey1000,
            contentInverseDisabled: T.colors.new.grey1400,

            // Background
            backgroundPrimary: T.colors.new.white,
            backgroundSecondary: T.colors.new.grey100,
            backgroundMobilePrimary: T.colors.new.white,
            backgroundMobileSecondary: T.colors.new.grey100,
            backgroundNegative: T.colors.new.red100,
            backgroundNegativeMedium: T.colors.new.red200,
            backgroundNegativeStrong: T.colors.new.red300,
            backgroundWarning: T.colors.new.yellow100,
            backgroundWarningMedium: T.colors.new.yellow200,
            backgroundWarningStrong: T.colors.new.yellow300,
            backgroundPositive: T.colors.new.green100,
            backgroundPositiveMedium: T.colors.new.green200,
            backgroundPositiveStrong: T.colors.new.green300,
            backgroundAccent: T.colors.new.teal100,
            backgroundAccentMedium: T.colors.new.teal200,
            backgroundAccentStrong: T.colors.new.teal300,

            // Surface
            surfacePrimary: T.colors.new.white,
            surfaceSecondary: T.colors.new.grey200,
            surfaceTertiary: T.colors.new.grey400,
            surfaceQuaternary: T.colors.new.grey100,

            // Border
            borderSubtle: T.colors.new.grey400,
            borderMedium: T.colors.new.grey600,
            borderStrong: T.colors.new.grey700,
            borderUltrastrong: T.colors.new.grey1400,

            // Button
            buttonFill: T.colors.new.grey2400,
            buttonFillHover: T.colors.new.grey1900,
            buttonFillDisabled: T.colors.new.grey500,
            buttonFillHoverAlt: T.colors.new.grey300,
            buttonFillHoverNegative: T.colors.new.red100,
            buttonBorder: T.colors.new.grey2400,
            buttonBorderDisabled: T.colors.new.grey1000,
            buttonBorderNegative: T.colors.new.red400,

            // Input
            inputFill: T.colors.new.grey300,
            inputFillFocus: T.colors.new.grey400,
            inputFillNegative: T.colors.new.red100,
            inputFillDisabled: T.colors.new.grey200,
            inputBorderFocus: T.colors.new.grey1400,
            inputBorderNegative: T.colors.new.red400,

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
            contentPrimary: T.colors.new.grey200,
            contentSecondary: T.colors.new.grey800,
            contentTertiary: T.colors.new.grey1000,
            contentDisabled: T.colors.new.grey1300,

            contentInversePrimary: T.colors.new.grey2400,
            contentInverseSecondary: T.colors.new.grey1600,
            contentInverseTertiary: T.colors.new.grey1400,
            contentInverseDisabled: T.colors.new.grey1000,

            // Background
            backgroundPrimary: T.colors.new.grey2400,
            backgroundSecondary: T.colors.new.grey2200,
            backgroundMobilePrimary: T.colors.new.black,
            backgroundMobileSecondary: T.colors.new.grey2300,
            backgroundNegative: T.colors.new.red800,
            backgroundNegativeMedium: T.colors.new.red700,
            backgroundNegativeStrong: T.colors.new.red600,
            backgroundWarning: T.colors.new.yellow800,
            backgroundWarningMedium: T.colors.new.yellow700,
            backgroundWarningStrong: T.colors.new.yellow600,
            backgroundPositive: T.colors.new.green800,
            backgroundPositiveMedium: T.colors.new.green700,
            backgroundPositiveStrong: T.colors.new.green600,
            backgroundAccent: T.colors.new.teal800,
            backgroundAccentMedium: T.colors.new.teal700,
            backgroundAccentStrong: T.colors.new.teal600,

            // Surface
            surfacePrimary: T.colors.new.grey2000,
            surfaceSecondary: T.colors.new.grey2100,
            surfaceTertiary: T.colors.new.grey2200,
            surfaceQuaternary: T.colors.new.grey1900,

            // Border
            borderSubtle: T.colors.new.grey2000,
            borderMedium: T.colors.new.grey1700,
            borderStrong: T.colors.new.grey1600,
            borderUltrastrong: T.colors.new.grey900,

            // Button
            buttonFill: T.colors.new.grey200,
            buttonFillHover: T.colors.new.grey400,
            buttonFillDisabled: T.colors.new.grey1700,
            buttonFillHoverAlt: T.colors.new.grey2000,
            buttonFillHoverNegative: T.colors.new.red800,
            buttonBorder: T.colors.new.grey100,
            buttonBorderDisabled: T.colors.new.grey1400,
            buttonBorderNegative: T.colors.new.red400,

            // Input
            inputFill: T.colors.new.grey2200,
            inputFillFocus: T.colors.new.grey2300,
            inputFillNegative: T.colors.new.red800,
            inputFillDisabled: T.colors.new.grey2100,
            inputBorderFocus: T.colors.new.grey900,

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
        },
        lighting: {
            ...ShadowsDark,
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
                color: T.colors.new.grey1600,
                border: `1px solid ${T.colors.new.grey1600}`,
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
