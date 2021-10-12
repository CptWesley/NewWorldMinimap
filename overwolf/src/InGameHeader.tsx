import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import CloseIcon from './Icons/CloseIcon';
import DesktopWindowIcon from './Icons/DesktopWindowIcon';
import { windowNames } from './OverwolfWindows/consts';
import { inGameAppTitle } from './OverwolfWindows/in_game/in_game';
import { makeStyles } from './theme';

const resizeMargin = 5;

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',

        background: theme.headerBackground,
        color: theme.headerColor,
    },
    draggable: {
        flexGrow: 1,

        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        cursor: 'move',
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
        '& > *': {
            position: 'fixed',
            zIndex: 999,
            background: 'rgba(0, 0, 0, 0.01)',
        },

        '& > .n': {
            top: 0,
            left: resizeMargin,
            right: resizeMargin,
            height: resizeMargin,
            cursor: 'n-resize',
        },

        '& > .nw': {
            top: 0,
            left: 0,
            width: resizeMargin,
            height: resizeMargin,
            cursor: 'nw-resize',
        },

        '& > .ne': {
            top: 0,
            right: 0,
            width: resizeMargin,
            height: resizeMargin,
            cursor: 'ne-resize',
        },

        '& > .w': {
            top: resizeMargin,
            left: 0,
            width: resizeMargin,
            bottom: resizeMargin,
            cursor: 'w-resize',
        },

        '& > .e': {
            top: resizeMargin,
            right: 0,
            width: resizeMargin,
            bottom: resizeMargin,
            cursor: 'e-resize',
        },

        '& > .sw': {
            left: 0,
            width: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 'sw-resize',
        },

        '& > .se': {
            right: 0,
            width: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 'se-resize',
        },

        '& > .s': {
            left: resizeMargin,
            right: resizeMargin,
            height: resizeMargin,
            bottom: 0,
            cursor: 's-resize',
        },
    },
}));

export default function InGameHeader() {
    const { classes } = useStyles();
    const [inGameWindow] = useState(() => {
        return new OWWindow(windowNames.inGame);
    });
    const [inGameWindowId, setInGameWindowId] = useState<string>();
    const [desktopWindow] = useState(() => {
        return new OWWindow(windowNames.desktop);
    });

    const draggable = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        overwolf.windows.getCurrentWindow(windowResult => {
            if (windowResult.success) {
                setInGameWindowId(windowResult.window.id);
            }
        });
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
        desktopWindow.restore();
    }

    function handleClose() {
        inGameWindow.close();
    }

    return <header className={classes.root}>
        <div ref={draggable} className={classes.draggable}>
            <span>{inGameAppTitle}</span>
        </div>
        <button className={clsx(classes.controlButton)} onClick={handleShowDesktopWindow}>
            <DesktopWindowIcon />
        </button>
        <button className={clsx(classes.controlButton, classes.close)} onClick={handleClose}>
            <CloseIcon />
        </button>
        <div className={classes.resize}>
            <div className='n' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Top)} />
            <div className='nw' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.TopLeft)} />
            <div className='ne' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.TopRight)} />
            <div className='w' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Left)} />
            <div className='e' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Right)} />
            <div className='sw' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.BottomLeft)} />
            <div className='se' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.BottomRight)} />
            <div className='s' onMouseDown={createHandleDragTop(overwolf.windows.enums.WindowDragEdge.Bottom)} />
        </div>
    </header>;
}
