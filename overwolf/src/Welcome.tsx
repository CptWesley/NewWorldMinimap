import React from 'react';
import Button from './Button';
import { discordUrl } from './links';
import { getBackgroundController } from './OverwolfWindows/background/background';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    root: {
        position: 'relative',
        height: '100%',
        minHeight: 0,
        background: theme.background,
        padding: theme.spacing(2),

        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        gap: theme.spacing(1),
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.1,
        objectFit: 'cover',
        pointerEvents: 'none',
        // Fancy gradient effect
        maskImage: 'linear-gradient(to bottom right, rgba(0,0,0,0), rgba(0,0,0,1))',
    },
    discordLink: {
        color: theme.linkColor,
    },
}));

const backgroundController = getBackgroundController();
export default function Welcome() {
    const { classes } = useStyles();

    function tryForceMap() {
        backgroundController.debug_setGameRunning(true);
    }

    return <div className={classes.root}>
        <img className={classes.background} src='/img/map-crop.svg' />
        <h2>Welcome to {NWMM_APP_NAME}</h2>
        <p>Launch New World to access the minimap.</p>
        <p>You may also access the application settings while the game is not running.</p>
        <p>Feel free to join our Discord server for questions, help, and suggestions you might have: <a className={classes.discordLink} href={discordUrl} target='_blank'>{discordUrl}</a>.</p>
        {!NWMM_APP_BUILD_OPK && <>
            <hr />
            <p>This appears to be a development build. Use the button below to access the minimap at a debug location.</p>
            <Button onClick={tryForceMap}>Show me the map</Button>
        </>}
    </div>;
}
