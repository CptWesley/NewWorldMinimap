import React from 'react';
import { useTranslation } from 'react-i18next';
import { zoomLevelSettingBounds } from '@/logic/storage';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';
import AdvancedSettings from './AdvancedSettings';

export default function WindowSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSimpleSetting,
        setPeek,
    } = props;
    const { classes } = useSharedSettingsStyles();
    const { t } = useTranslation();

    function handleMapSliderMouseDown() {
        setPeek(true);
    }

    function handleMapSliderMouseUp() {
        setPeek(false);
    }

    return <>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.transparentHeaderTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.transparentHeader}
                    onChange={e => updateSimpleSetting('transparentHeader', e.currentTarget.checked)}
                />
                {t('settings.window.transparentHeader')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.transparentToolbarTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.transparentToolbar}
                    onChange={e => updateSimpleSetting('transparentToolbar', e.currentTarget.checked)}
                />
                {t('settings.window.transparentToolbar')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.showHeaderTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.showHeader}
                    onChange={e => updateSimpleSetting('showHeader', e.currentTarget.checked)}
                />
                {t('settings.window.showHeader')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.showToolbarTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.showToolbar}
                    onChange={e => updateSimpleSetting('showToolbar', e.currentTarget.checked)}
                />
                {t('settings.window.showToolbar')}
            </label>
        </div>
        <hr />
        <div className={classes.setting}>
            <label className={classes.range} title={t('settings.window.zoomLevelTooltip')}>
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
                {t('settings.window.zoomLevel')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.townZoomTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.townZoom}
                    onChange={e => updateSimpleSetting('townZoom', e.currentTarget.checked)}
                />
                {t('settings.window.townZoom')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title={t('settings.window.townZoomLevelTooltip')}>
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
                {t('settings.window.townZoomLevel')}
            </label>
        </div>
        <hr />
        <div className={classes.setting}>
            <label className={classes.range} title={t('settings.window.iconScaleTooltip')}>
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
                {t('settings.window.iconScale')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.showTextTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.showText}
                    onChange={e => updateSimpleSetting('showText', e.currentTarget.checked)}
                />
                {t('settings.window.showText')}
            </label>
        </div>
        <hr />
        <div className={classes.setting}>
            <label className={classes.select} title={t('settings.window.animationInterpolationTooltip')}>
                <select
                    value={settings.animationInterpolation}
                    onChange={e => updateSimpleSetting('animationInterpolation', e.currentTarget.value as AnimationInterpolation)}
                >
                    <option value='none'>{t('settings.window.animationInterpolationNone')}</option>
                    <option value='linear'>{t('settings.window.animationInterpolationLinear')}</option>
                    <option value='cosine'>{t('settings.window.animationInterpolationCosine')}</option>
                </select>
                {t('settings.window.animationInterpolation')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.window.extrapolateLocationTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.extrapolateLocation}
                    onChange={e => updateSimpleSetting('extrapolateLocation', e.currentTarget.checked)}
                    disabled={settings.animationInterpolation === 'none'}
                />
                {t('settings.window.extrapolateLocation')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title={t('settings.window.resamplingRateTooltip')}>
                <input
                    type='range'
                    value={settings.resamplingRate}
                    min='10'
                    max='60'
                    step='1'
                    disabled={settings.animationInterpolation === 'none'}
                    onChange={e => updateSimpleSetting('resamplingRate', e.currentTarget.valueAsNumber)}
                    onMouseDown={handleMapSliderMouseDown}
                    onMouseUp={handleMapSliderMouseUp}
                />
                {t('settings.window.resamplingRate')}
            </label>
        </div>
        <div className={classes.setting} title={t('settings.window.showPlayerCoordinatesTooltip')}>
            <label className={classes.checkbox}>
                <input
                    type='checkbox'
                    checked={settings.showPlayerCoordinates}
                    onChange={e => updateSimpleSetting('showPlayerCoordinates', e.currentTarget.checked)}
                />
                {t('settings.window.showPlayerCoordinates')}
            </label>
        </div>
        <AdvancedSettings>
            <div className={classes.setting} title={t('settings.window.showNavMeshTooltip')}>
                <label className={classes.checkbox}>
                    <input
                        type='checkbox'
                        checked={settings.showNavMesh}
                        onChange={e => updateSimpleSetting('showNavMesh', e.currentTarget.checked)}
                    />
                    {t('settings.window.showNavMesh')}
                </label>
            </div>
        </AdvancedSettings>
    </>;
}
