import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import { globalLayers } from './globalLayers';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
    hidden?: boolean;
}

const useStyles = makeStyles()(theme => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        zIndex: globalLayers.minimapToolbar,
        padding: theme.spacing(0.5),
        background: theme.toolbarBackground,
        color: theme.toolbarColor,
        borderRadius: theme.borderRadiusMedium,
        opacity: 1,
        transition: 'opacity 600ms ease',
    },
    transparent: {
        background: theme.toolbarTransparentBackground,
        backdropFilter: theme.toolbarBackdropFilter,
    },
    hidden: {
        opacity: 0,
        pointerEvents: 'none',
    },
}));

export default function MinimapToolbar(props: React.PropsWithChildren<IProps>) {
    const {
        className,
        hidden,
        children,
    } = props;
    const context = useContext(AppContext);
    const { classes } = useStyles();

    const rootClass = clsx(
        className,
        classes.toolbar,
        context.settings.transparentToolbar && classes.transparent,
        hidden && classes.hidden,
        className);

    return (
        <div className={rootClass}>
            {children}
        </div>
    );
}
