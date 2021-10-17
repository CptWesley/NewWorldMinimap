import { globalLayers } from '@/globalLayers';
import { makeStyles } from '@/theme';

export const useAppSettingsStyles = makeStyles()(theme => ({
    root: {
        display: 'grid',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
        gridTemplateRows: '30px 1fr auto',
        gridTemplateColumns: '180px 1fr 30px',
        gridTemplateAreas: '"title title return" "nav content content" "footer footer footer"',

        background: theme.frameMenuBackground,
        color: theme.frameMenuColor,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.frameMenu,
        backdropFilter: 'blur(10px)',
        transition: 'backdrop-filter 300ms ease, background 300ms ease',
    },
    belowHeader: {
        marginTop: theme.headerHeight,
    },
    hidden: {
        display: 'none !important',
    },
    peek: {
        background: theme.frameMenuBackgroundPeek,
        backdropFilter: 'none',
    },
    return: {
        background: 'transparent',
        border: 'none',
        color: theme.frameMenuColor,
        padding: 0,

        '&:focus': {
            outline: `1px solid ${theme.frameMenuColor}`,
        },
    },
    nav: {
        gridArea: 'nav',
        display: 'flex',
        margin: theme.spacing(0, -1),
        flexDirection: 'column',
        overflowY: 'auto',

        '&::-webkit-scrollbar': {
            width: '10px',
        },

        '&::-webkit-scrollbar-thumb': {
            background: theme.scrollbarColor,
        },
    },
    navItem: {
        padding: theme.spacing(1),
        border: 'none',
        borderLeft: '8px solid transparent',
        background: 'none',
        color: theme.frameMenuColor,
        fontFamily: theme.bodyFontFamily,
        fontSize: theme.bodyFontSize,
        textAlign: 'left',

        '&:hover': {
            background: theme.buttonBackgroundHover,
        },

        '&:focus': {
            outline: 'none',
        },
    },
    navItemActive: {
        borderLeftColor: theme.frameMenuColor,
    },
    selectIcon: {
        background: 'transparent',
        border: 'none',
        color: theme.frameMenuColor,
        padding: 0,
        width: 18,
        height: 18,

        '&:focus': {
            outline: `1px solid ${theme.frameMenuColor}`,
        },
    },
    title: {
        gridArea: 'title',
        alignSelf: 'center',
        fontSize: 18,
    },
    content: {
        gridArea: 'content',
        overflowY: 'auto',
        maxHeight: '100%',
        padding: theme.spacing(0, 1, 1, 1),

        '&::-webkit-scrollbar': {
            width: '10px',
        },

        '&::-webkit-scrollbar-thumb': {
            background: theme.scrollbarColor,
        },

        '& > details:not(:last-child)': {
            marginBottom: theme.spacing(1),
        },

        '& > details > summary': {
            fontSize: 16,
        },
    },
    footer: {
        gridArea: 'footer',
    },
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
        },
    },
    summary: {
        outline: 'none',
        borderRadius: 3,
        padding: 2,

        '&:focus': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.15)',
        },

        '&:hover': {
            outline: 'none',
            background: 'rgba(255, 255, 255, 0.33)',
        },
    },
    iconCategory: {
        display: 'flex',
        alignItems: 'center',

        '& > span': {
            flexGrow: 1,
        },
    },
    indent: {
        marginLeft: 19,
    },
    iconTypeContainer: {
        margin: theme.spacing(0, 0, 1, 3),
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
}));
