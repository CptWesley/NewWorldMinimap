import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import Button from './Button';
import LanguagePicker from './LanguagePicker';
import { discordUrl } from './links';
import AppPlatform from './logic/platform';
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
    gap: {
        flexGrow: 1,
    },
}));

const informant = AppPlatform.state.informant;
export default function Welcome() {
    const { classes } = useStyles();
    const { t } = useTranslation();

    function tryForceMap() {
        informant.debug_setGameRunning(true);
    }

    return <div className={classes.root}>
        <img className={classes.background} src='/img/map-crop.svg' />
        <h2>{t('welcome.title')}</h2>
        <p>{t('welcome.primary')}</p>
        <p>{t('welcome.settings')}</p>
        <p>
            <Trans i18nKey='welcome.discord' tOptions={{ discord: discordUrl }}>
                Join <a className={classes.discordLink} href={discordUrl} target='_blank'>discord</a>!
            </Trans>
        </p>
        {!NWMM_APP_BUILD_PRODUCTION && <>
            <hr />
            <p>{t('welcome.devBuild')}</p>
            <Button onClick={tryForceMap}>{t('welcome.forceMap')}</Button>
        </>}
        <div className={classes.gap} />
        <LanguagePicker />
    </div>;
}
