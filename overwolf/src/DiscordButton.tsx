import clsx from 'clsx';
import React from 'react';
import DiscordIcon from './Icons/DiscordIcon';
import { discordUrl } from './links';
import { makeStyles } from './theme';

interface IProps {
    className?: string;
}

const useStyles = makeStyles()(theme => ({
    discordLink: {
        color: theme.color,
        textDecoration: 'none',

        '&:hover': {
            textDecoration: 'underline',
        },
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
        <a className={clsx(classes.discordLink, className)} href={discordUrl} target='_blank'>
            <DiscordIcon />
            <span className={classes.text}>Discord</span>
        </a>
    );
}
