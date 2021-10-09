import '@fontsource/lato/400.css';
import React from 'react';
import { GlobalStyles } from 'tss-react';
import { makeStyles } from './theme';

interface IProps {
    header: React.ReactNode;
    content: React.ReactNode;
}

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'grid',
        gridTemplateRows: '32px 1fr',
        gridTemplateColumns: '1fr',
        height: '100vh',

        background: theme.background,
        color: theme.color,
    },
}));

export default function Frame(props: IProps) {
    const {
        header,
        content,
    } = props;
    const { classes } = useStyles();

    return (
        <div className={classes.root}>
            <GlobalStyles
                styles={{
                    body: {
                        fontFamily: 'Lato, sans-serif',
                        fontSize: 16,
                        margin: 0,
                        userSelect: 'none',
                    },
                }}
            />
            {header}
            {content}
        </div>
    );
}
