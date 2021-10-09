import { createMakeStyles } from 'tss-react';

export const theme = {
    background: '#333333',
    color: '#ffffff',

    headerBackground: '#555555',
    headerColor: '#eeeeee',
    headerButtonHover: '#777777',
    headerButtonPress: '#444444',
    headerCloseHover: '#ff5a35',
    headerClosePress: '#d62700',

    spacing: (...spacings: number[]) => spacings.map(s => `${s * 10}px`).join(' '),
} as const;

function useTheme() {
    return theme;
}

export const makeStyles = createMakeStyles({
    useTheme,
}).makeStyles;
