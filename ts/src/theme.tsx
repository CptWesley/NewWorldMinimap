import { createMakeStyles } from 'tss-react';

export const theme = {
    background: '#333333',
} as const;

function useTheme() {
    return theme;
}

export const makeStyles = createMakeStyles({
    useTheme,
}).makeStyles;
