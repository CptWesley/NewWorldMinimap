import '@/style/lato-fonts.css';
import clsx from 'clsx';
import produce from 'immer';
import React, { useCallback, useEffect, useState } from 'react';
import { GlobalStyles } from 'tss-react';
import App from './App';
import AppSettings from './AppSettings/AppSettings';
import { AppContext, AppContextSettings, IAppContext, loadAppContextSettings } from './contexts/AppContext';
import { deconstructIconStorageKey, getStorageKeyScope, load, loadIconConfiguration, scopedSettings, simpleStorageDefaultSettings, SimpleStorageSetting } from './logic/storage';
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

    const updateAppContext = useCallback((e: Partial<AppContextSettings>) => setAppContextSettings(prev => ({ ...prev, ...e })), []);
    const toggleFrameMenu = useCallback(() => setAppSettingsVisible(prev => !prev), []);

    useEffect(() => {
        function handleStorageEvent(e: StorageEvent) {
            if (!e.key || !e.newValue) { return; }

            const [keyScope, identifier] = getStorageKeyScope(e.key);
            if (keyScope === NWMM_APP_WINDOW && scopedSettings.includes(identifier as keyof SimpleStorageSetting)) {
                // The setting is scoped to the current window, and is listed as a scoped setting
                updateAppContext({ [identifier as keyof SimpleStorageSetting]: load(identifier as keyof SimpleStorageSetting) });
            } else if (keyScope === 'icon') {
                // It is an icon setting. First, determine if it's just a category, or a category and an icon
                const iconSetting = deconstructIconStorageKey(identifier);
                if (iconSetting) {
                    const { category, type, property } = iconSetting;
                    if (type) {
                        // It is a category and type. If the iconSettings are loaded, and the category and type exist,
                        // produce a new iconSettings with the category.types.type value set to the new setting value.
                        setAppContextSettings(prev => produce(prev, draft => {
                            const setting = draft.iconSettings?.categories[category]?.types[type];
                            if (setting) {
                                setting[property] = loadIconConfiguration(category, type, property);
                            }
                        }));
                    } else {
                        // It is just a category. If the iconSettings are loaded, and the category exists, produce a new iconSettings
                        // with the category value set to the new setting value.
                        setAppContextSettings(prev => produce(prev, draft => {
                            const setting = draft.iconSettings?.categories[category];
                            if (setting) {
                                setting[property] = loadIconConfiguration(category, type, property);
                            }
                        }));
                    }
                }
            } else if (keyScope === undefined && simpleStorageDefaultSettings.hasOwnProperty(identifier) && !scopedSettings.includes(identifier as keyof SimpleStorageSetting)) {
                // The setting is not scoped to the current window, and exists, but is not listed as a scoped setting.
                updateAppContext({ [identifier as keyof SimpleStorageSetting]: load(identifier as keyof SimpleStorageSetting) });
            }
        }

        window.addEventListener('storage', handleStorageEvent);

        const gameRunningListenRegistration = backgroundController.listenOnGameRunningChange(setGameRunning, window);

        return () => {
            window.removeEventListener('storage', handleStorageEvent);
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
                <App />
            </div>
        </AppContext.Provider>
    );
}
