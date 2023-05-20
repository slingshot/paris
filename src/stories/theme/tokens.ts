export const Colors = {
    black: '#060606',
    white: '#ffffff',
    teal: '#1deecd',
    orange: '#ff9426',
    pink: '#fb46be',
    red: '#fd4d2e',
    yellow: '#ffc043',
    green: '#08c94e',

    grey1050: '#121212',
    grey1000: '#171717',
    grey950: '#1f1f1f',
    grey900: '#252525',
    grey800: '#2e2e2e',
    grey750: '#3c3c3c',
    grey700: '#4a4a4a',
    grey600: '#545454',
    grey500: '#757575',
    grey400: '#afafaf',
    grey300: '#c9c9c9',
    grey200: '#e2e2e2',
    grey100: '#eeeeee',
    grey50: '#f6f6f6',

    teal600: '#18b199',
    teal500: '#1ad4b6',
    teal400: '#1deecd',
    teal300: '#8ef7e6',
    teal200: '#d9fcf7',
    teal100: '#ecfefb',

    red700: '#331611',
    red600: '#541a0f',
    red500: '#a9331f',
    red400: '#fd4d2e',
    red300: '#fea697',
    red200: '#ffe1dc',
    red100: '#fff0ee',

    yellow600: '#554016',
    yellow500: '#aa802d',
    yellow450: '#eba417',
    yellow400: '#ffc043',
    yellow300: '#ffe0a1',
    yellow200: '#fff5e0',
    yellow100: '#fff8e8',

    green700: '#063717',
    green600: '#0a4820',
    green500: '#148f41',
    green400: '#08c94e',
    green300: '#8febb0',
    green200: '#daf8e5',
    green100: '#edfcf2',

    gradientTeal: 'linear-gradient(95.14deg, #26EDED 0%, #14EFAC 100%)',
    gradientOrange: 'linear-gradient(95.14deg, #FF814A 0%, #FFA800 100%)',
    gradientPink: 'linear-gradient(90deg, #FF4BED 0%, #F7418D 100%)',
} as const;

export type TokensT = {
    colors: typeof Colors,
};

export const Tokens: TokensT = {
    colors: Colors,
};
