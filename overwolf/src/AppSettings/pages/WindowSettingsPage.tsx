import React from 'react';
import { useTranslation } from 'react-i18next';
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
        <div className={classes.setting} hidden>
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
        <div className={classes.setting} hidden>
            <label className={classes.checkbox} title={t('settings.window.showToolbarTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.showToolbar}
                    onChange={e => updateSimpleSetting('showToolbar', e.currentTarget.checked)}
                />
                {t('settings.window.showToolbar')}
            </label>
        </div>
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
        <div className={classes.setting}>
            <label className={classes.select} title={t('settings.window.interpolationTooltip')}>
                <select
                    value={settings.interpolation}
                    onChange={e => updateSimpleSetting('interpolation', e.currentTarget.value as Interpolation)}
                >
                    <option value='none'>{t('settings.window.interpolationNone')}</option>
                    <option value='linear-interpolation'>{t('settings.window.interpolationLinearInter')}</option>
                    <option value='cosine-interpolation'>{t('settings.window.interpolationCosineInter')}</option>
                    <option value='linear-extrapolation'>{t('settings.window.interpolationLinearExtra')}</option>
                    <option value='cosine-extrapolation'>{t('settings.window.interpolationCosineExtra')}</option>
                </select>
                {t('settings.window.interpolation')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.range} title={t('settings.window.resamplingRateTooltip')}>
                <input
                    type='range'
                    value={settings.resamplingRate}
                    min='10'
                    max='40'
                    step='1'
                    disabled={settings.interpolation === 'none'}
                    onChange={e => updateSimpleSetting('resamplingRate', e.currentTarget.valueAsNumber)}
                    onMouseDown={handleMapSliderMouseDown}
                    onMouseUp={handleMapSliderMouseUp}
                />
                {t('settings.window.resamplingRate')}
            </label>
        </div>
    </>;
}
