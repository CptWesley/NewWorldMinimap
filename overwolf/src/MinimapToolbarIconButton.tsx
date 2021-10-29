import clsx from 'clsx';
import React from 'react';
import { makeStyles } from './theme';

interface IProps {
    isSelected?: boolean;
}

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
        },
    },
    selected: {
        // background: theme.buttonBackgroundHover,
        background: `radial-gradient(circle, transparent 0%, ${theme.buttonBackgroundHover} 100%)`,
    },
}));

type PropsType = IProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function MinimapToolbarIconButton(props: PropsType) {
    const { classes } = useStyles();
    const {
        className,
        isSelected,
        ...otherProps
    } = props;

    return <button
        className={clsx(classes.button, isSelected && classes.selected, className)}
        {...otherProps}
    />;
}
