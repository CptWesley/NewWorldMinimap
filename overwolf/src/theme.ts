import { createMakeStyles } from 'tss-react';

export const theme = {
    background: '#333333',
    color: '#ffffff',

    headerBackground: '#222222',
    headerColor: '#eeeeee',
    headerButtonHover: '#444444',
    headerButtonPress: '#666666',
    headerCloseHover: '#ff5a35',
    headerClosePress: '#d62700',

    frameMenuBackground: 'rgba(51, 51, 51, 0.75)',
    frameMenuColor: '#ffffff',

    spacing: (...spacings: number[]) => spacings.map(s => `${s * 10}px`).join(' '),
} as const;

function useTheme() {
    return theme;
}

export const makeStyles = createMakeStyles({
    useTheme,
}).makeStyles;
