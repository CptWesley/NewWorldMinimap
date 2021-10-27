import clsx from 'clsx';
import { isEqual } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/Button';
import { deleteChannel, putChannel, StoredChannel, updateChannel } from '@/logic/friends';
import { generateRandomToken } from '@/logic/util';
import { makeStyles } from '@/theme';
import { useSharedSettingsStyles } from '../sharedSettingStyles';

interface IProps {
    channel: StoredChannel;
    onChange: () => void;
    onCanceled?: () => void;
    isNew?: boolean;
}

const useStyles = makeStyles()(theme => ({
    root: {
        marginTop: theme.spacing(1),
        border: `1px solid ${theme.detailsBoxBorderColor}`,
        borderRadius: theme.borderRadiusSmall,
    },
    summary: {
        marginBottom: 0,
    },
    content: {
        padding: theme.spacing(1),
    },
    wide: {
        width: 350,
        maxWidth: '100%',
    },
    buttons: {
        display: 'flex',
        gap: theme.spacing(1),
    },
}));

export default function FriendChannelSetting(props: IProps) {
    const {
        channel,
        onChange,
        onCanceled,
        isNew,
    } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();

    const [open, setOpen] = useState(false);
    const [changes, setChanges] = useState<Partial<StoredChannel>>({});

    useEffect(() => {
        if (!open) {
            setChanges({});
        }
    }, [open]);

    const displayChannel = { ...channel, ...changes };

    const title = displayChannel.label || (isNew
        ? t('settings.friendChannels.newChannel')
        : t('settings.friendChannels.channel'));
    const inputToken = useMemo(generateRandomToken, [displayChannel.id]);
    const canSave = displayChannel.label.length > 0 && !isEqual(channel, displayChannel);

    function registerChange<TKey extends keyof StoredChannel>(key: TKey, value: StoredChannel[TKey]) {
        setChanges(c => ({ ...c, [key]: value }));
    }

    function toggleOpen(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        setOpen(isNew || !open);
    }

    function handleCancel() {
        onCanceled?.();
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isNew) {
            await putChannel(displayChannel);
        } else {
            await updateChannel(channel.id, changes);
        }
        setOpen(false);
        onChange();
    }

    async function handleDelete() {
        await deleteChannel(channel);
        setOpen(false);
        onChange();
    }

    const isOpen = isNew || open;

    return <details className={classes.root} open={isOpen} onSubmit={handleSave}>
        <summary
            className={clsx(sharedClasses.summary, classes.summary)}
            onClick={toggleOpen}
        >
            {title}
        </summary>
        {isOpen && <form className={classes.content}>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-id-${inputToken}`}>{t('settings.friendChannels.channelId')}</label>
                </p>
                <input
                    id={`friend-setting-id-${inputToken}`}
                    type='text'
                    className={clsx(sharedClasses.textbox, classes.wide)}
                    onChange={e => registerChange('id', e.currentTarget.value)}
                    value={displayChannel.id}
                />
            </div>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-psk-${inputToken}`}>{t('settings.friendChannels.channelPsk')}</label>
                </p>
                <input
                    id={`friend-setting-psk-${inputToken}`}
                    type='text'
                    className={clsx(sharedClasses.textbox, classes.wide)}
                    onChange={e => registerChange('psk', e.currentTarget.value)}
                    value={displayChannel.psk}
                />
            </div>
            <div className={sharedClasses.setting}>
                <p>
                    <label htmlFor={`friend-setting-label-${inputToken}`}>{t('settings.friendChannels.channelLabel')}</label>
                </p>
                <input
                    id={`friend-setting-label-${inputToken}`}
                    type='text'
                    className={sharedClasses.textbox}
                    onChange={e => registerChange('label', e.currentTarget.value)}
                    value={displayChannel.label}
                />
            </div>
            <div className={sharedClasses.setting}>
                <label className={sharedClasses.color}>
                    <input
                        type='color'
                        onChange={e => registerChange('color', e.currentTarget.value)}
                        value={displayChannel.color}
                    />
                    {t('settings.friendChannels.channelColor')}
                </label>
            </div>

            <div className={classes.buttons}>
                <Button type='submit' disabled={!canSave}>{t('save')}</Button>
                {isNew
                    ? <Button onClick={handleCancel}>{t('cancel')}</Button>
                    : <Button onClick={handleDelete}>{t('delete')}</Button>
                }
            </div>
        </form>}
    </details>;
}
