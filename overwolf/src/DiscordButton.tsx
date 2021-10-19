import clsx from 'clsx';
import React from 'react';
import DiscordIcon from './Icons/DiscordIcon';
import { discordUrl } from './links';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',
        position: 'relative',
    },
    discordLink: {
        color: theme.color,
        textDecoration: 'none',
    },
    icon: {
        width: '1em',
        height: '1em',
        position: 'absolute',
        top: '0.1em',
        left: 0,
    },
    text: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        appearance: 'none',
        border: 'none',
        background: 'none',
        color: 'currentcolor',

        fontFamily: theme.bodyFontFamily,
        fontSize: typeof theme.bodyFontSize === 'number'
            ? theme.bodyFontSize - 2
            : `calc(${theme.bodyFontSize} - 2px)`,
        padding: '2px 4px 2px 5px',
    },
}));

export default function DiscordButton(props: IProps) {
    const { className } = props;
    const { classes } = useStyles();

    return (
        <div className={clsx(classes.root, className)}>
            <a className={classes.discordLink} href={discordUrl} target='_blank'>
                <DiscordIcon />
                <span className={classes.text}>Discord</span>
            </a>
        </div>
    );
}
