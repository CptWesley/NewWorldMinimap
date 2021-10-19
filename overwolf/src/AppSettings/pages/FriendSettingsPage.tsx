import React from 'react';
import { useTranslation } from 'react-i18next';
import GenerateIcon from '@/Icons/GenerateIcon';
import { generateRandomToken } from '@/logic/util';
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
                        value={settings.friendCode}
                    />
                    {t('settings.friend.friendCode')}
                    <button className={classes.friendsGenerateButton} title={t('settings.friend.regenerate')} onClick={() => updateSimpleSetting('friendCode', generateRandomToken())}>
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
        </div>
    </>;
}
