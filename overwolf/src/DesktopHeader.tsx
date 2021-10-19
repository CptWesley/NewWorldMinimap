import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import CloseIcon from './Icons/CloseIcon';
import DesktopWindowIcon from './Icons/DesktopWindowIcon';
import MaximizeIcon from './Icons/MaximizeIcon';
import Minimizeicon from './Icons/MinimizeIcon';
import RestoreIcon from './Icons/RestoreIcon';
import SettingsIcon from './Icons/SettingsIcon';
import { getBackgroundController } from './OverwolfWindows/background/background';
import { windowNames } from './OverwolfWindows/consts';
import { desktopAppTitle } from './OverwolfWindows/desktop/desktop';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',

        background: theme.headerBackground,
        color: theme.headerColor,
        height: theme.headerHeight,
        flexShrink: 0,
        overflow: 'hidden',
        zIndex: globalLayers.header,
    },
    transparent: {
        background: 'transparent !important',
    },
    hidden: {
        display: 'none !important',
    },
    draggable: {
        flexGrow: 1,

        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
    },
    controlButton: {
        width: 42,
        background: 'transparent',
        border: 'none',
        color: '#fff',

        outline: 'none',

        '&:hover': {
            background: theme.headerButtonHover,
        },

        '&:active': {
            background: theme.headerButtonPress,
        },

        '&:focus': {
            outline: 'none',
        },

        '& > svg': {
            width: 30,
            height: 30,
        },
    },
    close: {
        '&:hover': {
            background: theme.headerCloseHover,
        },
        '&:active': {
            background: theme.headerClosePress,
        },
    },
}));

const backgroundController = getBackgroundController();
export default function DesktopHeader() {
    const context = useContext(AppContext);
    const { classes } = useStyles();
    const { t } = useTranslation();

    const [desktopWindow] = useState(() => {
        return new OWWindow(windowNames.desktop);
    });

    const draggable = useRef<HTMLDivElement | null>(null);
    const [maximized, setMaximized] = useState(false);

    const useTransparency = context.settings.transparentHeader && context.gameRunning && !context.appSettingsVisible;

    useEffect(() => {
        if (draggable.current) {
            desktopWindow.dragMove(draggable.current);
        }
    }, [draggable.current]);

    useEffect(() => {
        async function handleResize() {
            const windowState = await desktopWindow.getWindowState();
            setMaximized(windowState.window_state === 'maximized');
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function handleShowInGameWindow() {
        backgroundController.openWindow('inGame');
    }

    function handleMinimize() {
        desktopWindow.minimize();
    }

    function handleMaximizeRestore() {
        if (maximized) {
            desktopWindow.restore();
        } else {
            desktopWindow.maximize();
        }
        setMaximized(!maximized);
    }

    function handleClose() {
        backgroundController.closeWindow('desktop');
    }

    return <header className={clsx(classes.root, useTransparency && classes.transparent, !context.settings.showHeader && classes.hidden)}>
        <div ref={draggable} className={classes.draggable} onDoubleClick={handleMaximizeRestore}>
            <span>{desktopAppTitle}</span>
        </div>
        {context.gameRunning && <button className={clsx(classes.controlButton)} onClick={handleShowInGameWindow} title={t('header.openInGame')}>
            <DesktopWindowIcon />
        </button>}
        <button className={clsx(classes.controlButton)} onClick={context.toggleFrameMenu} title={t('header.settings')}>
            <SettingsIcon />
        </button>
        <button className={clsx(classes.controlButton)} onClick={handleMinimize}>
            <Minimizeicon />
        </button>
        <button className={clsx(classes.controlButton)} onClick={handleMaximizeRestore}>
            {maximized
                ? <RestoreIcon />
                : <MaximizeIcon />
            }
        </button>
        <button className={clsx(classes.controlButton, classes.close)} onClick={handleClose}>
            <CloseIcon />
        </button>
    </header>;
}
