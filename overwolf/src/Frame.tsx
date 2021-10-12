import '@fontsource/lato/400.css';
import React, { useCallback, useState } from 'react';
import { GlobalStyles } from 'tss-react';
import { AppContext, defaultAppContext, IAppContext, IAppContextData } from './contexts/AppContext';
import FrameMenu from './FrameMenu';
import { makeStyles } from './theme';

interface IProps {
    header: React.ReactNode;
    content: React.ReactNode;
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
}));

export default function Frame(props: IProps) {
    const {
        header,
        content,
    } = props;
    const { classes } = useStyles();

    const [frameMenuVisible, setFrameMenuVisible] = useState(false);
    const [appContextState, setAppContextState] = useState<IAppContextData>(defaultAppContext.value);

    const updateAppContext = useCallback((e: Partial<IAppContextData>) => setAppContextState(prev => ({ ...prev, ...e })), []);

    const appContextValue: IAppContext = {
        update: updateAppContext,
        value: appContextState,
    };

    function handleContext(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        setFrameMenuVisible(!frameMenuVisible);
    }

    return (
        <AppContext.Provider value={appContextValue}>
            <GlobalStyles
                styles={{
                    body: {
                        fontFamily: 'Lato, sans-serif',
                        fontSize: 16,
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
                }}
            />
            <div className={classes.root} onContextMenuCapture={handleContext}>
                <FrameMenu
                    visible={frameMenuVisible}
                    onClose={() => setFrameMenuVisible(false)}
                />
                {header}
                {content}
            </div>
        </AppContext.Provider>
    );
}
