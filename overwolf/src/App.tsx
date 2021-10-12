import clsx from 'clsx';
import React, { useContext } from 'react';
import { AppContext } from './contexts/AppContext';
import Minimap from './Minimap';
import { makeStyles } from './theme';

const useStyles = makeStyles()(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
        gridTemplateAreas: '"toolbar" "minimap"',
    },
    hidden: {
        display: 'none !important',
    },
    toolbar: {
        gridArea: 'toolbar',
    },
    minimap: {
        gridArea: 'minimap',
    },
}));

export default function App() {
    const context = useContext(AppContext);
    const { classes } = useStyles();
    return <div className={classes.root}>
        <div className={clsx(classes.toolbar, !context.value.showToolbar && classes.hidden)}>
            Toolbar
        </div>
        {<Minimap className={classes.minimap} />}
    </div>;
}
