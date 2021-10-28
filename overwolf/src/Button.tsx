import clsx from 'clsx';
import React from 'react';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    button: {
        background: theme.buttonBackground,
        border: '2px solid',
        borderColor: theme.buttonBorderColor,
        borderRadius: 40,
        color: theme.buttonColor,
        padding: theme.spacing(0.5, 2),
        fontFamily: theme.bodyFontFamily,
        fontSize: theme.bodyFontSize,

        '&:hover, &:focus': {
            background: theme.buttonBackgroundHover,
            borderColor: theme.buttonBorderColorHover,
        },

        '&:focus': {
            outline: 'none',
        },

        '&:active': {
            background: theme.buttonBackgroundPress,
            borderColor: theme.buttonBorderColorPress,
        },

        '&:disabled': {
            background: theme.buttonBackground,
            border: '2px solid',
            opacity: 0.5,
        },
    },
}));

export default function Button(props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    const { classes } = useStyles();
    const {
        className,
        ...otherProps
    } = props;

    return <button className={clsx(classes.button, className)} {...otherProps} />;
}
