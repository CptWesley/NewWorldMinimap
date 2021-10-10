import React from 'react';
import Minimap from './Minimap';
import { makeStyles } from './theme';

const useStyles = makeStyles()(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
    },
}));

export default function App() {
    const { classes } = useStyles();
    return <div className={classes.root}>
        <div>bla</div>
        {<Minimap />}
    </div>;
}
