import React from 'react';
import { useTranslation } from 'react-i18next';
import GenerateIcon from '@/Icons/GenerateIcon';
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
                <label className={sharedClasses.checkbox} title='Share your location with any player that have your code.'>
                    <input
                        type='checkbox'
                        checked={settings.shareLocation}
                        onChange={e => updateSimpleSetting('shareLocation', e.currentTarget.checked)}
                    />
                    Share location with friends
                </label>
            </div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.textbox} title='Send this code to your friends to share your location.'>
                    <input
                        type='text'
                        readOnly
                        value={settings.friendCode}
                    />
                    Your code
                    <button className={classes.friendsGenerateButton} onClick={() => updateSimpleSetting('friendCode', generateRandomToken())}>
                        <GenerateIcon />
                    </button>
                </label>
            </div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.textarea} title='List of friend codes one per line.'>
                    <textarea
                        value={settings.friends}
                        onChange={e => updateSimpleSetting('friends', e.currentTarget.value)}
                    />
                    Friends
                </label>
            </div>
        </div>
    </>;
}
