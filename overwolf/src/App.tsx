import React from 'react';
import Minimap from './Minimap';
import MinimapToolbar from './MinimapToolbar';
import { makeStyles } from './theme';

const useStyles = makeStyles()(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
        gridTemplateAreas: '"toolbar" "minimap"',
    },
    toolbar: {
        gridArea: 'toolbar',
    },
    minimap: {
        gridArea: 'minimap',
    },
}));

export default function App() {
    const { classes } = useStyles();
    return <div className={classes.root}>
        <MinimapToolbar>
            Toolbar
        </MinimapToolbar>
        <Minimap className={classes.minimap} />
    </div>;
}
