import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AppUpdateInfo, downloadAppUpdate, registerAppUpdateCallback } from '@/logic/appUpdates';
import { makeStyles } from '@/theme';

const useStyles = makeStyles()(() => ({
    action: {
        cursor: 'pointer',
        textDecoration: 'underline',
    },
}));

export default function MinimapUpdateNotification() {
    const { classes } = useStyles();
    const { t } = useTranslation();

    const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo>();

    useEffect(() => {
        return registerAppUpdateCallback(setUpdateInfo, window);
    }, []);

    if (!updateInfo) {
        return null;
    }

    function downloadUpdate(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        downloadAppUpdate();
    }

    function restart(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        overwolf.extensions.relaunch();
    }

    if (updateInfo.state === 'UpdateAvailable') {
        return <p>
            <Trans
                i18nKey='minimap.updateAvailable'
                tOptions={{ version: updateInfo.version || t('unknown') }}
            >
                Update available. <a
                    onClick={downloadUpdate}
                    className={classes.action}
                >
                    Download
                </a>
            </Trans>
        </p>;
    }

    if (updateInfo.state === 'PendingRestart') {
        return <p>
            <Trans
                i18nKey='minimap.updateDownloaded'
            >
                Update downloaded. <a
                    onClick={restart}
                    className={classes.action}
                >
                    Restart
                </a>
            </Trans>
        </p>;
    }

    if (updateInfo.state === 'UpdateFailed') {
        return <p>
            {t('minimap.updateFailed', { reason: updateInfo.error })}
        </p>;
    }

    return null;
}
