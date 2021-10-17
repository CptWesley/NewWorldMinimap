import React from 'react';
import { Interpolation, zoomLevelSettingBounds } from '@/logic/storage';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

export default function WindowSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSimpleSetting,
        setPeek,
    } = props;
    const { classes } = useSharedSettingsStyles();

    function handleMapSliderMouseDown() {
        setPeek(true);
    }

    function handleMapSliderMouseUp() {
        setPeek(false);
    }

    return <>
        <div className={classes.setting}>
            <label className={classes.checkbox} title='Enabling will make the window header transparent.'>
                <input
                    type='checkbox'
                    checked={settings.transparentHeader}
                    onChange={e => updateSimpleSetting('transparentHeader', e.currentTarget.checked)}
                />
                Transparent header
            </label>
        </div>
        <div className={classes.setting} hidden>
            <label className={classes.checkbox} title='Enabling will make the toolbar transparent.'>
                <input
                    type='checkbox'
                    checked={settings.transparentToolbar}
                    onChange={e => updateSimpleSetting('transparentToolbar', e.currentTarget.checked)}
                />
                Transparent toolbar
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title='Enabling will show the header text and buttons.'>
                <input
                    type='checkbox'
                    checked={settings.showHeader}
                    onChange={e => updateSimpleSetting('showHeader', e.currentTarget.checked)}
                />
                Show header
            </label>
        </div>
        <div className={classes.setting} hidden>
            <label className={classes.checkbox} title='Enabling will show the toolbar.'>
                <input
                    type='checkbox'
                    checked={settings.showToolbar}
                    onChange={e => updateSimpleSetting('showToolbar', e.currentTarget.checked)}
                />
                Show toolbar
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title='Determines the zoom level on the map. Lower zoom may impact performance negatively.'>
                <input
                    type='range'
                    value={zoomLevelSettingBounds[1] - settings.zoomLevel}
                    min='0'
                    max={zoomLevelSettingBounds[1] - zoomLevelSettingBounds[0]}
                    step='0.1'
                    onChange={e => {
                        const newValue = zoomLevelSettingBounds[1] - e.currentTarget.valueAsNumber;
                        updateSimpleSetting('zoomLevel', newValue);
                    }}
                    onMouseDown={handleMapSliderMouseDown}
                    onMouseUp={handleMapSliderMouseUp}
                />
                Zoom Level
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title='Enabling will allow you to configure a seperate zoom level when in towns.'>
                <input
                    type='checkbox'
                    checked={settings.townZoom}
                    onChange={e => updateSimpleSetting('townZoom', e.currentTarget.checked)}
                />
                Change Zoom In Towns
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title='Determines the zoom level on the map when in towns. Lower zoom may impact performance negatively.'>
                <input
                    type='range'
                    value={zoomLevelSettingBounds[1] - settings.townZoomLevel}
                    min='0'
                    max={zoomLevelSettingBounds[1] - zoomLevelSettingBounds[0]}
                    step='0.1'
                    disabled={!settings.townZoom}
                    onChange={e => {
                        const newValue = zoomLevelSettingBounds[1] - e.currentTarget.valueAsNumber;
                        updateSimpleSetting('townZoomLevel', newValue);
                    }}
                    onMouseDown={handleMapSliderMouseDown}
                    onMouseUp={handleMapSliderMouseUp}
                />
                Town Zoom Level
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title='Determines the size of the rendered icons.'>
                <input
                    type='range'
                    value={settings.iconScale}
                    min='0.5'
                    max='5'
                    step='0.1'
                    onChange={e => updateSimpleSetting('iconScale', e.currentTarget.valueAsNumber)}
                    onMouseDown={handleMapSliderMouseDown}
                    onMouseUp={handleMapSliderMouseUp}
                />
                Icon Scale
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title='Controls whether text is displayed underneath icons on the map. Enabling may impact performance negatively.'>
                <input
                    type='checkbox'
                    checked={settings.showText}
                    onChange={e => updateSimpleSetting('showText', e.currentTarget.checked)}
                />
                Show text
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.select} title='Detemines which algorithm to use to produce smoother movement around the map. Interpolation gives smoothest results, but adds a delay to your position. None gives the best performance.'>
                <select
                    value={settings.interpolation}
                    onChange={e => updateSimpleSetting('interpolation', e.currentTarget.value as Interpolation)}
                >
                    <option value='none'>None</option>
                    <option value='linear-interpolation'>Linear Interpolation</option>
                    <option value='cosine-interpolation'>Cosine Interpolation</option>
                    <option value='linear-extrapolation'>Linear Extrapolation</option>
                    <option value='cosine-extrapolation'>Cosine Extrapolation</option>
                </select>
                Location (Inter/Extra)polation
            </label>
        </div>

    </>;
}
