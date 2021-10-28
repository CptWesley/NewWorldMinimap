import clsx from 'clsx';
import { isEqual } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validate as validateUuid } from 'uuid';
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
    isAdding?: boolean;
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
    disabledSummary: {
        background: 'transparent !important',
    },
    content: {
        padding: theme.spacing(1),
    },
    wide: {
        width: 600,
        maxWidth: '100%',
    },
    buttons: {
        display: 'flex',
        gap: theme.spacing(1),
    },
    colorDot: {
        display: 'inline-block',
        width: '0.8em',
        height: '0.8em',
        borderRadius: '50%',
        marginLeft: theme.spacing(1),
    },
}));

export default function FriendChannelSetting(props: IProps) {
    const {
        channel,
        onChange,
        onCanceled,
        isNew,
        isAdding,
    } = props;
    const { t } = useTranslation();
    const { classes } = useStyles();
    const { classes: sharedClasses } = useSharedSettingsStyles();

    const [open, setOpen] = useState(false);
    const [changes, setChanges] = useState<Partial<StoredChannel>>({});
    const [code, setCode] = useState<string>('');

    useEffect(() => {
        if (!open) {
            setChanges({});
        }
    }, [open]);

    const displayChannel = { ...channel, ...changes };

    const title = displayChannel.label
        || (isNew && t('settings.friendChannels.createChannel'))
        || (isAdding && t('settings.friendChannels.addChannel'))
        || t('settings.friendChannels.channel');
    const inputToken = useMemo(generateRandomToken, [displayChannel.id]);

    const canSave =
        displayChannel.label.length > 0
        && displayChannel.id.length > 0
        && displayChannel.psk.length > 0
        && !isEqual(channel, displayChannel);

    function registerChange<TKey extends keyof StoredChannel>(key: TKey, value: StoredChannel[TKey]) {
        setChanges(c => ({ ...c, [key]: value }));
    }

    function toggleOpen(e: React.MouseEvent<HTMLElement>) {
        e.preventDefault();
        setOpen(isNew || isAdding || !open);
    }

    function handleCancel() {
        onCanceled?.();
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isNew || isAdding) {
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

    function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.currentTarget.value;
        setCode(next);
        const parts = next.split(':');
        // Test for UUID and SHA256 hash
        if (parts.length === 2 && validateUuid(parts[0]) && /^[0-9a-f]{64}$/i.test(parts[1])) {
            registerChange('id', parts[0]);
            registerChange('psk', parts[1]);
        }
    }

    function copyChannelCode() {
        overwolf.utils.placeOnClipboard(`${displayChannel.id}:${displayChannel.psk}`);
    }

    const isOpen = isNew || isAdding || open;
    const disableToggleOpen = isNew || isAdding;

    return <details className={classes.root} open={isOpen} onSubmit={handleSave}>
        <summary
            className={clsx(sharedClasses.summary, classes.summary, disableToggleOpen && classes.disabledSummary)}
            onClick={toggleOpen}
        >
            {title} <div className={classes.colorDot} style={{ backgroundColor: displayChannel.color }} />
        </summary>
        {isOpen && <form className={classes.content}>
            {isAdding &&
                <div className={sharedClasses.setting}>
                    <p>
                        <label htmlFor={`friend-setting-code-${inputToken}`}>{t('settings.friendChannels.channelCode')}</label>
                    </p>
                    <input
                        id={`friend-setting-code-${inputToken}`}
                        type='text'
                        className={clsx(sharedClasses.textbox, classes.wide)}
                        onChange={handleCodeChange}
                        disabled={displayChannel.id.length > 0}
                        value={code}
                    />
                </div>
            }
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
                {isNew || isAdding
                    ? <Button type='button' onClick={handleCancel}>{t('cancel')}</Button>
                    : <Button type='button' onClick={handleDelete}>{t('delete')}</Button>
                }
                {!(isNew || isAdding) &&
                    <Button type='button' onClick={copyChannelCode}>{t('settings.friendChannels.copyChannel')}</Button>
                }
            </div>
        </form>}
    </details>;
}
