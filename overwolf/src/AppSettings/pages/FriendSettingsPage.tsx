import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GenerateIcon from '@/Icons/GenerateIcon';
import { getFriendCode, regenerateFriendCode } from '@/logic/friends';
import { makeStyles } from '@/theme';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

const useStyles = makeStyles()(theme => ({
    friendsGenerateButton: {
        background: 'transparent',
        border: 'none',
        color: theme.frameMenuColor,
        padding: 0,
        margin: '0 2px',
        width: 20,
        height: 20,
        verticalAlign: 'middle',

        '&:focus': {
            outline: 0,
        },
    },
}));

export default function FriendSettingsPage(props: IAppSettingsPageProps) {
    const {
        settings,
        updateSimpleSetting,
    } = props;
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();
    const { t } = useTranslation();
    const [friendCode, setFriendCode] = useState(getFriendCode());

    return <>
        <div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.checkbox} title={t('settings.friend.shareLocationTooltip')}>
                    <input
                        type='checkbox'
                        checked={settings.shareLocation}
                        onChange={e => updateSimpleSetting('shareLocation', e.currentTarget.checked)}
                    />
                    {t('settings.friend.shareLocation')}
                </label>
            </div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.textbox} title={t('settings.friend.friendCodeTooltip')}>
                    <input
                        type='text'
                        readOnly
                        value={friendCode}
                    />
                    {t('settings.friend.friendCode')}
                    <button className={classes.friendsGenerateButton} title={t('settings.friend.regenerate')} onClick={() => setFriendCode(regenerateFriendCode())}>
                        <GenerateIcon />
                    </button>
                </label>
            </div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.textarea} title={t('settings.friend.friendsTooltip')}>
                    <textarea
                        value={settings.friends}
                        onChange={e => updateSimpleSetting('friends', e.currentTarget.value)}
                    />
                    {t('settings.friend.friends')}
                </label>
            </div>
            <details>
                <summary title={t('settings.advancedTooltip')} className={sharedClasses.summary} >{t('settings.advanced')}</summary>
                <p className={sharedClasses.setting}>{t('settings.advancedTooltip')}</p>
                <div className={sharedClasses.setting}>
                    <label className={sharedClasses.textbox} title={t('settings.friend.customServerUrlTooltip')}>
                        <input
                            type='text'
                            onChange={e => updateSimpleSetting('friendServerUrl', e.currentTarget.value)}
                            value={settings.friendServerUrl}
                        />
                        {t('settings.friend.customServerUrl')}
                    </label>
                </div>
            </details>
        </div>
    </>;
}
