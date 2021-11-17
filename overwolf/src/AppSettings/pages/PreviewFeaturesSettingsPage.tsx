import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

export default function PreviewFeaturesSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSettings,
    } = props;
    const { classes } = useSharedSettingsStyles();
    const { t } = useTranslation();

    return <>
        <div className={classes.setting}>
            <label className={classes.checkbox} title={t('settings.previewFeatures.featureCollectionRender')}>
                <input
                    type='checkbox'
                    checked={settings.enabledPreviewFunctionailities.includes('feature-collection-render')}
                    onChange={e => {
                        if (e.currentTarget.checked) {
                            updateSettings(
                                {
                                    enabledPreviewFunctionailities: settings.enabledPreviewFunctionailities.concat(['feature-collection-render']),
                                }
                            );

                        } else {
                            updateSettings(
                                {
                                    enabledPreviewFunctionailities:
                                        settings.enabledPreviewFunctionailities = settings.enabledPreviewFunctionailities.filter(
                                            (f) => f !== 'feature-collection-render'
                                        ),
                                }
                            );
                        }
                    }}
                />
                {t('settings.previewFeatures.featureCollectionRender')}
            </label>
        </div>
    </>;
}
