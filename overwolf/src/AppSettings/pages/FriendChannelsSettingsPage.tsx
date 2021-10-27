import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/Button';
import GenerateIcon from '@/Icons/GenerateIcon';
import { createNewChannel, getChannels, getFriendId, regenerateFriendId, StoredChannel } from '@/logic/friends';
import { makeStyles } from '@/theme';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';
import FriendChannelSetting from './FriendChannelSetting';

const useStyles = makeStyles()(theme => ({
    friendsGenerateButton: {
        background: 'transparent',
        border: 'none',
        borderRadius: theme.borderRadiusMedium,
        color: theme.frameMenuColor,
        padding: 2,
        marginLeft: theme.spacing(1),
        width: '1.8em',
        height: '1.8em',
        verticalAlign: 'middle',

        '&:hover, &:focus': {
            outline: 'none',
            background: theme.buttonBackgroundHover,
        },
    },
    wideInput: {
        width: 600,
        maxWidth: '100%',
    },
    semiWideInput: {
        width: 300,
        maxWidth: '100%',
    },
    addFriend: {
        marginTop: theme.spacing(1),
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

    const [channels, setChannels] = useState<StoredChannel[]>();
    const [friendId, setFriendId] = useState(getFriendId());
    const [isAddingNew, setIsAddingNew] = useState<StoredChannel | false>(false);

    useEffect(() => {
        loadFriends();
    }, []);

    async function loadFriends() {
        setChannels(await getChannels());
    }

    return <>
        <div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.checkbox} title={t('settings.friendChannels.shareLocationTooltip')}>
                    <input
                        type='checkbox'
                        checked={settings.shareLocation}
                        onChange={e => updateSimpleSetting('shareLocation', e.currentTarget.checked)}
                    />
                    {t('settings.friendChannels.shareLocation')}
                </label>
            </div>
            <div className={sharedClasses.setting}>
                {t('settings.friendChannels.privacy')}
            </div>
            <hr />
            <p>{t('settings.friendChannels.yourChannels')}</p>
            {channels?.map(c =>
                <FriendChannelSetting
                    key={c.id}
                    onChange={loadFriends}
                    channel={c}
                />
            ) || null}
            {isAddingNew
                ? <FriendChannelSetting
                    onChange={() => {
                        setIsAddingNew(false);
                        loadFriends();
                    }}
                    onCanceled={() => setIsAddingNew(false)}
                    channel={isAddingNew}
                    isNew
                />
                : <Button
                    className={classes.addFriend}
                    onClick={() => setIsAddingNew(createNewChannel())}
                >
                    {t('settings.friendChannels.addChannel')}
                </Button>
            }
            <hr />
            <details>
                <summary title={t('settings.advancedTooltip')} className={sharedClasses.summary} >{t('settings.advanced')}</summary>
                <p className={sharedClasses.setting}>{t('settings.advancedTooltip')}</p>
                <div className={sharedClasses.setting}>
                    <p>
                        <label htmlFor='settings-friends-custom-server-url' title={t('settings.friendChannels.customServerUrlTooltip')}>
                            {t('settings.friendChannels.customServerUrl')}
                        </label>
                    </p>
                    <input
                        id='settings-friends-custom-server-url'
                        type='text'
                        className={clsx(sharedClasses.textbox, classes.semiWideInput)}
                        onChange={e => updateSimpleSetting('friendServerUrl', e.currentTarget.value)}
                        value={settings.friendServerUrl}
                    />
                </div>
                <div className={sharedClasses.setting}>
                    <p>
                        {t('settings.friendChannels.friendId', { id: friendId })} <button
                            className={classes.friendsGenerateButton}
                            title={t('settings.friendChannels.regenerateId')}
                            onClick={() => setFriendId(regenerateFriendId())}
                        >
                            <GenerateIcon />
                        </button>
                    </p>
                </div>
            </details>
        </div>
    </>;
}
