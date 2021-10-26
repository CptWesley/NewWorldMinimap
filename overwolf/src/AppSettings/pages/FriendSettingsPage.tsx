import encHex from 'crypto-js/enc-hex';
import sha256 from 'crypto-js/sha256';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/Button';
import GenerateIcon from '@/Icons/GenerateIcon';
import { getFriendCode, getFriends, regenerateFriendCode, StoredFriend } from '@/logic/friends';
import { makeStyles } from '@/theme';
import { IAppSettingsPageProps } from '../AppSettings';
import { useSharedSettingsStyles } from '../sharedSettingStyles';
import FriendSetting from './FriendSetting';

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
    wideInput: {
        width: 600,
        maxWidth: '100%',
        resize: 'vertical',
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

    const [friends, setFriends] = useState<StoredFriend[]>();
    const [friendCode, setFriendCode] = useState(getFriendCode());
    const [isAddingNew, setIsAddingNew] = useState(false);
    const friendCodeHash = useMemo(() => {
        return sha256(friendCode).toString(encHex);
    }, [friendCode]);

    useEffect(() => {
        loadFriends();
    }, []);

    async function loadFriends() {
        setFriends(await getFriends());
    }

    return <>
        <div>
            <div className={sharedClasses.setting}>
                {t('settings.friend.privacy')}
            </div>
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
                <p>
                    <label htmlFor='settings-friend-code-hash' title={t('settings.friend.friendCodeTooltip')}>
                        {t('settings.friend.friendCode')}
                        <button className={classes.friendsGenerateButton} title={t('settings.friend.regenerate')} onClick={() => setFriendCode(regenerateFriendCode())}>
                            <GenerateIcon />
                        </button>
                    </label>
                </p>
                <input
                    id='settings-friend-code-hash'
                    className={classes.wideInput}
                    type='text'
                    readOnly
                    value={friendCodeHash}
                    title={t('settings.friend.friendCodeTooltip')}
                />
            </div>
            <p>{t('settings.friend.friends')}</p>
            {friends?.map(f =>
                <FriendSetting
                    key={f.id}
                    onChange={loadFriends}
                    friend={f}
                />
            ) || null}
            {isAddingNew
                ? <FriendSetting
                    onChange={() => {
                        setIsAddingNew(false);
                        loadFriends();
                    }}
                    onCanceled={() => setIsAddingNew(false)}
                    friend={{ id: '', name: '' }}
                    isNew
                />
                : <Button className={classes.addFriend} onClick={() => setIsAddingNew(true)}>Add friend</Button>
            }
            <hr />
            <details>
                <summary title={t('settings.advancedTooltip')} className={sharedClasses.summary} >{t('settings.advanced')}</summary>
                <p className={sharedClasses.setting}>{t('settings.advancedTooltip')}</p>
                <div className={sharedClasses.setting}>
                    <p>
                        <label htmlFor='settings-friends-custom-server-url' title={t('settings.friend.customServerUrlTooltip')}>
                            {t('settings.friend.customServerUrl')}
                        </label>
                    </p>
                    <input
                        id='settings-friends-custom-server-url'
                        type='text'
                        onChange={e => updateSimpleSetting('friendServerUrl', e.currentTarget.value)}
                        value={settings.friendServerUrl}
                    />
                </div>
                <div className={sharedClasses.setting}>
                    <p>
                        <label htmlFor='settings-friends-psk' title={t('settings.friend.friendsPskTooltip')}>
                            {t('settings.friend.friendsPsk')}
                        </label>
                    </p>
                    <input
                        id='settings-friends-psk'
                        type='text'
                        value={settings.friendsPsk}
                        onChange={e => updateSimpleSetting('friendsPsk', e.currentTarget.value)}
                        title={t('settings.friend.friendsPskTooltip')}
                    />
                </div>
                <div className={sharedClasses.setting}>
                    <p>{t('settings.friend.unhashedFriendCode', { code: friendCode })}</p>
                </div>
            </details>
        </div>
    </>;
}
