import '@fontsource/lato/400.css';
import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';
import { GlobalStyles } from 'tss-react';
import App from './App';
import { AppContext, defaultAppContext, IAppContext, IAppContextData, MinimapWindowType } from './contexts/AppContext';
import FrameMenu from './FrameMenu';
import { getBackgroundController } from './OverwolfWindows/background/background';
import { makeStyles, theme } from './theme';

interface IProps {
    header: React.ReactNode;
    minimapWindowType: MinimapWindowType;
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
        minimapWindowType,
    } = props;
    const { classes } = useStyles();

    const [frameMenuVisible, setFrameMenuVisible] = useState(false);
    const [appContextState, setAppContextState] = useState<IAppContextData>(defaultAppContext.value);
    const [gameRunning, setGameRunning] = useState(backgroundController.gameRunning);

    const updateAppContext = useCallback((e: Partial<IAppContextData>) => setAppContextState(prev => ({ ...prev, ...e })), []);
    const toggleFrameMenu = useCallback(() => setFrameMenuVisible(prev => !prev), []);

    useEffect(() => {
        const gameRunningListenRegistration = backgroundController.listenOnGameRunningChange(setGameRunning);
        return () => {
            gameRunningListenRegistration();
        };
    }, []);

    const appContextValue: IAppContext = {
        update: updateAppContext,
        value: appContextState,
        toggleFrameMenu,
        gameRunning,
        isTransparentSurface,
        minimapWindowType,
        frameMenuVisible,
    };

    function handleContext(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        toggleFrameMenu();
    }

    const dynamicStyling: React.CSSProperties = {};
    if (isTransparentSurface) {
        dynamicStyling.opacity = appContextState.opacity;
    }

    return (
        <AppContext.Provider value={appContextValue}>
            <GlobalStyles
                styles={{
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
                <FrameMenu
                    visible={frameMenuVisible}
                    onClose={() => setFrameMenuVisible(false)}
                />
                {header}
                <App />
            </div>
        </AppContext.Provider>
    );
}
