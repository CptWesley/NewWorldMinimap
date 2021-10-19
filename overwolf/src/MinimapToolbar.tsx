import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    toolbar: {
        position: 'relative',
        width: '40px',
        zIndex: globalLayers.minimapToolbar,

        margin: theme.spacing(1, 1, 0, 1),
        padding: theme.spacing(1),
        background: theme.toolbarBackground,
        color: theme.toolbarColor,
        borderRadius: 4,
    },
    transparent: {
        background: theme.toolbarTransparentBackground,
        backdropFilter: theme.toolbarBackdropFilter,
    },
    hidden: {
        display: 'none !important',
    },
}));

export default function MinimapToolbar(props: React.PropsWithChildren<{}>) {
    const {
        children,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    return (
        <div className={clsx(classes.toolbar, context.settings.transparentToolbar && classes.transparent, !context.settings.showToolbar && classes.hidden)}>
            {children}
        </div>
    );
}
