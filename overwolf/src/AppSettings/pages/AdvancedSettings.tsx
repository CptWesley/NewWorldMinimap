import '@/style/lato-fonts.css';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

interface IProps {
    children: React.ReactNode[] | React.ReactNode | undefined;
}

export default function AdvancedSettings(props: IProps) {
    const { classes } = useSharedSettingsStyles();
    const { t } = useTranslation();

    return <>
        <hr />
        <details>
            <summary title={t('settings.advancedTooltip')} className={classes.summary} >{t('settings.advanced')}</summary>
            <p className={classes.setting}>{t('settings.advancedTooltip')}</p>
            {props.children}
        </details>
    </>;
}
