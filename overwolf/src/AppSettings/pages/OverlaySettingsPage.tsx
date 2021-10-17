import React from 'react';
import { IAppSettingsPageProps } from '../AppSettings';
import { useAppSettingsStyles } from '../appSettingsStyle';

export default function OverlaySettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSimpleSetting,
    } = props;
    const { classes } = useAppSettingsStyles();

    return <>
        <div className={classes.setting}>
            <label className={classes.checkbox} title='Enabling will make the player always face north and rotates the map around the player, like a classic minimap.'>
                <input
                    type='checkbox'
                    checked={settings.compassMode}
                    onChange={e => updateSimpleSetting('compassMode', e.currentTarget.checked)}
                />
                Overlay Compass Mode
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title='Determines the opacity of the overlay.'>
                <input
                    type='range'
                    value={settings.opacity}
                    min='0.1'
                    max='1'
                    step='0.05'
                    onChange={e => updateSimpleSetting('opacity', e.currentTarget.valueAsNumber)}
                />
                Overlay Opacity
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.select} title='Determines the shape of the overlay.'>
                <select
                    value={settings.shape}
                    onChange={e => updateSimpleSetting('shape', e.currentTarget.value)}
                >
                    <option value='none'>Rectangular</option>
                    <option value='ellipse(50% 50%)'>Ellipse</option>
                    <option value='polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'>Diamond</option>
                </select>
                Overlay Shape
            </label>
        </div>
    </>;
}
