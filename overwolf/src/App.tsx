import produce from 'immer';
import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import { getDefaultIconSettings } from './logic/markers';
import { deconstructIconStorageKey, getStorageKeyScope, load, loadIconConfiguration, scopedSettings, simpleStorageDefaultSettings, SimpleStorageSetting } from './logic/storage';
import Minimap from './Minimap';
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

    useEffect(() => {
        function handleStorageEvent(e: StorageEvent) {
            if (!e.key || !e.newValue) { return; }

            const [keyScope, identifier] = getStorageKeyScope(e.key);
            if (keyScope === NWMM_APP_WINDOW && scopedSettings.includes(identifier as keyof SimpleStorageSetting)) {
                // The setting is scoped to the current window, and is listed as a scoped setting
                context.update({ [identifier as keyof SimpleStorageSetting]: load(identifier as keyof SimpleStorageSetting) });
            } else if (keyScope === 'icon') {
                // It is an icon setting. First, determine if it's just a category, or a category and an icon
                const iconSetting = deconstructIconStorageKey(identifier);
                if (iconSetting) {
                    const { category, type, property } = iconSetting;
                    if (type) {
                        // It is a category and type. If the iconSettings are loaded, and the category and type exist,
                        // produce a new iconSettings with the category.types.type value set to the new setting value.
                        context.update(prev => produce(prev, draft => {
                            const setting = draft.iconSettings?.categories[category]?.types[type];
                            if (setting) {
                                setting[property] = loadIconConfiguration(category, type, property);
                            }
                        }));
                    } else {
                        // It is just a category. If the iconSettings are loaded, and the category exists, produce a new iconSettings
                        // with the category value set to the new setting value.
                        context.update(prev => produce(prev, draft => {
                            const setting = draft.iconSettings?.categories[category];
                            if (setting) {
                                setting[property] = loadIconConfiguration(category, type, property);
                            }
                        }));
                    }
                }
            } else if (keyScope === undefined && simpleStorageDefaultSettings.hasOwnProperty(identifier) && !scopedSettings.includes(identifier as keyof SimpleStorageSetting)) {
                // The setting is not scoped to the current window, and exists, but is not listed as a scoped setting.
                context.update({ [identifier as keyof SimpleStorageSetting]: load(identifier as keyof SimpleStorageSetting) });
            }
        }

        window.addEventListener('storage', handleStorageEvent);

        return () => {
            window.removeEventListener('storage', handleStorageEvent);
        };
    }, []);

    if (!context.gameRunning) {
        return <Welcome />;
    }

    return <div className={classes.root}>
        <Minimap className={classes.minimap} />
    </div>;
}
