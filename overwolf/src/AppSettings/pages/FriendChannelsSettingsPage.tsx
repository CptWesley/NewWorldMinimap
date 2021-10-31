import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/Button';
import GenerateIcon from '@/Icons/GenerateIcon';
import { createEmptyChannel, createNewChannel, getChannels, getFriendId, maxChannels, regenerateFriendId, StoredChannel } from '@/logic/friends';
import { makeStyles } from '@/theme';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';
import AdvancedSettings from './AdvancedSettings';
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
    addButton: {
        display: 'block',
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
    const [addingExisting, setAddingExisting] = useState<StoredChannel | false>(false);
    const [creatingNew, setCreatingNew] = useState<StoredChannel | false>(false);

    const canAddChannels = channels && channels.length < maxChannels;

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
            {addingExisting
                ? <FriendChannelSetting
                    onChange={() => {
                        setAddingExisting(false);
                        loadFriends();
                    }}
                    onCanceled={() => setAddingExisting(false)}
                    channel={addingExisting}
                    isAdding
                />
                : canAddChannels && <Button className={classes.addButton} onClick={() => setAddingExisting(createEmptyChannel())}>
                    {t('settings.friendChannels.addChannel')}
                </Button>
            }
            {channels?.map(c =>
                <FriendChannelSetting
                    key={c.id}
                    onChange={loadFriends}
                    channel={c}
                />
            ) || null}
            {creatingNew
                ? <FriendChannelSetting
                    onChange={() => {
                        setCreatingNew(false);
                        loadFriends();
                    }}
                    onCanceled={() => setCreatingNew(false)}
                    channel={creatingNew}
                    isNew
                />
                : canAddChannels && <Button className={classes.addButton} onClick={() => setCreatingNew(createNewChannel())}>
                    {t('settings.friendChannels.createChannel')}
                </Button>
            }
            <AdvancedSettings>
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
                        onChange={e => updateSimpleSetting('channelsServerUrl', e.currentTarget.value)}
                        value={settings.channelsServerUrl}
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
            </AdvancedSettings>
        </div>
    </>;
}
