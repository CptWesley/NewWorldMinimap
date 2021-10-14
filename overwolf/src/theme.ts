import { createMakeStyles } from 'tss-react';

export const theme = {
    background: '#333333',
    color: '#ffffff',
    linkColor: '#a8ceff',

    bodyFontFamily: 'Lato',
    bodyFontSize: 16,

    headerBackground: '#222222',
    headerColor: '#eeeeee',
    headerButtonHover: '#444444',
    headerButtonPress: '#666666',
    headerCloseHover: '#ff5a35',
    headerClosePress: '#d62700',

    frameMenuBackground: 'rgba(51, 51, 51, 0.75)',
    frameMenuColor: '#ffffff',

    toolbarBackground: '#333333',
    toolbarColor: '#ffffff',
    toolbarBackdropFilter: 'blur(5px)',
    toolbarTransparentBackground: 'rgba(51, 51, 51, 0.67)',

    buttonColor: '#ffffff',
    buttonBackground: 'transparent',
    buttonBackgroundHover: 'rgba(255, 255, 255, 0.25)',
    buttonBackgroundPress: 'rgba(255, 255, 255, 0.33)',
    buttonBorderColor: 'rgba(255, 255, 255, 0.75)',
    buttonBorderColorHover: '#ffffff',
    buttonBorderColorPress: '#ffffff',

    scrollbarColor: '#ffffff',

    spacing: (...spacings: number[]) => spacings.map(s => `${s * 10}px`).join(' '),
} as const;

function useTheme() {
    return theme;
}

export const makeStyles = createMakeStyles({
    useTheme,
}).makeStyles;
