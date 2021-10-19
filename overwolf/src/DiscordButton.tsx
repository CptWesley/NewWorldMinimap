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
    },
    discordLink: {
        color: theme.color,
        textDecoration: 'none',
    },
    text: {
        fontSize: typeof theme.bodyFontSize === 'number'
            ? theme.bodyFontSize - 2
            : `calc(${theme.bodyFontSize} - 2px)`,
        marginLeft: 5,
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
