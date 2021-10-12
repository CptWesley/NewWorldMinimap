import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import CloseIcon from './Icons/CloseIcon';
import DesktopWindowIcon from './Icons/DesktopWindowIcon';
import { windowNames } from './OverwolfWindows/consts';
import { inGameAppTitle } from './OverwolfWindows/in_game/in_game';
import { makeStyles } from './theme';

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

export default function InGameHeader() {
    const { classes } = useStyles();
    const [inGameWindow] = useState(() => {
        return new OWWindow(windowNames.inGame);
    });
    const [desktopWindow] = useState(() => {
        return new OWWindow(windowNames.desktop);
    });

    const draggable = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (draggable.current) {
            inGameWindow.dragMove(draggable.current);
        }
    }, [draggable.current]);

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
    </header>;
}
