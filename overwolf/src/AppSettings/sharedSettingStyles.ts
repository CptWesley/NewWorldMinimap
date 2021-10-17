import { makeStyles } from '@/theme';

/**
 * Contains generic styles for elements on the settings page.
 */
export const useSharedSettingsStyles = makeStyles()(theme => ({
    setting: {
        marginBottom: theme.spacing(1),
    },
    checkbox: {
        '& > input[type="checkbox"]': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
    range: {
        '& > input[type="range"]': {
            margin: theme.spacing(0, 1, 0, 0),
        },
    },
    select: {
        '& > select': {
            margin: theme.spacing(0, 1, 0, 0),
            fontFamily: theme.bodyFontFamily,
            fontSize: typeof theme.bodyFontSize === 'number'
                ? theme.bodyFontSize - 1
                : `calc(${theme.bodyFontSize} - 1px)`,
            padding: '2px 4px',
        },
    },
}));
