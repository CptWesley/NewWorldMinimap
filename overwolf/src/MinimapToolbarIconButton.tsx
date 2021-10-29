import clsx from 'clsx';
import React from 'react';
import { makeStyles } from './theme';

interface IProps {
    isSelected?: boolean;
    hidden?: boolean;
}

const useStyles = makeStyles()(theme => ({
    button: {
        background: theme.buttonBackground,
        border: 'none',
        borderRadius: theme.borderRadiusMedium,
        color: theme.buttonColor,
        width: 40,
        height: 40,
        padding: theme.spacing(0.5),

        transition: 'width 300ms ease'
            + ', height 300ms ease'
            + ', padding 300ms ease'
            + ', opacity 300ms ease',
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            width: '100%',
            height: '100%',
        },

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
    hidden: {
        width: 0,
        height: 0,
        padding: 0,
        opacity: 0,
        background: 'none !important',
    },
}));

type PropsType = IProps & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export default function MinimapToolbarIconButton(props: PropsType) {
    const { classes } = useStyles();
    const {
        className,
        isSelected,
        hidden,
        ...otherProps
    } = props;

    return <button
        className={clsx(classes.button, isSelected && classes.selected, hidden && classes.hidden, className)}
        {...otherProps}
    />;
}
