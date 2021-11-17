import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { globalLayers } from './globalLayers';
import { makeStyles } from './theme';

const notices = {
    '5289534c-bf5a-4d5c-8678-254ab8bdefe3': 'Due to requests from Amazon Games, several features of this application have been disabled until further notice. These features include:\n\n- Markers on the map\n- Navigation\n- Displaying friends.\n\nWe will consider enabling them when the APIs we need to display the correct information are available.',
};

function loadNoticeRead(notice: keyof typeof notices) {
    return localStorage.getItem(`notice::${notice}`) === true.toString();
}

function storeNoticeRead(notice: keyof typeof notices) {
    localStorage.setItem(`notice::${notice}`, true.toString());
}

const useStyles = makeStyles()(theme => ({
    root: {
        background: '#343f6e',
        color: theme.color,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: globalLayers.inAppAnnouncement,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
    },
    notices: {
        flexGrow: 1,
        maxWidth: '100%',
        width: 500,
        marginTop: theme.spacing(5),
        overflow: 'auto',
    },
    notice: {
        padding: theme.spacing(1),

        '&:not(:last-child)': {
            borderBottom: `1px solid ${theme.color}`,
        },
    },
    noticeText: {
        whiteSpace: 'pre-line',
    },
    actions: {

    },
}));

export default function InAppNotices() {
    const { classes } = useStyles();
    const { t } = useTranslation();

    const forceRerender = useState(0)[1];
    const noticeEntries = Object.entries(notices) as [keyof typeof notices, string][];
    const unreadNotices = noticeEntries.filter(ne => !loadNoticeRead(ne[0]));

    if (unreadNotices.length === 0) {
        return null;
    }

    function handleClose() {
        for (const unreadNotice of unreadNotices) {
            storeNoticeRead(unreadNotice[0]);
        }
        forceRerender(value => value + 1);
    }

    return <div className={classes.root}>
        <div className={classes.notices}>
            {unreadNotices.map(n => <div key={n[0]} className={classes.notice}>
                <p className={classes.noticeText}>
                    {n[1]}
                </p>
            </div>)}
        </div>
        <div className={classes.actions}>
            <Button onClick={handleClose}>{t('close')}</Button>
        </div>
    </div>;
}
