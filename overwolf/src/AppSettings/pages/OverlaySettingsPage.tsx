import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

export default function OverlaySettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSimpleSetting,
    } = props;
    const { classes } = useSharedSettingsStyles();
    const { t } = useTranslation();

    return <>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.overlay.compassModeTooltip')}>
                <input
                    type='checkbox'
                    checked={settings.compassMode}
                    onChange={e => updateSimpleSetting('compassMode', e.currentTarget.checked)}
                />
                {t('settings.overlay.compassMode')}
            </label>
        </div>
        <div className={classes.setting}>
            <label className={classes.select} title={t('settings.overlay.shapeTooltip')}>
                <select
                    value={settings.shape}
                    onChange={e => updateSimpleSetting('shape', e.currentTarget.value)}
                >
                    <option value='none'>{t('settings.overlay.shapeRectangular')}</option>
                    <option value='ellipse(50% 50%)'>{t('settings.overlay.shapeEllipse')}</option>
                    <option value='polygon(50% 0, 100% 50%, 50% 100%, 0 50%)'>{t('settings.overlay.shapeDiamond')}</option>
                </select>
                {t('settings.overlay.shape')}
            </label>
        </div>
        <details>
            <summary title={t('settings.advancedTooltip')} className={classes.summary} >{t('settings.advanced')}</summary>
            <p className={classes.setting}>{t('settings.advancedTooltip')}</p>
            <div className={classes.setting}>
                <label className={classes.range} title={t('settings.overlay.opacityTooltip')}>
                    <input
                        type='range'
                        value={settings.opacity}
                        min='0.1'
                        max='1'
                        step='0.05'
                        onChange={e => updateSimpleSetting('opacity', e.currentTarget.valueAsNumber)}
                    />
                    {t('settings.overlay.opacity')}
                </label>
            </div>
        </details>
    </>;
}
