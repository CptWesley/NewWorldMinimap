import clsx from 'clsx';
import React from 'react';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    button: {
        background: theme.buttonBackground,
        border: 'none',
        borderRadius: theme.borderRadiusMedium,
        color: theme.buttonColor,
        fontFamily: theme.bodyFontFamily,
        fontSize: theme.bodyFontSize,
        width: 40,
        height: 40,
        padding: theme.spacing(0.5),

        '&:hover, &:focus': {
            background: theme.buttonBackgroundHover,
        },

        '&:focus': {
            outline: 'none',
        },

        '&:active': {
            background: theme.buttonBackgroundPress,
            borderColor: theme.buttonBorderColorPress,
        },
    },
}));

export default function MinimapToolbarIconButton(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    const { classes } = useStyles();
    const {
        className,
        ...otherProps
    } = props;

    return <button className={clsx(classes.button, className)} {...otherProps} />;
}
