import React from 'react';
import Minimap from './Minimap';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'grid',
        gridTemplateRows: '32px 1fr',
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
