import React from 'react';
import { makeStyles } from './theme';

const useStyles = makeStyles()({
    text: {
        color: 'red',
    },
});

export default function App() {
    const { classes } = useStyles();

    return <p className={classes.text}>This component is rendered using React.</p>;
}
