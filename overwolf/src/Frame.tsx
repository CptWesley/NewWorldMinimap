import '@/style/lato-fonts.css';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { GlobalStyles } from 'tss-react';
import App from './App';
import AppSettings from './AppSettings/AppSettings';
import { AppContext, AppContextSettings, IAppContext, loadAppContextSettings } from './contexts/AppContext';
import InAppNotices from './InAppNotices';
import { getBackgroundController } from './OverwolfWindows/background/background';
import { makeStyles, theme } from './theme';

interface IProps {
    header: React.ReactNode;
    isTransparentSurface?: boolean;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',

        background: theme.background,
        color: theme.color,

        '& > :last-child': {
            flexGrow: 1,
        },
    },
    transparent: {
        background: 'transparent',
    },
}));

const backgroundController = getBackgroundController();

export default function Frame(props: IProps) {
    const {
        header,
        isTransparentSurface,
    } = props;
    const { classes } = useStyles();

    const [appSettingsVisible, setAppSettingsVisible] = useState(false);
    const [appContextSettings, setAppContextSettings] = useState<AppContextSettings>(loadAppContextSettings);
    const [gameRunning, setGameRunning] = useState(backgroundController.gameRunning);

    const updateAppContext = useCallback((e: React.SetStateAction<Partial<AppContextSettings>>) => {
        if (typeof e === 'function') {
            setAppContextSettings(prev => ({ ...prev, ...e(prev) }));
        } else {
            setAppContextSettings(prev => ({ ...prev, ...e }));
        }
    }, []);
    const toggleFrameMenu = useCallback(() => setAppSettingsVisible(prev => !prev), []);

    useEffect(() => {
        const gameRunningListenRegistration = backgroundController.listenOnGameRunningChange(setGameRunning, window);

        return () => {
            gameRunningListenRegistration();
        };
    }, []);

    const appContextValue: IAppContext = {
        update: updateAppContext,
        settings: appContextSettings,
        toggleFrameMenu,
        gameRunning,
        isTransparentSurface,
        appSettingsVisible,
    };

    function handleContext(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        toggleFrameMenu();
    }

    const dynamicStyling: React.CSSProperties = {};
    if (isTransparentSurface) {
        const opacity = appContextSettings.opacity;
        if (opacity < 0.95) {
            dynamicStyling.opacity = opacity;
        }
    }

    return (
        <AppContext.Provider value={appContextValue}>
            <GlobalStyles
                styles={{
                    '* ': {
                        boxSizing: 'border-box',
                    },
                    body: {
                        fontFamily: theme.bodyFontFamily,
                        fontSize: theme.bodyFontSize,
                        margin: 0,
                        userSelect: 'none',
                        height: '100vh',
                    },
                    '#app': {
                        height: '100%',
                    },
                    'p, h1, h2, h3, h4, h5, h6': {
                        margin: 0,
                    },
                    hr: {
                        width: '100%',
                        border: 'none',
                        borderTop: '1px solid',
                    },
                }}
            />
            <div
                className={clsx(classes.root, isTransparentSurface && classes.transparent)}
                onContextMenuCapture={handleContext}
                style={dynamicStyling}
            >
                <AppSettings
                    visible={appSettingsVisible}
                    onClose={() => setAppSettingsVisible(false)}
                />
                {header}
                <InAppNotices />
                <App />
            </div>
        </AppContext.Provider>
    );
}
