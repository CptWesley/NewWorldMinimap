import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { getDefaultIconSettings } from './logic/markers';
import Minimap from './Minimap';
import MinimapToolbar from './MinimapToolbar';
import { makeStyles } from './theme';
import Welcome from './Welcome';

const useStyles = makeStyles()(() => ({
    root: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
        gridTemplateAreas: '"toolbar" "minimap"',
        minWidth: 0,
        minHeight: 0,
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

    const context = useContext(AppContext);

    useEffect(() => {
        getDefaultIconSettings().then(x => {
            context.update({ iconSettings: x });
        });
    }, []);

    if (!context.gameRunning) {
        return <Welcome />;
    }

    return <div className={classes.root}>
        <MinimapToolbar>
            Toolbar
        </MinimapToolbar>
        <Minimap className={classes.minimap} />
    </div>;
}
