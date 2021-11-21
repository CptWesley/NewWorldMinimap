import clsx from 'clsx';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import CloseIcon from './Icons/CloseIcon';
import DesktopWindowIcon from './Icons/DesktopWindowIcon';
import SettingsIcon from './Icons/SettingsIcon';
import AppPlatform from './logic/platform';
import { getBackgroundController } from './OverwolfWindows/background/background';
import { windowNames } from './OverwolfWindows/consts';
import { inGameAppTitle } from './OverwolfWindows/in_game/in_game';
import { makeStyles } from './theme';

import WindowState = overwolf.windows.WindowStateEx;
const resizeMargin = 5;

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',

        background: theme.headerBackground,
        color: theme.headerColor,
        height: theme.headerHeight,
        flexShrink: 0,
        overflow: 'hidden',
        zIndex: globalLayers.header,

        '@media screen and (max-width: 149.95px), screen and (max-height: 79.95px)': {
            display: 'none',
        },
    },
    transparent: {
        background: 'rgba(0, 0, 0, 0.01)',
    },
    hidden: {
        display: 'none !important',
    },
    draggable: {
        flexGrow: 1,

        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        cursor: 'move',
        minWidth: 0,

        '& > *': {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
    },
    hotkey: {
        marginLeft: '0.5em',
        opacity: 0.5,
    },
    buttons: {
        flexShrink: 0,
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
    resize: {
        position: 'fixed',
        zIndex: globalLayers.resizeGrips,
        background: 'rgba(0, 0, 0, 0.01)',

        '&.n': {
            top: 0,
            left: resizeMargin,
            right: resizeMargin,
            height: resizeMargin,
            cursor: 'n-resize',
        },

        '&.nw': {
            top: 0,
            left: 0,
            width: resizeMargin,
            height: resizeMargin,
            cursor: 'nw-resize',
        },

        '&.ne': {
            top: 0,
            right: 0,
            width: resizeMargin,
            height: resizeMargin,
            cursor: 'ne-resize',
        },

        '&.w': {
            top: resizeMargin,
            left: 0,
            width: resizeMargin,
            bottom: resizeMargin,
            cursor: 'w-resize',
        },

        '&.e': {
            top: resizeMargin,
            right: 0,
            width: resizeMargin,
            bottom: resizeMargin,
            cursor: 'e-resize',
        },

        '&.sw': {
            left: 0,
            width: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 'sw-resize',
        },

        '&.se': {
            right: 0,
            width: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 'se-resize',
        },

        '&.s': {
            left: resizeMargin,
            right: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 's-resize',
        },
    },
}));

const backgroundController = getBackgroundController();
const hotkeyManager = AppPlatform.state.hotkeyManager;
export default function InGameHeader() {
    const context = useContext(AppContext);
    const { classes } = useStyles();
    const { t } = useTranslation();

    const [inGameWindow] = useState(() => {
        return new OWWindow(windowNames.inGame);
    });
    const [inGameWindowId, setInGameWindowId] = useState<string>();
    const useTransparency = context.settings.transparentHeader && context.gameRunning && !context.appSettingsVisible;

    const draggable = useRef<HTMLDivElement | null>(null);
    const hotkeyText = hotkeyManager.getHotkeyText('toggleInGame');

    useEffect(() => {
        overwolf.windows.getCurrentWindow(windowResult => {
            if (windowResult.success) {
                setInGameWindowId(windowResult.window.id);
            }
        });

        return hotkeyManager.registerHotkey('toggleInGame', async function () {
            const inGameState = await inGameWindow.getWindowState();

            if (inGameState.window_state === WindowState.NORMAL || inGameState.window_state === WindowState.MAXIMIZED) {
                inGameWindow.minimize();
            } else if (inGameState.window_state === WindowState.MINIMIZED || inGameState.window_state === WindowState.CLOSED) {
                backgroundController.openWindow('inGame');
            }
        }, window);
    }, []);

    useEffect(() => {
        if (draggable.current) {
            inGameWindow.dragMove(draggable.current);
        }
    }, [draggable.current]);

    function createHandleDragTop(dragEdge: overwolf.windows.enums.WindowDragEdge) {
        return function (e: React.MouseEvent<HTMLElement>) {
            if (inGameWindowId) {
                e.preventDefault();
                overwolf.windows.dragResize(inGameWindowId, dragEdge);
            }
        };
    }

    function handleShowDesktopWindow() {
        backgroundController.openWindow('desktop');
    }

    function handleClose() {
        backgroundController.closeWindow('inGame');
    }

    return <>
        <header className={clsx(classes.root, useTransparency && classes.transparent, !context.settings.showHeader && classes.hidden)}>
            <div ref={draggable} className={classes.draggable}>
                <span>
                    <span>{inGameAppTitle}</span>
                    {hotkeyText && <span className={classes.hotkey}>({hotkeyText})</span>}
                </span>
            </div>
            <div className={classes.buttons}>
                <button className={clsx(classes.controlButton)} onClick={handleShowDesktopWindow} title={t('header.openDesktop')}>
                    <DesktopWindowIcon />
                </button>
                <button className={clsx(classes.controlButton)} onClick={context.toggleFrameMenu}>
                    <SettingsIcon />
                </button>
                <button className={clsx(classes.controlButton, classes.close)} onClick={handleClose}>
                    <CloseIcon />
                </button>
            </div>
        </header>
        <div className={clsx(classes.resize, 'n')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Top)} />
        <div className={clsx(classes.resize, 'nw')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.TopLeft)} />
        <div className={clsx(classes.resize, 'ne')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.TopRight)} />
        <div className={clsx(classes.resize, 'w')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Left)} />
        <div className={clsx(classes.resize, 'e')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Right)} />
        <div className={clsx(classes.resize, 'sw')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.BottomLeft)} />
        <div className={clsx(classes.resize, 'se')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.BottomRight)} />
        <div className={clsx(classes.resize, 's')} onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Bottom)} />
    </>;
}
