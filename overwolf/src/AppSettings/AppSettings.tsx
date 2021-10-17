import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { AppContext, AppContextSettings, IAppContext } from '@/contexts/AppContext';
import { globalLayers } from '@/globalLayers';
import CloseOIcon from '@/Icons/CloseOIcon';
import { SimpleStorageSetting, store } from '@/logic/storage';
import { makeStyles } from '@/theme';
import IconSettingsPage from './pages/IconSettingsPage';
import OverlaySettingsPage from './pages/OverlaySettingsPage';
import WindowSettingsPage from './pages/WindowSettingsPage';
import FeatureCollectionPage from './pages/FeatureCollectionPage';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

export interface IAppSettingsPageProps {
    settings: AppContextSettings;
    updateSimpleSetting: <TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) => void;
    updateSettings: IAppContext['update']
    setPeek: (peek: boolean) => void;
}

const useStyles = makeStyles()(theme => ({
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
    close: {
        background: 'transparent',
        border: 'none',
        borderRadius: '50%',
        color: theme.frameMenuColor,
        padding: 0,

        '&:hover': {
            background: theme.buttonBackgroundHover,
        },

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
            textDecoration: 'underline',
        },
    },
    navItemActive: {
        borderLeftColor: theme.frameMenuColor,
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
}));

const settingsPageMap = {
    window: WindowSettingsPage,
    overlay: OverlaySettingsPage,
    icon: IconSettingsPage,
    featureCollection: FeatureCollectionPage,
} as const;

const settingsPages: (keyof typeof settingsPageMap)[] = [
    'window',
    'overlay',
    'icon',
    'featureCollection',
];

const settingsPageNames: Record<keyof typeof settingsPageMap, string> = {
    icon: 'Icons',
    overlay: 'In-game overlay',
    window: 'This window',
    // TODO: Rename to something meaningful to regular folks.
    featureCollection: 'Render GeoJSON',
};

export default function AppSettings(props: IProps) {
    const {
        onClose,
        visible,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    const [currentPage, setCurrentPage] = useState(settingsPages[0]);
    const [isPeeking, setIsPeeking] = useState(false);

    function updateSimpleSetting<TKey extends keyof SimpleStorageSetting>(key: TKey, value: SimpleStorageSetting[TKey]) {
        store(key, value);
        context.update({ [key]: value });
    }

    const rootClassName = clsx(
        classes.root,
        !visible && classes.hidden,
        context.settings.showHeader && classes.belowHeader,
        isPeeking && context.gameRunning && classes.peek);

    const pageProps: IAppSettingsPageProps = {
        settings: context.settings,
        updateSimpleSetting,
        updateSettings: context.update,
        setPeek: setIsPeeking,
    };

    const PageComponent = settingsPageMap[currentPage];

    return <div className={rootClassName}>
        <button className={classes.close} onClick={onClose}>
            <CloseOIcon />
        </button>
        <h2 className={classes.title}>Options</h2>
        <nav className={classes.nav}>
            {settingsPages.map(p =>
                <button
                    key={p}
                    className={clsx(classes.navItem, p === currentPage && classes.navItemActive)}
                    onClick={() => setCurrentPage(p)}
                >
                    {settingsPageNames[p]}
                </button>
            )}
        </nav>
        <div className={classes.content}>
            <PageComponent {...pageProps} />
        </div>
        <footer className={classes.footer}>
            Open this menu at any time by right-clicking.
        </footer>
    </div>;
}
